# Elden Ring API

REST API for Elden Ring Community Website built with Node.js, Express, and SQLite.

## Quick Start

```bash
# Clone repository
git clone https://github.com/big-dawg-bit/eldenring_API.git
cd eldenring_API

# Install dependencies
npm install

# Create .env file (optional - defaults provided)
PORT=3000
NODE_ENV=development
DB_PATH=../eldenring_site/database/database.sqlite

# Start server
npm start          # Production
npm run dev        # Development (auto-reload)
```

**Access API:** `http://localhost:3000`  
**Documentation:** `http://localhost:3000/`

---

## Features

- **CRUD Operations** - Full Create, Read, Update, Delete for Bosses and News
- **Advanced Validation** - Custom rules with detailed error messages
- **Pagination** - Configurable limit (max 100) and offset
- **Multi-field Search** - Search bosses by name OR location
- **Filtering** - Filter bosses by difficulty (1-5)
- **Sorting** - Bosses by order, News by publication date
- **Error Handling** - Proper HTTP status codes and validation feedback

---

## Database

**Type:** SQLite  
**Location:** `../eldenring_site/database/database.sqlite` (configured in `.env`)  
**Source:** Database migrated from Elden Ring Community Website project

### Tables
- **bosses** - Boss information (name, location, difficulty, health, drops)
- **news** - News articles (title, content, publication date, author)

---

## API Endpoints

### Bosses
- `GET /api/bosses` - Get all bosses (supports `?limit=10&offset=0&search=text&difficulty=3`)
- `GET /api/bosses/:id` - Get single boss
- `POST /api/bosses` - Create boss
- `PUT /api/bosses/:id` - Update boss
- `DELETE /api/bosses/:id` - Delete boss

### News
- `GET /api/news` - Get all news (supports `?limit=10&offset=0&search=text`)
- `GET /api/news/:id` - Get single article
- `POST /api/news` - Create article
- `PUT /api/news/:id` - Update article
- `DELETE /api/news/:id` - Delete article

**Full documentation with examples available at:** `http://localhost:3000/`

---

## Technologies

- Node.js / Express.js
- SQLite3
- express-validator
- CORS enabled

---

## Author

**Arnaud Raspe**  
GitHub: https://github.com/big-dawg-bit/eldenring_API

---

## References

- [Express.js Documentation](https://expressjs.com/)
- [express-validator Documentation](https://express-validator.github.io/docs/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Node.js Documentation](https://nodejs.org/docs/)
- [https://claude.ai/share/815670c7-d673-41a9-847d-b20ecf048257]
---

