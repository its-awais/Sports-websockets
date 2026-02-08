# WebSocket Backend Server

A modern Node.js Express server integrated with **Neon PostgreSQL** and **Drizzle ORM** for type-safe database operations.

## 🚀 Features

- ✅ **Express.js** - Fast and lightweight web framework
- ✅ **Drizzle ORM** - Type-safe database queries
- ✅ **Neon PostgreSQL** - Serverless PostgreSQL database
- ✅ **node-postgres** - Reliable PostgreSQL driver
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete
- ✅ **JSON Middleware** - Automatic JSON parsing
- ✅ **Environment Variables** - Secure configuration with dotenv
- ✅ **Database Migrations** - Drizzle Kit migration support

---

## 📁 Project Structure

```
backend/
├── .env                    # Database connection (add your credentials)
├── package.json            # Dependencies and scripts
├── drizzle.config.js       # Drizzle ORM configuration
├── src/
│   ├── index.js           # Main Express server + routes
│   ├── schema.js          # Database schema definition
│   └── db.js              # Database client initialization
└── drizzle/               # Auto-generated migrations (created after db:generate)
```

---

## 📦 Installation

### Prerequisites
- **Node.js** v16+ 
- **Neon Account** (free tier available at [neon.tech](https://neon.tech))
- **npm** or your preferred package manager

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Open `.env` file
   - Add your Neon database connection string:
     ```env
     DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
     ```
   - Get your connection string from [Neon Console](https://console.neon.tech) → Project → Connect

3. **Generate Migration**
   ```bash
   npm run db:generate
   ```

4. **Run Migration**
   ```bash
   npm run db:migrate
   ```

5. **Start Server**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:8000`

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (auto-reload) |
# its important to generat migration file so when we change column type or add new column then we can easyli change that so  db:generate used to generate migration command and db:migrate apply the changes same as git git add . and git push -u origin main or master
| `npm run db:generate` | Generate migration files from schema |
| `npm run db:migrate` | Apply migrations to database |

---

## 📡 API Endpoints

### Welcome
```http
GET /
```
**Response:**
```json
{
  "message": "Welcome to the server!"
}
```

### Create User
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```
**Response:**
```json
{
  "message": "User created",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-07T10:30:00Z"
  }
}
```

### Get All Users
```http
GET /users
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-07T10:30:00Z"
  }
]
```

### Update User
```http
PUT /users/:id
Content-Type: application/json

{
  "name": "Jane Doe"
}
```
**Response:**
```json
{
  "message": "User updated",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-07T10:30:00Z"
  }
}
```

### Delete User
```http
DELETE /users/:id
```
**Response:**
```json
{
  "message": "User deleted"
}
```

---

## 🗄️ Database Schema

### demo_users Table

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | SERIAL | PRIMARY KEY |
| `name` | TEXT | NOT NULL |
| `email` | TEXT | NOT NULL, UNIQUE |
| `createdAt` | TIMESTAMP | DEFAULT NOW() |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v16+ | Runtime |
| **Express** | ^5.2.1 | Web Framework |
| **Drizzle ORM** | ^0.33.0 | Database ORM |
| **PostgreSQL** (pg) | ^8.11.3 | Database Driver |
| **Neon** | - | Serverless Database |
| **dotenv** | ^16.4.5 | Environment Management |
| **Drizzle Kit** | - | Migration Tool |

---

## 🔐 Security Notes

- ⚠️ **Never** commit `.env` file to version control
- Use environment variables for all sensitive data
- Connection strings should use SSL/TLS enabled (`sslmode=require`)
- Keep dependencies updated: `npm update`

---

## 📚 Useful Links

- [Express.js Documentation](https://expressjs.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Neon Console](https://console.neon.tech)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

## 🚦 Troubleshooting

### Connection Error
**Error:** `DATABASE_URL is not defined`
- **Solution:** Check that `.env` file exists and contains `DATABASE_URL`

### Migration Failed
**Error:** `drizzle-kit not found`
- **Solution:** Run `npm install -D drizzle-kit`

### Port Already in Use
**Error:** `listen EADDRINUSE: address already in use :::8000`
- **Solution:** Change `const PORT = 8000;` in `src/index.js` or kill process using port 8000

---

## 📝 Development Workflow

1. **Create database schema** → Edit `src/schema.js`
2. **Generate migration** → `npm run db:generate`
3. **Apply to database** → `npm run db:migrate`
4. **Add API routes** → Edit `src/index.js`
5. **Test endpoints** → Use Postman, Thunder Client, or cURL
6. **Deploy** → Ready for production!

---

## 📄 License

ISC

---

**Happy Coding! 🎉**
