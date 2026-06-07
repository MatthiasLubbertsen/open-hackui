docker compose down
docker volume rm open-hackui_open-webui
docker compose up -d

openssl rand -hex 32