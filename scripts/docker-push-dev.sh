#!/usr/bin/env bash
set -euo pipefail

IMAGE="ghcr.io/hikka-io/hikka-next:dev"
CACHE_DIR="$HOME/.docker-cache/hikka-next"

# Ensure logged into GHCR
if ! docker login ghcr.io --get-login &>/dev/null; then
    echo "Not logged into ghcr.io. Authenticating..."
    echo "Create a token at https://github.com/settings/tokens with write:packages scope"
    docker login ghcr.io
fi

echo "Building $IMAGE ..."

docker buildx build \
    -f Dockerfile.prod \
    --platform linux/amd64 \
    --push \
    -t "$IMAGE" \
    --cache-from "type=local,src=$CACHE_DIR" \
    --cache-to "type=local,dest=$CACHE_DIR,mode=max" \
    .

echo "Pushed $IMAGE"
