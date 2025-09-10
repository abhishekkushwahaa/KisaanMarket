# Project Paths
Frontend := .
UserBackend := backend/users
MarketBackend := backend/market

.PHONY: install run run-frontend run-userBackend run-marketBackend clean

# Install dependencies
install:
	@echo "Installing dependencies..."
	@cd $(Frontend) && bun install
	@cd $(UserBackend) && bun install
	@cd $(MarketBackend) && bun install

# Run all servers concurrently
run:
	@echo "Starting all servers..."
	@npx concurrently \
		"cd $(UserBackend) && bun run dev" \
		"cd $(MarketBackend) && bun run dev" \
		"cd $(Frontend) && bun expo start"

# Run Frontend only
run-frontend:
	@echo "Starting Frontend (Expo)..."
	@cd $(Frontend) && bun expo start

# Run UserBackend only
run-userBackend:
	@echo "Starting UserBackend..."
	@cd $(UserBackend) && bun run dev

# Run MarketBackend only
run-marketBackend:
	@echo "Starting MarketBackend..."
	@cd $(MarketBackend) && bun run dev

# Clean node_modules and bun.lockb
clean:
	@echo "Cleaning node_modules and bun.lockb..."
	@for dir in $(Frontend) $(UserBackend) $(MarketBackend); do \
		rm -rf $$dir/node_modules $$dir/bun.lockb; \
		cd $$dir && bun install --cache clean; \
	done
