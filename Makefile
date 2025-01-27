# Variables
Frontend=.
UserBackend=backend\users
MarketBackend=backend\market
Env=.env

.PHONY: install run run-frontend run-userBackend run-marketBackend clean

# Install dependencies for Frontend and UserBackend
install:
	@echo "Installing all dependencies for Frontend and Backend..."
	cd "$(Frontend)" && bun install
	cd "$(UserBackend)" && bun install
	cd "$(MarketBackend)" && bun install

# Run both Frontend and UserBackend servers in parallel using new terminal windows
run:
	@echo "Starting Frontend and Backend servers..."
	@npx concurrently \
		"cd $(UserBackend) && bun run dev" \
		"cd $(Frontend) && bun expo start" \
		"cd $(MarketBackend) && bun run dev"
	@echo "Backend and Frontend started..."

# Run Frontend server
run-frontend:
	@echo "Starting the Frontend (Expo) server..."
	cd "$(Frontend)" && bun expo start

# Run MarketBackend server
run-marketBackend:
	@echo "Starting the MarketBackend server..."
	cd "$(MarketBackend)" && bun run dev

# Run UserBackend server
run-userBackend:
	@echo "Starting the UserBackend server..."
	cd "$(UserBackend)" && bun run dev

# Clean node_modules and cache for both Frontend and UserBackend
clean:
	@echo "Cleaning up node_modules and cache..."
	@if exist "$(Frontend)\node_modules" (rmdir /s /q "$(Frontend)\node_modules")
	@if exist "$(Frontend)\bun.lockb" (del /f /q "$(Frontend)\bun.lockb")
	@if exist "$(UserBackend)\node_modules" (rmdir /s /q "$(UserBackend)\node_modules")
	@if exist "$(UserBackend)\bun.lockb" (del /f /q "$(UserBackend)\bun.lockb")
	@if exist "$(MarketBackend)\node_modules" (rmdir /s /q "$(MarketBackend)\node_modules")
	@if exist "$(MarketBackend)\bun.lockb" (del /f /q "$(MarketBackend)\bun.lockb")
	cd "$(Frontend)" && bun install --cache clean
	cd "$(UserBackend)" && bun install --cache clean
	cd "$(MarketBackend)" && bun install --cache clean
