#!/usr/bin/env bash
# Runs the Maestro flows in e2e/<suite> against an app already served by Metro in Expo Go.
# Usage: scripts/e2e.sh <public|local> [extra maestro test args or flow paths]
set -euo pipefail

cd "$(dirname "$0")/.."

suite="${1:-}"
if [[ "$suite" != "public" && "$suite" != "local" ]]; then
    echo "Usage: $0 <public|local> [maestro args]" >&2
    exit 1
fi
shift

export PATH="$PATH:$HOME/.maestro/bin"
export MAESTRO_CLI_NO_ANALYTICS=1
export MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED=true

if ! command -v maestro >/dev/null; then
    echo "maestro not found. Install it: see apps/mobile/README.md (End-to-end tests)." >&2
    exit 1
fi

args=(-e "METRO_URL=${METRO_URL:-exp://localhost:8081}")
for name in E2E_PUBLIC_USER E2E_USERNAME E2E_PASSWORD E2E_FOLLOW_USER E2E_ANIME_QUERY; do
    if [[ -n "${!name:-}" ]]; then
        args+=(-e "$name=${!name}")
    fi
done

device=()
if [[ -n "${E2E_DEVICE:-}" ]]; then
    device=(--device "$E2E_DEVICE")
fi

if [[ "$suite" == "local" ]]; then
    for name in E2E_USERNAME E2E_PASSWORD E2E_FOLLOW_USER; do
        if [[ -z "${!name:-}" ]]; then
            echo "$name is required for the local suite." >&2
            exit 1
        fi
    done
fi

targets=("e2e/$suite")
if [[ $# -gt 0 ]]; then
    targets=("$@")
fi

exec maestro ${device[@]+"${device[@]}"} test "${args[@]}" "${targets[@]}"
