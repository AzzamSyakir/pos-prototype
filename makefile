ENV_FILE := .env
COMPOSE_PATH := ./docker
ENTRYPOINT_PATH=src/cmd/index.js
start-node:
	@clear
	node ${ENTRYPOINT_PATH}
up-dev:
	@clear
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PATH)/docker-compose.dev.yml up -d

down-dev:
	@clear
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PATH)/docker-compose.dev.yml down --remove-orphans

up-prod:
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PATH)/docker-compose.prod.yml up -d

down-prod:
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PATH)/docker-compose.prod.yml down --remove-orphans

restart-dev:
	make down-dev && make up-dev

restart-prod:
	make down-prod && make up-prod
