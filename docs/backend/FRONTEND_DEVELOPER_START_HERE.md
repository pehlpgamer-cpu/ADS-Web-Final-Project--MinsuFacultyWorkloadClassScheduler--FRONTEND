# Frontend Developer Start Here

Last updated: May 5, 2026

Use this first if you are building the frontend for this backend.

## 1. Base URL

```js
const API_BASE =
  "http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1";
```

All normal frontend routes use this `api/v1` base. The repository also has `api/test.php`, but that endpoint is a public development utility for generating a password hash/salt and is not part of normal app flows.

The backend CORS config currently allows frontend requests from:

```txt
http://localhost:5173
```

If the Vite/dev server port changes, the backend CORS origin in `utils/Headers.php` must be updated.

## 2. Response Shape

Every API response is JSON in this envelope:

```json
{
  "success": true,
  "message": "operation description",
  "data": null,
  "errors": null,
  "meta": {
    "timestamp": "07:30:00"
  }
}
```

List endpoints add pagination inside `meta`:

```json
{
  "total": 37,
  "page": 1,
  "limit": 10,
  "pages": 4,
  "hasNext": true,
  "hasPrev": false
}
```

Always check `body.success`, not only `response.ok`. Login/register validation failures can use HTTP `200` with `"success": false`.

## 3. Authentication Flow

Login:

```http
POST /auth/login.php
Content-Type: application/json
```

```json
{
  "email": "admin@gmail.com",
  "password": "P@ssw0rd"
}
```

Successful login returns:

```json
{
  "success": true,
  "message": "login successful",
  "data": {
    "form_data": {
      "email": "admin@gmail.com",
      "password": "P@ssw0rd"
    },
    "session_token": "token-value",
    "role_id": 1
  }
}
```

Store:

- `data.session_token` for `x-session-token`
- `data.role_id` for role-gated UI

Role IDs:

| Role | ID | Frontend usage |
|---|---:|---|
| Admin | `1` | Show management, create, update, delete, generate schedule |
| Program Chair | `2` | Show authenticated read screens and allowed non-admin actions |

## 4. Protected Requests

Send the token on protected endpoints:

```js
await fetch(`${API_BASE}/courses.php?page=1&limit=10`, {
  headers: {
    "x-session-token": sessionToken,
  },
});
```

Send JSON bodies like this:

```js
await fetch(`${API_BASE}/programs.php`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-session-token": sessionToken,
  },
  body: JSON.stringify({ program: "BSIT" }),
});
```

## 5. Single-Record URLs

Most endpoints are plain PHP files. For a single record, pass a `path` query parameter.

Examples:

```txt
courses.php?path=v1/courses/5
users.php?path=v1/users/5
course-instructors.php?path=api/v1/course-instructors/5
schedules.php?path=api/v1/schedules/5
```

See [QUICK_REFERENCE.md](QUICK_REFERENCE.md#single-record-path-patterns) for the exact pattern by endpoint.

## 6. Logout

```js
await fetch(`${API_BASE}/auth/logout.php`, {
  method: "POST",
  headers: {
    "x-session-token": sessionToken,
  },
});
```

Clear local auth state after logout. The backend marks the session as logged out, but the auth middleware currently validates by token and expiry only, so the frontend should still remove the token immediately.

## 7. First Screens to Build

Recommended order:

1. Login page using `auth/login.php`
2. Protected app shell using stored `session_token`
3. Programs list using `programs.php?page=1&limit=10`
4. Courses list and CRUD using `courses.php`
5. Schedule collections and schedules
6. Generate schedule action using `generate_schedule.php`

## 8. Use These Docs While Building

- Endpoint matrix: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- Full fields and filters: [API_ENDPOINTS.md](API_ENDPOINTS.md)
- Request helper and UI patterns: [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
- Error states: [ERROR_HANDLING.md](ERROR_HANDLING.md)
