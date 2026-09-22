.DEFAULT_GOAL := help

.PHONY: help check-env install dev build start preview clean
.PHONY: check-lang-env lang lang-fix setup-precommit precommit super-linter super-linter-fix

SHELL := /usr/bin/env bash
.SHELLFLAGS := -eu -o pipefail -c

NPM ?= npm
UV ?= uv
TEXTLINT_CONFIG ?= .github/linters/.textlintrc
TEXTLINT_IGNORE ?= .github/linters/.textlintignore

help:
	@echo "Available commands:"
	@echo ""
	@echo "development targets:"
	@echo "  check-env        - Ensure npm and Node.js are available"
	@echo "  install          - Install dependencies using npm"
	@echo "  dev              - Start Next.js local development server"
	@echo "  build            - Build Next.js production assets into .next/"
	@echo "  start            - Start Next.js production server"
	@echo "  preview          - Alias for start"
	@echo "  clean            - Remove build artifacts and caches"
	@echo ""
	@echo "quality & automation targets:"
	@echo "  lang             - Run textlint on project documentation"
	@echo "  lang-fix         - Run textlint with --fix"
	@echo "  setup-precommit  - Install pre-commit hooks via uv"
	@echo "  precommit        - Run pre-commit hooks on all files"
	@echo "  super-linter     - Run super-linter via Docker (local check)"
	@echo "  super-linter-fix - Run super-linter with auto-fix via Docker"

check-env:
	@if command -v $(NPM) >/dev/null 2>&1; then \
		echo "[check-env] npm found ($$($(NPM) -v))"; \
	else \
		echo "[check-env] ❌ npm not found; install Node.js and npm"; \
		exit 1; \
	fi

install: check-env
	@echo "[install] Installing dependencies (npm)..."
	@$(NPM) install

dev: install
	@echo "[dev] Starting development server..."
	@$(NPM) run dev

build: install
	@echo "[build] Building Next.js project..."
	@$(NPM) run build

start: install
	@echo "[start] Starting production server..."
	@$(NPM) run start

preview: start

clean:
	@echo "[clean] Removing build and cache artifacts..."
	@rm -rf .next/ out/ dist/

check-lang-env:
	@echo "[check-lang-env] Ensuring Node.js environment for textlint..."
	@which npx >/dev/null 2>&1 || (echo "[check-lang-env] ❌ npx not found; install Node.js" && exit 1)
	@npm install --no-save textlint textlint-rule-terminology textlint-filter-rule-comments >/dev/null 2>&1
	@echo "[check-lang-env] OK"

lang: check-lang-env
	@echo "[lang] Running textlint..."
	@npx textlint --config $(TEXTLINT_CONFIG) --ignore-path $(TEXTLINT_IGNORE) .

lang-fix: check-lang-env
	@echo "[lang-fix] Running textlint --fix..."
	@npx textlint --config $(TEXTLINT_CONFIG) --ignore-path $(TEXTLINT_IGNORE) . --fix

setup-precommit:
	@echo "[setup-precommit] Installing pre-commit hooks..."
	@$(UV) run --with pre-commit pre-commit install --install-hooks

precommit:
	@echo "[precommit] Running pre-commit on all files..."
	@$(UV) run --with pre-commit pre-commit run --all-files

super-linter:
	@echo "[super-linter] Running super-linter via Docker..."
	@GIT_COMMON_DIR=$$(git rev-parse --path-format=absolute --git-common-dir) && \
	GIT_DIR=$$(git rev-parse --path-format=absolute --git-dir) && \
	docker run \
		--platform linux/amd64 \
		-e RUN_LOCAL=true \
		-e DEFAULT_BRANCH=main \
		--env-file .github/super-linter.env \
		-v $$(pwd):/tmp/lint \
		-v $$GIT_DIR:$$GIT_DIR \
		-v $$GIT_COMMON_DIR:$$GIT_COMMON_DIR \
		--rm \
		ghcr.io/super-linter/super-linter:v8.6.0

super-linter-fix:
	@echo "[super-linter-fix] Running super-linter with auto-fix via Docker..."
	@GIT_COMMON_DIR=$$(git rev-parse --path-format=absolute --git-common-dir) && \
	GIT_DIR=$$(git rev-parse --path-format=absolute --git-dir) && \
	docker run \
		--platform linux/amd64 \
		-e RUN_LOCAL=true \
		-e DEFAULT_BRANCH=main \
		--env-file .github/super-linter.env \
		--env-file .github/super-linter-fix.env \
		-v $$(pwd):/tmp/lint \
		-v $$GIT_DIR:$$GIT_DIR \
		-v $$GIT_COMMON_DIR:$$GIT_COMMON_DIR \
		--rm \
		ghcr.io/super-linter/super-linter:v8.6.0
