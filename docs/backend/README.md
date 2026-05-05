# Faculty Workload Scheduler API Documentation

Last updated: May 5, 2026

This folder contains the frontend integration docs for the PHP backend under `api/v1/`.

## Start Here

1. [FRONTEND_DEVELOPER_START_HERE.md](FRONTEND_DEVELOPER_START_HERE.md)
   - 5-minute setup path for a frontend developer.
   - Base URL, login flow, headers, response envelope, and first requests.
2. [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
   - Endpoint matrix, auth requirements, route path patterns, roles, and common query params.
3. [API_ENDPOINTS.md](API_ENDPOINTS.md)
   - Full endpoint reference with request fields, filters, responses, and current backend notes.

## Integration Guides

- [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
  - Fetch client, route helpers, authentication storage, pagination, and logout.
- [COMMON_PATTERNS.md](COMMON_PATTERNS.md)
  - Ready-to-copy patterns for API requests, forms, tables, protected routes, and schedules.
- [ERROR_HANDLING.md](ERROR_HANDLING.md)
  - Shared response envelope, validation errors, auth errors, CORS, and rate limiting.
- [CONFIGURATION.md](CONFIGURATION.md)
  - Local backend URL, CORS origin, required `.env` keys, and deployment reminders.

## Data Reference

- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
  - Frontend-friendly table and relationship overview.
- [schema.md](schema.md)
  - Source schema notes and sample seed records.
- [tutorials.md](tutorials.md)
  - Additional learning notes.

## Backend Facts Frontend Must Know

- Local API base URL:
  `http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1`
- Development-only endpoint outside `api/v1`:
  `http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/test.php`
- Allowed frontend origin:
  `http://localhost:5173`
- Protected routes require:
  `x-session-token: <session_token>`
- JSON bodies require:
  `Content-Type: application/json`
- Browser preflight (`OPTIONS`) returns:
  `204 No Content`
- Login and register validation can return HTTP `200` with `"success": false`; always check the JSON `success` field.
- Role IDs:
  `1 = admin`, `2 = program_chair`

## Recommended Reading Order

1. Read [FRONTEND_DEVELOPER_START_HERE.md](FRONTEND_DEVELOPER_START_HERE.md).
2. Copy the request helper from [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md).
3. Use [QUICK_REFERENCE.md](QUICK_REFERENCE.md) while building screens.
4. Open [API_ENDPOINTS.md](API_ENDPOINTS.md) when you need exact request fields and filters.
5. Use [ERROR_HANDLING.md](ERROR_HANDLING.md) before wiring UI error states.
