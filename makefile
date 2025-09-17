ENV_FILE := .env
ENV_FILE_TEST := .env.test
COMPOSE_PATH := ./docker
ENTRYPOINT_PATH := src/cmd/index.js
start-node:
	@clear
	nodemon ${ENTRYPOINT_PATH}
up-dev:
	@clear
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PATH)/docker-compose.dev.yml up -d

down-dev:
	@clear
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PATH)/docker-compose.dev.yml down --remove-orphans

up-prod:
	@clear
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PATH)/docker-compose.prod.yml up -d

down-prod:
	docker compose --env-file $(ENV_FILE) -f $(COMPOSE_PATH)/docker-compose.prod.yml down --remove-orphans

restart-dev:
	make down-dev && make up-dev

restart-prod:
	make down-prod && make up-prod

test:
	@clear
	docker compose --env-file $(ENV_FILE_TEST) -f $(COMPOSE_PATH)/docker-compose.test.yml up -d
	@echo "Waiting for all services to be healthy..."
	@for service in app-db-test redis-test; do \
		echo "Waiting $$service..."; \
		until [ "$$(docker inspect --format='{{.State.Health.Status}}' $$service)" = "healthy" ]; do \
			sleep 2; \
		done; \
	done
	@echo "All services healthy. Running tests..."
	@{ \
		npm test; \
		EXIT_CODE=$$?; \
		docker compose --env-file $(ENV_FILE_TEST) -f $(COMPOSE_PATH)/docker-compose.test.yml down -v; \
		exit $$EXIT_CODE; \
	}
