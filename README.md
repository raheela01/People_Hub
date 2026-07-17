# People Hub API

A simple REST API to manage employees and departments. Built with Node.js, Express and MySQL.

## Requirements

Make sure you have the following installed before running the project:
- Node.js v18 or higher
- MySQL v8 or higher

## Getting Started

**1. Install dependencies**
```bash
npm install
```

**2. Set up the database**

Import the SQL file to create the database and tables:
```bash
mysql -u root -p < people_hub.sql
```

**3. Configure your environment**

Create a `.env` file in the root folder (you can copy `.env.example`) and update the values:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=people_hub
PORT=3000
```

**4. Run the server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

## Project Structure

```
people-hub/
├── app.js
├── package.json
├── .env
├── people_hub.sql
├── config/
│   └── db.js
├── routes/
│   ├── departments.js
│   ├── employees.js
│   └── dashboard.js
├── controllers/
│   ├── departmentController.js
│   ├── employeeController.js
│   └── dashboardController.js
├── models/
│   ├── departmentModel.js
│   └── employeeModel.js
└── middlewares/
    └── errorHandler.js
```

## API Endpoints

All responses follow this format:
```json
{ "success": true/false, "message": "...", "data": ... }
```

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /departments | Create a new department (duplicates not allowed) |
| GET | /departments | Get all departments |
| PUT | /departments/:id | Update a department name |
| DELETE | /departments/:id | Delete a department (blocked if it has employees) |

**POST /departments – body:**
```json
{ "departmentName": "Engineering" }
```

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /employees | Add a new employee |
| GET | /employees | List employees (supports pagination, search, filters) |
| GET | /employees/:id | Get a single employee with their department name |
| PUT | /employees/:id | Update employee details |
| DELETE | /employees/:id | Delete an employee |
| PATCH | /employees/:id/status | Activate or deactivate an employee |
| GET | /employees/export | Download all employees as CSV |

**POST /employees – body:**
```json
{
  "employeeCode": "EMP010",
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "departmentId": 1,
  "designation": "Software Engineer",
  "salary": 60000,
  "status": "Active"
}
```

**GET /employees – query params:**
- `page` – page number (default: 1)
- `limit` – results per page (default: 10)
- `search` – searches by name, email or employee code
- `departmentId` – filter by department
- `status` – filter by `Active` or `Inactive`

Example: `GET /employees?page=1&limit=10&search=john&status=Active`

**PATCH /employees/:id/status – body:**
```json
{ "status": "Inactive" }
```

### Validations on employee create/update
- `fullName` is required
- `employeeCode` must be unique
- `email` must be unique and a valid email address
- `mobile` can only contain digits
- `departmentId` must refer to an existing department

### Dashboard

`GET /dashboard` returns a summary of total employees, active/inactive counts, total departments and a breakdown of employees per department.

## Postman Collection

Import `postman_collection.json` into Postman to get all endpoints ready to test with example request bodies already filled in.
