# ReBreath - Air Quality Assessment Platform

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
OPENWEATHER_API_KEY=1e1d29af36816528853ace8607216960
PORT=3001
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with:

```env
VITE_BACKEND_URL=http://localhost:3001
```

## Running the Application

### Backend
```bash
cd backend
npm install
npm run dev
# or
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Health Assessment
- **POST** `/api/health-assessment`
- **Content-Type**: `application/json`

**Request Body:**
```json
{
  "sex": "male|female",
  "isPregnant": true|false,
  "age": number,
  "respiratoryCondition": "none|asthma|copd|bronchitis|pneumonia|allergic rhinitis|other",
  "cardiovascularCondition": "none|hypertension|heart disease|arrhythmia|heart failure|stroke history|other",
  "city": "string"
}
```

**Response:**
```json
{
  "success": true,
  "assessment": {
    "id": "string",
    "sex": "string",
    "isPregnant": boolean,
    "age": number,
    "respiratoryCondition": "string",
    "cardiovascularCondition": "string",
    "city": "string",
    "timestamp": "string",
    "riskLevel": "low|medium|high"
  },
  "recommendations": ["array of strings"],
  "message": "string"
}
```

## Testing with Postman

Import the `postman-tests.json` file into Postman to test all endpoints with pre-configured test cases.

## Git Setup

The `.env` files are automatically ignored by git to keep sensitive information secure. The `.gitignore` files are configured at both root and project levels to ensure proper exclusion of environment variables and other sensitive files.