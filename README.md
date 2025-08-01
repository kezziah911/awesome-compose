## 📦 Integration Project - React + Node.js + MongoDB + Azure Function

### 🔧 Architecture Diagram

### 🧩 Service Flow and Integration Points

- **Frontend** sends actions (e.g., low stock, restock) to the **Node.js Express backend**
- **Backend** receives the requests at routes like `/api/restock`, `/api/lowstock`
- The backend triggers an **Azure Function** using a `POST` request with payload
- Azure Function handles alerts, notifications, or backend processing
- All services run in **Docker containers**, orchestrated by **Docker Compose**
