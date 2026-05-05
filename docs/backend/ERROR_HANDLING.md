# Error Handling Guide

Last updated: May 5, 2026

## Shared Response Envelope

All endpoints return the same envelope:

```json
{
  "success": false,
  "message": "invalid values",
  "data": null,
  "errors": {
    "email": ["must be a valid email"]
  },
  "meta": {
    "timestamp": "07:30:00"
  }
}
```

Frontend rule:

```js
if (!response.ok || body.success === false) {
  // show body.message or field-level body.errors
}
```

## HTTP Statuses Used

| Status | Meaning in this API | Frontend action |
|---:|---|---|
| `200` | Success, or login/register validation failure with `success: false` | Check body `success` |
| `201` | Created, including schedule generation | Show success and refresh relevant list |
| `204` | CORS preflight only | Browser handles automatically |
| `400` | Validation error, missing required token on logout, bad request | Show field errors or message |
| `401` | Invalid login credentials | Show login error |
| `403` | Authenticated but action blocked | Hide or disable action for current role |
| `404` | Missing record, unauthenticated, or unauthorized from auth middleware | For auth messages, clear session; for not-found, show empty/not found state |
| `405` | Method not allowed | Check endpoint method/file URL |
| `409` | Conflict, such as referenced user delete or schedule placement failure | Show conflict message |
| `422` | Valid request but cannot produce schedule | Show corrective message |
| `429` | Login rate limit | Disable login temporarily |
| `500` | Database/server error, and empty token from auth middleware | Show generic error; clear session if message is `invalid token!` |

## Validation Errors

Validation errors usually look like this:

```json
{
  "success": false,
  "message": "invalid values",
  "errors": {
    "password": [
      "min length is 8",
      "at least 1 uppercase",
      "at least 1 number"
    ]
  }
}
```

Render field errors from `errors[field]`. Some fields may exist with an empty array; show only non-empty arrays.

Known validation messages:

| Message | Meaning |
|---|---|
| `this field is required` | Missing or empty field |
| `must be a valid email` | Invalid email format |
| `min length is N` | String length is shorter than `N` |
| `max length is N` | String length is longer than `N` |
| `at least 1 uppercase` | Password requires uppercase letter |
| `at least 1 lowercase` | Password requires lowercase letter |
| `at least 1 number` | Password requires number |
| `at least 1 special character` | Password requires special character |
| `must be numeric` | Numeric string or number required |
| `must be integer` | Integer required |
| `must be boolean` | Boolean-like value required |

## Authentication Errors

The auth middleware currently returns nonstandard statuses:

| Body message | HTTP status | Cause | Frontend action |
|---|---:|---|---|
| `invalid token!` | `500` | Missing/empty token passed to protected middleware | Clear token and redirect to login |
| `unauthenticated` | `404` | Token not found or expired | Clear token and redirect to login |
| `unauthorized` | `404` | Token is valid but role is not allowed | Show forbidden page or hide action |
| `session token required` | `400` | `auth/logout.php` called without token | Clear local session anyway |

Session tokens expire 24 hours after login.

## Login Errors

| Message | Status | UI behavior |
|---|---:|---|
| `login successful` | `200` | Store `data.session_token` and `data.role_id` |
| `invalid values` | `200` | Show field validation errors |
| `invalid credentials` | `401` | Show generic email/password error |
| `Too many login attempts. Please try again after 10 minutes.` | `429` | Disable/retry later |

## CORS Errors

Expected local frontend origin:

```txt
http://localhost:5173
```

Expected preflight behavior:

```txt
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, x-session-token
```

If the browser reports CORS failure:

- Confirm the frontend URL is exactly `http://localhost:5173`.
- Confirm the backend URL starts with `http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1`.
- Confirm protected requests use `x-session-token`, not `Authorization`.
- Confirm JSON requests use `Content-Type: application/json`.

## Deleting Records

Deletes can fail if the record is referenced by other tables. Example:

```json
{
  "success": false,
  "message": "user is referenced by other records"
}
```

Show a clear UI message like "This record is still used by other data and cannot be deleted."

## Schedule Generation Errors

| Message | Status | Meaning |
|---|---:|---|
| `schedule collection not found` | `404` | Selected collection ID is invalid |
| `college year not found` | `404` | Selected college year ID is invalid |
| `no courses found for this college year` | `422` | Curriculum has no courses |
| `no schedulable course sessions found` | `422` | Course data cannot create sessions |
| `unable to place all course sessions without overlaps` | `409` | Time slots are too constrained |
| `unexpected server error while generating schedule` | `500` | Server-side failure |

## Recommended UI States

- Loading: while request is pending.
- Empty: successful list request with `data.length === 0`.
- Validation: field-level `errors`.
- Unauthorized: clear local session and redirect to login.
- Forbidden: show "You do not have permission" or hide admin-only controls.
- Conflict: explain why the action cannot be completed.
- Retryable server error: show message and a retry action.
