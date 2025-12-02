Param(
  [switch]$Rebuild
)

$ErrorActionPreference = "Stop"

if ($Rebuild) {
  docker compose build
}

docker compose up --build -d

docker compose ps

