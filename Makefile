# Variables
Frontend=.
Backend=backend\users
Env=.env

.PHONY: install run run-frontend run-backend clean

# Install dependencies for Frontend and Backend
install:
	@echo "Installing all dependencies for Frontend and Backend..."
	cd "$(Frontend)" && bun install
	cd "$(Backend)" && bun install

# Run both Frontend and Backend servers in parallel using new terminal windows
run:
	@echo "Starting Frontend and Backend servers..."
	@npx concurrently \
		"cd $(Backend) && bun run dev" \
		"cd $(Frontend) && bun expo start"
	@echo "Backend and frontend started..."

# Run Frontend server
run-frontend:
	@echo "Starting the Frontend (Expo) server..."
	cd "$(Frontend)" && bun expo start

# Run Backend server
run-backend:
	@echo "Starting the Backend server..."
	cd "$(Backend)" && bun run dev

# Clean node_modules and cache for both Frontend and Backend
clean:
	@echo "Cleaning up node_modules and cache..."
	@if exist "$(Frontend)\node_modules" (rmdir /s /q "$(Frontend)\node_modules")
	@if exist "$(Frontend)\bun.lockb" (del /f /q "$(Frontend)\bun.lockb")
	@if exist "$(Backend)\node_modules" (rmdir /s /q "$(Backend)\node_modules")
	@if exist "$(Backend)\bun.lockb" (del /f /q "$(Backend)\bun.lockb")
	cd "$(Frontend)" && bun install --cache clean
	cd "$(Backend)" && bun install --cache clean
