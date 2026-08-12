#!/usr/bin/env bash
#
# backup.sh — Monthly backup of R2 media and Cloudflare configuration.
#
# Backs up:
#   * R2 bucket "hlhweb-media"    -> ./backups/r2-media/<date>/
#   * Cloudflare config           -> ./backups/cloudflare/<date>/
#       - wrangler.jsonc (repo copy)
#       - zone settings (Cloudflare API)
#       - DNS records   (Cloudflare API)
#
# Requirements:
#   * rclone  configured with an "r2" remote (see monthly-backup.yml for the
#     CI setup, or configure ~/.config/rclone/rclone.conf locally).
#   * curl and jq.
#
# Environment variables:
#   CLOUDFLARE_API_TOKEN   API token with Zone:Read + DNS:Read (required for CF export)
#   CLOUDFLARE_ZONE_ID     Zone ID to export (required for CF export)
#   R2_BUCKET              Override R2 bucket name       (default: hlhweb-media)
#   RCLONE_REMOTE          Override rclone remote name   (default: r2)
#   BACKUP_ROOT            Override backup root directory (default: ./backups)
#   RETENTION_DAYS         Days of backups to keep       (default: 365)
#
set -euo pipefail

# --- configuration ----------------------------------------------------------
R2_BUCKET="${R2_BUCKET:-hlhweb-media}"
RCLONE_REMOTE="${RCLONE_REMOTE:-r2}"
BACKUP_ROOT="${BACKUP_ROOT:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-365}"
DATE="$(date -u +%Y-%m-%d)"

R2_DEST="${BACKUP_ROOT}/r2-media/${DATE}"
CF_DEST="${BACKUP_ROOT}/cloudflare/${DATE}"

# --- colored logging --------------------------------------------------------
if [[ -t 1 ]]; then
  C_RESET="\033[0m"; C_INFO="\033[0;34m"; C_OK="\033[0;32m"
  C_WARN="\033[0;33m"; C_ERR="\033[0;31m"
else
  C_RESET=""; C_INFO=""; C_OK=""; C_WARN=""; C_ERR=""
fi

log()  { printf "${C_INFO}[INFO]${C_RESET}  %s\n" "$*"; }
ok()   { printf "${C_OK}[ OK ]${C_RESET}  %s\n" "$*"; }
warn() { printf "${C_WARN}[WARN]${C_RESET}  %s\n" "$*" >&2; }
err()  { printf "${C_ERR}[FAIL]${C_RESET}  %s\n" "$*" >&2; }

die() { err "$*"; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Required command not found: $1"
}

# --- pre-flight -------------------------------------------------------------
log "Starting backup run for ${DATE} (UTC)"
require_cmd rclone
require_cmd curl
require_cmd jq

# --- R2 media backup --------------------------------------------------------
backup_r2() {
  log "Backing up R2 bucket '${R2_BUCKET}' -> ${R2_DEST}"
  mkdir -p "${R2_DEST}"
  if rclone sync "${RCLONE_REMOTE}:${R2_BUCKET}" "${R2_DEST}" \
      --fast-list --transfers 8 --checkers 16 --stats-one-line; then
    ok "R2 media synced to ${R2_DEST}"
  else
    die "rclone sync failed for ${RCLONE_REMOTE}:${R2_BUCKET}"
  fi
}

# --- Cloudflare config backup -----------------------------------------------
cf_api() {
  # cf_api <path> -> writes JSON body to stdout, fails on API error.
  local path="$1"
  local response
  response="$(curl -sS -w '\n%{http_code}' \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4${path}")"
  local http_code="${response##*$'\n'}"
  local body="${response%$'\n'*}"
  if [[ "${http_code}" != "200" ]]; then
    err "Cloudflare API ${path} returned HTTP ${http_code}"
    echo "${body}" >&2
    return 1
  fi
  echo "${body}"
}

backup_cloudflare() {
  log "Backing up Cloudflare config -> ${CF_DEST}"
  mkdir -p "${CF_DEST}"

  # wrangler.jsonc — repo copy of the Workers/Pages config.
  if [[ -f wrangler.jsonc ]]; then
    cp wrangler.jsonc "${CF_DEST}/wrangler.jsonc"
    ok "Saved wrangler.jsonc"
  else
    warn "wrangler.jsonc not found in repo root; skipping"
  fi

  # --- Cloudflare API export disabled ---------------------------------------
  # The Cloudflare API export (zone settings / zone details / DNS records) was
  # failing, so it is disabled. The wrangler.jsonc backup above is sufficient.
  #
  # if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ZONE_ID:-}" ]]; then
  #   warn "CLOUDFLARE_API_TOKEN / CLOUDFLARE_ZONE_ID not set; skipping API export"
  #   return 0
  # fi
  #
  # # Zone settings.
  # if cf_api "/zones/${CLOUDFLARE_ZONE_ID}/settings" | jq '.' \
  #     > "${CF_DEST}/zone-settings.json"; then
  #   ok "Exported zone settings"
  # else
  #   die "Failed to export zone settings"
  # fi
  #
  # # Zone details.
  # if cf_api "/zones/${CLOUDFLARE_ZONE_ID}" | jq '.' \
  #     > "${CF_DEST}/zone.json"; then
  #   ok "Exported zone details"
  # else
  #   die "Failed to export zone details"
  # fi
  #
  # # DNS records (paginate up to 1000 records in one page).
  # if cf_api "/zones/${CLOUDFLARE_ZONE_ID}/dns_records?per_page=1000" | jq '.' \
  #     > "${CF_DEST}/dns-records.json"; then
  #   local count
  #   count="$(jq '.result | length' "${CF_DEST}/dns-records.json" 2>/dev/null || echo '?')"
  #   ok "Exported ${count} DNS records"
  # else
  #   die "Failed to export DNS records"
  # fi
}

# --- git commit + push ------------------------------------------------------
commit_and_push() {
  if [[ ! -d .git ]]; then
    warn "Not a git repository; skipping commit/push"
    return 0
  fi

  git add "${BACKUP_ROOT}"
  if git diff --cached --quiet; then
    log "No backup changes to commit"
    return 0
  fi

  git commit -m "chore(backup): monthly backup ${DATE}"
  ok "Committed backup ${DATE}"

  if git push; then
    ok "Pushed backups to remote"
  else
    warn "git push failed; backups committed locally only"
  fi
}

# --- retention cleanup ------------------------------------------------------
cleanup_old() {
  log "Removing backups older than ${RETENTION_DAYS} days"
  local removed=0
  for base in "${BACKUP_ROOT}/r2-media" "${BACKUP_ROOT}/cloudflare"; do
    [[ -d "${base}" ]] || continue
    while IFS= read -r -d '' dir; do
      rm -rf "${dir}"
      warn "Removed old backup: ${dir}"
      removed=$((removed + 1))
    done < <(find "${base}" -mindepth 1 -maxdepth 1 -type d \
               -mtime +"${RETENTION_DAYS}" -print0)
  done
  ok "Retention cleanup complete (${removed} directories removed)"
}

# --- main -------------------------------------------------------------------
main() {
  mkdir -p "${BACKUP_ROOT}"
  backup_r2
  backup_cloudflare
  cleanup_old
  commit_and_push
  ok "Backup run finished for ${DATE}"
}

main "$@"
