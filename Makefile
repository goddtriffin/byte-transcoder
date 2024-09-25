$(VERBOSE).SILENT:
.DEFAULT_GOAL := help

.PHONY: help
help: # Prints out help
	@IFS=$$'\n' ; \
	help_lines=(`fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##/:/'`); \
	printf "%-30s %s\n" "target" "help" ; \
	printf "%-30s %s\n" "------" "----" ; \
	for help_line in $${help_lines[@]}; do \
			IFS=$$':' ; \
			help_split=($$help_line) ; \
			help_command=`echo $${help_split[0]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
			help_info=`echo $${help_split[2]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
			printf '\033[36m'; \
			printf "%-30s %s" $$help_command ; \
			printf '\033[0m'; \
			printf "%s\n" $$help_info; \
	done
	@echo

.PHONY: lint
lint: ## lints the codebase
	cargo fmt
	deno lint ./src-ts/**/*.ts
	deno doc --lint ./src-ts/**/*.ts
	deno fmt ./src-ts/**/*.ts

.PHONY: test
test: ## runs tests
	cargo fmt --check
	cargo check
	cargo clippy --tests
	cargo test
	deno test --allow-read

.PHONY: fix
fix: ## auto-fixes (some) linter issues
	cargo fix --allow-dirty
	cargo clippy --fix --allow-dirty
