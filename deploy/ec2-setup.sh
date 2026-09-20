#!/usr/bin/env bash
# Pregătește o instanță EC2 (Ubuntu 24.04) pentru docker-compose.prod.yml.
# Se poate rula ca User data la lansarea instanței sau manual, prin SSH:
#   curl -fsSL <raw-url>/deploy/ec2-setup.sh | sudo bash
set -euo pipefail

SWAP_FILE=/swapfile
SWAP_SIZE=2G
TARGET_USER="${SUDO_USER:-ubuntu}"

echo "==> Actualizez pachetele"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl git

echo "==> Instalez Docker Engine + plugin compose"
install -m 0755 -d /etc/apt/keyrings
if [ ! -f /etc/apt/keyrings/docker.asc ]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
fi
cat >/etc/apt/sources.list.d/docker.list <<EOF
deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable
EOF
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

echo "==> Adaug $TARGET_USER în grupul docker"
usermod -aG docker "$TARGET_USER" || true

# 1 GB RAM nu e suficient pentru build-ul Vite; swap-ul previne OOM la npm run build.
if ! swapon --show | grep -q "$SWAP_FILE"; then
  echo "==> Creez $SWAP_SIZE swap"
  fallocate -l "$SWAP_SIZE" "$SWAP_FILE"
  chmod 600 "$SWAP_FILE"
  mkswap "$SWAP_FILE"
  swapon "$SWAP_FILE"
  grep -q "$SWAP_FILE" /etc/fstab || echo "$SWAP_FILE none swap sw 0 0" >>/etc/fstab
fi

echo "==> Gata. Deconectează-te și reconectează-te ca să prindă grupul docker."
docker --version
docker compose version
