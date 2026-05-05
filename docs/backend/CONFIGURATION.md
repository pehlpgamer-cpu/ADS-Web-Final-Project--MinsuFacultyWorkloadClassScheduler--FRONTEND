# Backend Configuration for Frontend Developers

Last updated: May 5, 2026

## Local URLs

Backend API base URL:

```txt
http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1
```

Backend API root:

```txt
http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api
```

Normal frontend features should use the `api/v1` base. The only current endpoint outside `api/v1` is the development-only `api/test.php`.

Allowed local frontend origin:

```txt
http://localhost:5173
```

The CORS headers are set in `utils/Headers.php`.

## CORS Behavior

The backend sends:

```txt
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, x-session-token
Access-Control-Max-Age: 86400
```

Browser preflight requests return:

```txt
HTTP/1.1 204 No Content
```

Do not add custom frontend headers unless the backend CORS allow-list includes them.

## Frontend Environment

Recommended Vite env:

```env
VITE_API_BASE=http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1
```

Use it in code:

```js
const API_BASE = import.meta.env.VITE_API_BASE;
```

## Backend `.env`

The backend database connector reads these keys:

```env
MYSQL_HOSTNAME=localhost
MYSQL_USERNAME=root
MYSQL_PASSWORD=
MYSQL_NAME=your_database_name
```

These values are loaded by `vlucas/phpdotenv` in `database/ConnectDatabase.php`.

## Auth Header

This backend does not use `Authorization: Bearer`. Use:

```txt
x-session-token: <session_token>
```

## JSON Requests

For `POST` and `PUT`, send:

```txt
Content-Type: application/json
```

and a JSON-encoded body.

## Production Reminders

Before deployment:

- Change `Access-Control-Allow-Origin` to the production frontend origin.
- Use HTTPS for both frontend and backend.
- Move secrets into environment variables.
- Avoid committing real `.env` values.
- Confirm PHP error display is disabled in production.
- Confirm the API base URL in the frontend production build points to the deployed backend.
