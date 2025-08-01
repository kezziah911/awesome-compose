## 📦 Integration Project - React + Node.js + MongoDB + Azure Function

### 🧩 Service Flow and Integration Points

### 🔄 Service Flow
1. React frontend sends data to the backend API.
2. Express.js backend processes the data and sends events (e.g., restock, low stock) to an Azure Function.
3. Azure Function receives and logs or processes the event.

### ⚙️ Integration Points
- Backend container (Node.js) triggers Azure Function using `fetch()`.
- Azure Function is set in `.env` as `FUNCTION_URL`.

### 🐳 Docker Compose Usage
- All services (`frontend`, `backend`, `mongo`) defined in `compose.yaml`.
- Run: `docker compose up --build`

### ☁️ Azure Function Usage
- Hosted using HTTP trigger.
- Accepts POST request from backend with event payload.
