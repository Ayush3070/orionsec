.PHONY: dev dev-backend dev-intel dev-frontend stop clean

dev: dev-backend dev-intel dev-frontend
	@echo "✓ All services started!"
	@echo "Visit: http://localhost:5173"

dev-backend:
	@echo "Starting backend on port 8000..."
	cd backend && python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

dev-intel:
	@echo "Starting intel-backend on port 8080..."
	cd intel-backend && node server.js &

dev-frontend:
	@echo "Starting frontend on port 5173..."
	cd frontend && npm run dev

stop:
	pkill -f "uvicorn|node server.js|vite" || true
	@echo "✓ All services stopped"

clean:
	find . -name "__pycache__" -o -name "*.pyc" | xargs rm -rf
	cd frontend && rm -rf dist node_modules/.cache
	@echo "✓ Cleaned up"

install:
	cd backend && pip3 install -r requirements.txt
	cd intel-backend && npm install
	cd frontend && npm install
	@echo "✓ All dependencies installed"

docker:
	docker-compose up -d
	@echo "✓ Docker containers started"
	@echo "Visit: http://localhost:5173"
