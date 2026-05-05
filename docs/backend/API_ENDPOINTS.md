# Faculty Workload Class Scheduler Backend API

Last updated: May 5, 2026

This document is based on the current PHP source under `api/v1/`, plus the shared helpers in `utils/` and `middlewares/`.

## Overview

- Direct PHP base URL used by the Bruno collection:
  - `http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1/`
- API root for the development-only test endpoint:
  - `http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/`
- Frontend dev origin currently allowed by CORS:
  - `http://localhost:5173`
- Auth header for protected routes:
  - `x-session-token: <session_token>`
- Request body format:
  - JSON for `POST` and `PUT`
  - Send `Content-Type: application/json`
- Public routes:
  - `POST /auth/login.php`
  - `POST /auth/register.php`
- Development-only route outside `api/v1/`:
  - `api/test.php`
- Protected routes:
  - Everything else in `api/v1/`

This document uses clean REST-style route names such as `/courses` and `/courses/{id}` for readability. In this repository, the Bruno collection calls the raw PHP files directly, such as `courses.php` and `auth/login.php`.

## Important Implementation Notes

- `ApiResponse::send()` sets the HTTP status code and returns the shared JSON envelope.
- Shared CORS handling lives in `utils/Headers.php`. Browser preflight requests (`OPTIONS`) return `204 No Content` with CORS headers and do not run auth or validation logic.
- Authentication errors from `AuthenticateAuthorize` are nonstandard:
  - Empty token: `invalid token!` via `send(500)`
  - Invalid or expired token: `unauthenticated` via `send(404)`
  - Missing required role: `unauthorized` via `send(404)`
- `auth/login.php` and `auth/register.php` return `success: false` with `send(200)` when validation fails.
- `auth/logout.php` marks the session row as `logged_out = true`, but the auth middleware currently validates only by `session_token` and `expires_at`, not `logged_out`.
- `generate_schedule.php` now generates schedules against the live `schedules` schema only. It replaces rows in the requested collection, ignores `college_year.total_sections`, and does not assign instructors or classrooms because those columns do not exist in the live table.
- `POST /instructor-time-blocks` and `POST /schedules` currently contain a day-validation bug and will reject even valid day names with `invalid day value`.

## Frontend Integration Essentials

Use the direct PHP filename in requests. Clean route names such as `/courses/{id}` in this document are labels, not deployed URLs unless URL rewriting is added later.

```js
const API_BASE =
  "http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1";

await fetch(`${API_BASE}/courses.php?page=1&limit=10`, {
  headers: { "x-session-token": sessionToken },
});

await fetch(`${API_BASE}/courses.php?path=v1/courses/5`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "x-session-token": sessionToken,
  },
  body: JSON.stringify({ course_code: "ITP 221" }),
});
```

Always inspect the response body `success` field. Some validation failures intentionally return HTTP `200` with `"success": false`, especially `auth/login.php` and `auth/register.php`.

## Roles

| Role | `role_id` | Notes |
|---|---:|---|
| Admin | 1 | Required for most create/update/delete operations |
| Program Chair | 2 | Can access authenticated read routes and a few non-admin write routes |

## Session Rules

- Login rate limit:
  - 3 failed attempts per IP
  - 10-minute lockout window
- Session expiry:
  - 24 hours from login
- Session response data:
  - `session_token`
  - `role_id`
  - submitted login `form_data`

## Response Envelope

Every endpoint uses the same JSON envelope.

```json
{
  "success": true,
  "message": "operation description",
  "data": null,
  "errors": null,
  "meta": {
    "timestamp": "22:08:20"
  }
}
```

List endpoints merge pagination into `meta`:

```json
{
  "meta": {
    "timestamp": "22:08:20",
    "total": 37,
    "page": 1,
    "limit": 10,
    "pages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Common List Query Parameters

Most list endpoints support:

| Parameter | Type | Default | Notes |
|---|---|---|---|
| `page` | integer | `1` | Minimum `1` |
| `limit` | integer | `10` | Minimum `1`, maximum `25` |
| `sort_order` | string | usually `ASC` | `ASC` or `DESC`, endpoint-specific default |

## Direct PHP Routing Notes

When URL rewriting is unavailable, list/create routes are called directly as `*.php`. Single-resource handlers also inspect `?path=...` to find `{id}`, but the expected segment position is inconsistent across files.

Use these patterns:

| Pattern | Endpoints | Example |
|---|---|---|
| `?path=v1/<resource>/<id>` | `users`, `programs`, `courses`, `instructors`, `facilities`, `classrooms`, `college-year`, `curriculums`, `instructor-time-blocks`, `person-details`, `schedule-collections` | `courses.php?path=v1/courses/5` |
| `?path=api/v1/<resource>/<id>` | `assign-personal-details`, `course-instructors`, `classroom-courses`, `schedules`, `audit_trail` | `course-instructors.php?path=api/v1/course-instructors/5` |

## Endpoint Index

| Area | Route | Methods | Auth |
|---|---|---|---|
| Auth | `/auth/login` | `POST` | Public |
| Auth | `/auth/register` | `POST` | Public |
| Auth | `/auth/logout` | `POST` | Authenticated |
| Auth | `/auth/user` | `GET` | Admin or Program Chair |
| Users | `/users`, `/users/{id}` | `GET, POST, PUT, DELETE` | Admin |
| Programs | `/programs`, `/programs/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Courses | `/courses`, `/courses/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Instructors | `/instructors`, `/instructors/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Facilities | `/facilities`, `/facilities/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Classrooms | `/classrooms`, `/classrooms/{id}` | `GET, POST, PUT, DELETE` | GET/PUT/DELETE: admin, POST: authenticated |
| College Year | `/college-year`, `/college-year/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Person Details | `/person-details`, `/person-details/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Assign Personal Details | `/assign-personal-details`, `/assign-personal-details/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Curriculums | `/curriculums`, `/curriculums/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Course Instructors | `/course-instructors`, `/course-instructors/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Classroom Courses | `/classroom-courses`, `/classroom-courses/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Instructor Time Blocks | `/instructor-time-blocks`, `/instructor-time-blocks/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Schedules | `/schedules`, `/schedules/{id}` | `GET, POST, PUT, DELETE` | Read/write: authenticated, delete: admin |
| Schedule Collections | `/schedule-collections`, `/schedule-collections/{id}` | `GET, POST, PUT, DELETE` | Read: authenticated, write/delete: admin |
| Audit Trail | `/audit_trail`, `/audit_trail/{id}` | `GET` | Authenticated |
| Generate Schedule | `/generate_schedule` | `POST` | Admin |
| Dev/Test | `/api/test.php` | Any non-`OPTIONS` method | Public, development only |

## Endpoint Source File Coverage

Current PHP endpoint files found under `api/`:

| Source file | Documented as |
|---|---|
| `api/test.php` | Development/test endpoint |
| `api/v1/auth/login.php` | Auth login |
| `api/v1/auth/register.php` | Auth register |
| `api/v1/auth/logout.php` | Auth logout |
| `api/v1/auth/user.php` | Current authenticated user |
| `api/v1/users.php` | Users |
| `api/v1/programs.php` | Programs |
| `api/v1/courses.php` | Courses |
| `api/v1/instructors.php` | Instructors |
| `api/v1/facilities.php` | Facilities |
| `api/v1/classrooms.php` | Classrooms |
| `api/v1/college-year.php` | College Year |
| `api/v1/person-details.php` | Person Details |
| `api/v1/assign-personal-details.php` | Assign Personal Details |
| `api/v1/curriculums.php` | Curriculums |
| `api/v1/course-instructors.php` | Course Instructors |
| `api/v1/classroom-courses.php` | Classroom Courses |
| `api/v1/instructor-time-blocks.php` | Instructor Time Blocks |
| `api/v1/schedules.php` | Schedules |
| `api/v1/schedule-collections.php` | Schedule Collections |
| `api/v1/audit_trail.php` | Audit Trail |
| `api/v1/generate_schedule.php` | Generate Schedule |

## Auth Endpoints

### `POST /auth/login`

Direct PHP: `auth/login.php`

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `email` | string | Yes | valid email |
| `password` | string | Yes | min `8`, max `64`, uppercase, lowercase, number, special char |

Success:

- Message: `login successful`
- HTTP status: `200`
- `data`:
  - `form_data.email`
  - `form_data.password`
  - `session_token`
  - `role_id`

Other responses:

- `invalid credentials` via `send(401)`
- `Too many login attempts. Please try again after 10 minutes.` via `send(429)`
- Validation failure: `invalid values` with `errors`, via `send(200)`

Example body:

```json
{
  "email": "chair@example.com",
  "password": "SecurePass123!"
}
```

### `POST /auth/register`

Direct PHP: `auth/register.php`

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `email` | string | Yes | valid email |
| `password` | string | Yes | min `8`, max `64`, uppercase, lowercase, number, special char |

Behavior:

- Creates a new `users` row
- Hardcodes `role_id = 2`
- Hardcodes `verified = 0`

Success:

- Message: `user registered successfully`
- HTTP status: `201`

Other responses:

- `email already registered` via `send(400)`
- `registration failed` via `send(500)`
- Validation failure: `invalid values` with `errors`, via `send(200)`

### `POST /auth/logout`

Direct PHP: `auth/logout.php`

Intended frontend method: `POST`

Implementation note:

- The file does not currently gate `$_SERVER['REQUEST_METHOD']`, so any non-`OPTIONS` request with a valid token can execute logout behavior.
- Frontend code should still use `POST`.

Headers:

| Header | Required | Notes |
|---|---|---|
| `x-session-token` | Yes | must match an active session |

Success:

- Message: `logout successful`
- HTTP status: `200`

Other responses:

- Missing header: `session token required` via `send(400)`
- Failed auth from middleware: see auth notes above
- `logout failed` via `send(500)`

Implementation note:

- This endpoint updates `user_sessions.logged_out = true`.
- The auth middleware does not currently check `logged_out`.

### `GET /auth/user`

Direct PHP: `auth/user.php`

Intended frontend method: `GET`

Implementation note:

- The file does not currently gate `$_SERVER['REQUEST_METHOD']`, so any non-`OPTIONS` request with a valid admin or program chair token can return the authenticated user response.
- Frontend code should still use `GET`.

Success:

- Message: `authenticated user`
- HTTP status: `200`
- `data`:
  - `user_id`

Auth:

- Available to both admin and program chair users

## Users

Direct PHP: `users.php`

Returned fields:

- `user_id`
- `email`
- `verified`
- `role_id`
- `role`

All user-management operations require an admin `x-session-token`.

### `GET /users`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `search` | string | partial match on `email` or role name |
| `role_id` | integer | exact role match |
| `verified` | boolean | accepts boolean-like values |
| `sort_by` | string | `user_id`, `email`, `verified`, `role_id`, `role` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `users retrieved successfully`
- HTTP status: `200`

### `GET /users/{id}`

Success:

- Message: `user retrieved successfully`

Not found:

- `user not found`

### `POST /users`

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `email` | string | Yes | valid email, max `255`, unique |
| `password` | string | Yes | min `8`, max `64`, uppercase, lowercase, number, special char |
| `role_id` | integer | Yes | must exist in `roles` |
| `verified` | boolean | No | defaults to `false` |

Success:

- Message: `user created successfully`
- HTTP status: `201`
- Returns the created user without password fields

Other responses:

- `email already registered` via `send(400)`
- `invalid values` with `errors` via `send(400)`
- `failed to create user` via `send(500)`

### `PUT /users/{id}`

Request body may include any of:

| Field | Type | Validation |
|---|---|---|
| `email` | string | valid email, max `255`, unique |
| `password` | string | min `8`, max `64`, uppercase, lowercase, number, special char |
| `role_id` | integer | must exist in `roles`; admins cannot remove their own admin role |
| `verified` | boolean | accepts boolean-like values |

Success:

- Message: `user updated successfully`
- HTTP status: `200`
- Returns the updated user without password fields

Other responses:

- `no fields to update` via `send(400)`
- `user not found` via `send(404)`

### `DELETE /users/{id}`

Behavior:

- Deletes matching `user_sessions` inside the same transaction before deleting the user
- Blocks admins from deleting their own account
- Returns `409` if other records still reference the user

Success:

- Message: `user deleted successfully`
- HTTP status: `200`

Other responses:

- `admins cannot delete their own account` via `send(400)`
- `user not found` via `send(404)`
- `user is referenced by other records` via `send(409)`

## Programs

Returned fields:

- `program_id`
- `program`

### `GET /programs`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `search` | string | partial match on `program` |
| `sort_by` | string | `program_id`, `program` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `programs retrieved successfully`
- HTTP status: `200`

### `GET /programs/{id}`

Success:

- Message: `program retrieved successfully`

Not found:

- `program not found`

### `POST /programs`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `program` | string | Yes | min `1`, max `20` |

Success:

- Message: `program created successfully`
- `data.program_id`

### `PUT /programs/{id}`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `program` | string | Yes | min `1`, max `20` |

Success:

- Message: `program updated successfully`
- `data.program_id`

### `DELETE /programs/{id}`

Auth: admin

Success:

- Message: `program deleted successfully`

Permission failure:

- `only admins can delete programs`

## Courses

Returned fields:

- raw `courses` row via `SELECT *`
- current write payload shows these known columns:
  - `course_id`
  - `course_code`
  - `course_description`
  - `units`
  - `total_course_duration_minutes`
  - `total_lecture_duration_minutes`
  - `minimum_lecture_duration_minutes`
  - `maximum_lecture_duration_minutes`
  - `total_laboratory_duration_minutes`
  - `minimum_laboratory_duration_minutes`
  - `maximum_laboratory_duration_minutes`

### `GET /courses`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `search` | string | partial match on `course_code` or `course_description` |
| `course_code` | string | partial match on `course_code` |
| `sort_by` | string | `course_id`, `course_code`, `units` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `courses retrieved successfully`

### `GET /courses/{id}`

Success:

- Message: `course retrieved successfully`

Not found:

- `course not found`

### `POST /courses`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `course_code` | string | Yes | required |
| `course_description` | string | Yes | required |
| `units` | numeric | Yes | numeric |
| `total_course_duration_minutes` | numeric | Yes | numeric |
| `total_lecture_duration_minutes` | numeric | Yes | numeric |
| `minimum_lecture_duration_minutes` | numeric | Yes | numeric |
| `maximum_lecture_duration_minutes` | numeric | Yes | numeric |
| `total_laboratory_duration_minutes` | numeric | Yes | numeric |
| `minimum_laboratory_duration_minutes` | numeric | Yes | numeric |
| `maximum_laboratory_duration_minutes` | numeric | Yes | numeric |

Success:

- Message: `course created successfully`
- `data.course_id`

### `PUT /courses/{id}`

Auth: admin

Updatable fields only:

| Field | Type | Required |
|---|---|---|
| `course_code` | string | No |
| `course_description` | string | No |
| `units` | integer | No |

Success:

- Message: `course updated successfully`

Notes:

- Duration fields are not updatable in the current implementation.
- Empty body returns `no fields to update`.

### `DELETE /courses/{id}`

Auth: admin

Success:

- Message: `course deleted successfully`

Permission failure:

- `only admins can delete courses`

## Instructors

Returned fields:

- raw `instructors` row via `i.*`
- joined fields:
  - `first_name`
  - `last_name`

### `GET /instructors`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `search` | string | partial match on `major`, `first_name`, or `last_name` |
| `major` | string | partial match on `major` |
| `sort_by` | string | `i.instructor_id`, `i.major`, `pd.first_name`, `pd.last_name` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `instructors retrieved successfully`

### `GET /instructors/{id}`

Success:

- Message: `instructor retrieved successfully`

### `POST /instructors`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `major` | string | Yes | required |
| `workload_lower_limit_minutes` | numeric | Yes | numeric |
| `workload_upper_limit_minutes` | numeric | Yes | numeric |
| `tin_number` | string | Yes | required |
| `GSIS_number` | string | Yes | required |

Success:

- Message: `instructor created successfully`
- `data.instructor_id`

### `PUT /instructors/{id}`

Auth: admin

Updatable fields only:

| Field | Type | Required |
|---|---|---|
| `major` | string | No |
| `workload_lower_limit_minutes` | integer | No |
| `workload_upper_limit_minutes` | integer | No |

Success:

- Message: `instructor updated successfully`

Notes:

- `tin_number` and `GSIS_number` are not updatable in the current code.

### `DELETE /instructors/{id}`

Auth: admin

Success:

- Message: `instructor deleted successfully`

Permission failure:

- `only admins can delete instructors`

## Facilities

Returned fields:

- `facility_id`
- `facility_name`
- `total_rooms`
- `total_floors`
- `location`

### `GET /facilities`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `search` | string | partial match on `facility_name` or `location` |
| `location` | string | partial match on `location` |
| `sort_by` | string | `facility_id`, `facility_name`, `total_rooms`, `total_floors` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `facilities retrieved successfully`

### `GET /facilities/{id}`

Success:

- Message: `facility retrieved successfully`

### `POST /facilities`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `facility_name` | string | Yes | required |
| `total_rooms` | numeric | Yes | numeric, `min(1)` string-length check is also applied |
| `total_floors` | numeric | Yes | numeric, `min(1)` string-length check is also applied |
| `location` | string | No | optional |

Success:

- Message: `facility created successfully`
- `data.facility_id`

### `PUT /facilities/{id}`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `facility_name` | string | Yes | required |
| `total_rooms` | numeric | Yes | numeric |
| `total_floors` | numeric | Yes | numeric |
| `location` | string | No | optional |

Success:

- Message: `facility updated successfully`

Notes:

- This is not a partial update endpoint. The current implementation requires the main fields again.

### `DELETE /facilities/{id}`

Auth: admin

Success:

- Message: `facility deleted successfully`

Permission failure:

- `only admins can delete facilities`

## Classrooms

Returned fields:

- raw `classrooms` row via `c.*`
- joined field:
  - `facility_name`

Current code uses classroom fields such as:

- `classroom_id`
- `classroom_code`
- `floor`
- `is_laboratory`
- `is_available`
- `facility_id`

### `GET /classrooms`

Auth: admin

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `search` | string | partial match on `classroom_code` |
| `capacity` | integer | exact match on `c.capacity` |
| `sort_by` | string | `c.classroom_id`, `c.classroom_code`, `c.capacity` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `classrooms retrieved successfully`

Note:

- The list query still references `capacity`, while create/update are built around `floor`, `is_laboratory`, and `is_available`.

### `GET /classrooms/{id}`

Auth: admin

Success:

- Message: `classroom retrieved successfully`

### `POST /classrooms`

Auth: authenticated user

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `floor` | numeric | Yes | numeric |
| `is_laboratory` | numeric/boolean-like | Yes | numeric |
| `facility_id` | numeric | Yes | numeric |
| `classroom_code` | string | No | optional |
| `is_available` | numeric/boolean-like | No | defaults to `1` |

Success:

- Message: `classroom created successfully`
- `data.classroom_id`

### `PUT /classrooms/{id}`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `floor` | numeric | Yes | numeric |
| `is_laboratory` | numeric/boolean-like | Yes | numeric |
| `is_available` | numeric/boolean-like | Yes | numeric |
| `classroom_code` | string | No | optional |

Success:

- Message: `classroom updated successfully`

Notes:

- `facility_id` is not updatable.
- This is not a partial update endpoint for the required numeric flags.

### `DELETE /classrooms/{id}`

Auth: effectively admin only

Success:

- Message: `classroom deleted successfully`

Permission failure:

- `only admins can delete classrooms`

## College Year

Returned fields:

- raw `college_year` row via `cy.*`
- joined field:
  - `program`

### `GET /college-year`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `program_id` | integer | exact match |
| `year_level` | integer | exact match |
| `sort_by` | string | `cy.college_year_id`, `cy.program_id`, `cy.year_level`, `cy.start_year`, `cy.end_year` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `college years retrieved successfully`

### `GET /college-year/{id}`

Success:

- Message: `college year retrieved successfully`

### `POST /college-year`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `college_year` | numeric | Yes | numeric |
| `semester` | numeric | Yes | numeric, must be `1` or `2` |
| `total_sections` | numeric | Yes | numeric, must be between `1` and `4` |
| `program_id` | numeric | Yes | numeric |

Success:

- Message: `college year created successfully`
- `data.college_year_id`

### `PUT /college-year/{id}`

Auth: admin

Updatable fields:

| Field | Type | Required |
|---|---|---|
| `college_year` | integer | No |
| `semester` | integer | No |
| `total_sections` | integer | No |

Success:

- Message: `college year updated successfully`

Notes:

- `program_id` is not updatable in the current implementation.

### `DELETE /college-year/{id}`

Auth: admin

Success:

- Message: `college year deleted successfully`

Permission failure:

- `only admins can delete college years`

## Person Details

Returned fields:

- raw `person_details` row via `SELECT *`

Write payload currently uses:

- `first_name`
- `middle_name`
- `last_name`
- `birth_date`
- `contact_number`
- `contact_email`
- `address`
- `gender`
- `sex`

### `GET /person-details`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `search` | string | partial match on `first_name`, `last_name`, or `email` |
| `first_name` | string | partial match |
| `last_name` | string | partial match |
| `sort_by` | string | `person_detail_id`, `first_name`, `last_name`, `email` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `person details retrieved successfully`

Note:

- The list query searches and sorts on `email`, while write requests use `contact_email`.

### `GET /person-details/{id}`

Success:

- Message: `person detail retrieved successfully`

### `POST /person-details`

Auth: admin

Request body:

| Field | Type | Required | Notes |
|---|---|---|---|
| `first_name` | string | Yes | required |
| `last_name` | string | Yes | required |
| `middle_name` | string | No | optional |
| `birth_date` | string | No | optional |
| `contact_number` | string | No | optional |
| `contact_email` | string | No | optional |
| `address` | string | No | optional |
| `gender` | string | No | optional |
| `sex` | string | No | optional |

Success:

- Message: `person detail created successfully`
- `data.person_detail_id`

### `PUT /person-details/{id}`

Auth: admin

Updatable fields:

- `first_name`
- `middle_name`
- `last_name`
- `birth_date`
- `contact_number`
- `contact_email`
- `address`
- `gender`
- `sex`

Success:

- Message: `person detail updated successfully`

### `DELETE /person-details/{id}`

Auth: admin

Success:

- Message: `person detail deleted successfully`

Permission failure:

- `only admins can delete person details`

## Assign Personal Details

Returned fields:

- raw `assign_personal_details` row via `SELECT *`

Known columns in use:

- `assign_personal_detail_id`
- `person_detail_id`
- `user_id`
- `instructor_id`

### `GET /assign-personal-details`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `instructor_id` | integer | exact match |
| `person_detail_id` | integer | exact match |
| `sort_by` | string | `assign_personal_detail_id`, `instructor_id`, `person_detail_id` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `assign personal details retrieved successfully`

### `GET /assign-personal-details/{id}`

Success:

- Message: `assign personal detail retrieved successfully`

### `POST /assign-personal-details`

Auth: admin

Request body:

| Field | Type | Required | Notes |
|---|---|---|---|
| `person_detail_id` | integer | Yes | numeric |
| `user_id` | integer | Conditionally | at least one of `user_id` or `instructor_id` must be present |
| `instructor_id` | integer | Conditionally | at least one of `user_id` or `instructor_id` must be present |

Success:

- Message: `assign personal detail created successfully`
- `data.assign_personal_detail_id`

### `PUT /assign-personal-details/{id}`

Auth: admin

Updatable fields only:

- `user_id`
- `instructor_id`

Success:

- Message: `assign personal detail updated successfully`

Notes:

- `person_detail_id` cannot be changed after creation.

### `DELETE /assign-personal-details/{id}`

Auth: admin

Success:

- Message: `assign personal detail deleted successfully`

Permission failure:

- `only admins can delete assign personal details`

## Curriculums

Returned fields:

- raw `curriculums` row via `SELECT *`

### `GET /curriculums`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `program_id` | integer | exact match |
| `year_level` | integer | exact match |
| `semester` | integer | exact match |
| `sort_by` | string | `curriculum_id`, `program_id`, `year_level`, `semester` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `curriculums retrieved successfully`

### `GET /curriculums/{id}`

Success:

- Message: `curriculum retrieved successfully`

### `POST /curriculums`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `college_year_id` | integer | Yes | numeric |
| `course_id` | integer | Yes | numeric |

Success:

- Message: `curriculum created successfully`
- `data.curriculum_id`

### `PUT /curriculums/{id}`

Auth: admin

Updatable fields:

- `college_year_id`
- `course_id`

Success:

- Message: `curriculum updated successfully`

### `DELETE /curriculums/{id}`

Auth: admin

Success:

- Message: `curriculum deleted successfully`

Permission failure:

- `only admins can delete curriculums`

## Course Instructors

Returned fields:

- raw `course_instructors` row via `SELECT *`

Known columns in use:

- `course_instructor_id`
- `priority`
- `assign_personal_detail_id`
- `course_id`

### `GET /course-instructors`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `course_id` | integer | exact match |
| `instructor_id` | integer | exact match in current query |
| `sort_by` | string | `course_instructor_id`, `course_id`, `instructor_id` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `course instructors retrieved successfully`

### `GET /course-instructors/{id}`

Success:

- Message: `course instructor retrieved successfully`

### `POST /course-instructors`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `priority` | integer | Yes | numeric, defaults to `1` if omitted before validation |
| `assign_personal_detail_id` | integer | Yes | numeric |
| `course_id` | integer | Yes | numeric |

Success:

- Message: `course instructor created successfully`
- `data.course_instructor_id`

### `PUT /course-instructors/{id}`

Auth: admin

Updatable fields only:

- `priority`

Success:

- Message: `course instructor updated successfully`

### `DELETE /course-instructors/{id}`

Auth: admin

Success:

- Message: `course instructor deleted successfully`

Permission failure:

- `only admins can delete course instructors`

## Classroom Courses

Returned fields:

- raw `classroom_courses` row via `SELECT *`

Known columns in use:

- `classroom_course_id`
- `priority`
- `classroom_id`
- `course_id`

### `GET /classroom-courses`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `classroom_id` | integer | exact match |
| `course_id` | integer | exact match |
| `sort_by` | string | `classroom_course_id`, `classroom_id`, `course_id` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `classroom courses retrieved successfully`

### `GET /classroom-courses/{id}`

Success:

- Message: `classroom course retrieved successfully`

### `POST /classroom-courses`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `priority` | integer | Yes | numeric, defaults to `1` if omitted before validation |
| `classroom_id` | integer | Yes | numeric |
| `course_id` | integer | Yes | numeric |

Success:

- Message: `classroom course created successfully`
- `data.classroom_course_id`

### `PUT /classroom-courses/{id}`

Auth: admin

Updatable fields only:

- `priority`

Success:

- Message: `classroom course updated successfully`

### `DELETE /classroom-courses/{id}`

Auth: admin

Success:

- Message: `classroom course deleted successfully`

Permission failure:

- `only admins can delete classroom courses`

## Instructor Time Blocks

Returned fields:

- raw `instructor_time_blocks` row via `itb.*`
- joined field:
  - `major`

Write payload uses:

- `priority`
- `start_time`
- `end_time`
- `day`
- `instructor_id`

### `GET /instructor-time-blocks`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `instructor_id` | integer | exact match |
| `day_of_week` | string | exact match in current query |
| `sort_by` | string | `itb.instructor_time_block_id`, `itb.instructor_id`, `itb.day_of_week`, `itb.start_time`, `itb.end_time` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `instructor time blocks retrieved successfully`

### `GET /instructor-time-blocks/{id}`

Success:

- Message: `instructor time block retrieved successfully`

### `POST /instructor-time-blocks`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `priority` | integer | Yes | numeric, defaults to `1` if omitted before validation |
| `start_time` | string | Yes | required |
| `end_time` | string | Yes | required |
| `day` | string | Yes | intended lowercase weekday |
| `instructor_id` | integer | Yes | numeric |

Intended valid `day` values:

- `sunday`
- `monday`
- `tuesday`
- `wednesday`
- `thursday`
- `friday`
- `saturday`

Current behavior note:

- The POST validator compares `$day()` instead of the raw value, so valid requests are currently rejected with `invalid day value`.

### `PUT /instructor-time-blocks/{id}`

Auth: admin

Updatable fields:

- `priority`
- `start_time`
- `end_time`
- `day`

Success:

- Message: `instructor time block updated successfully`

### `DELETE /instructor-time-blocks/{id}`

Auth: admin

Success:

- Message: `instructor time block deleted successfully`

Permission failure:

- `only admins can delete instructor time blocks`

## Schedules

Returned fields:

- raw `schedules` row via `s.*`
- joined fields:
  - `course_code`
  - `title` from `schedule_collections`

Current write payload uses:

- `start_time`
- `end_time`
- `day`
- `course_id`
- `schedule_collection_id`

### `GET /schedules`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `course_id` | integer | exact match |
| `classroom_id` | integer | exact match |
| `schedule_collection_id` | integer | exact match |
| `sort_by` | string | `s.schedule_id`, `s.course_id`, `s.classroom_id`, `s.schedule_collection_id`, `s.start_time`, `s.end_time` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `schedules retrieved successfully`

### `GET /schedules/{id}`

Success:

- Message: `schedule retrieved successfully`

### `POST /schedules`

Auth: authenticated user

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `start_time` | string | Yes | required |
| `end_time` | string | Yes | required |
| `day` | string | Yes | intended lowercase weekday |
| `course_id` | integer | Yes | numeric |
| `schedule_collection_id` | integer | Yes | numeric |

Intended valid `day` values:

- `sunday`
- `monday`
- `tuesday`
- `wednesday`
- `thursday`
- `friday`
- `saturday`

Current behavior note:

- The POST validator compares `$day()` instead of the raw value, so valid requests are currently rejected with `invalid day value`.

### `PUT /schedules/{id}`

Auth: authenticated user

Updatable fields:

- `start_time`
- `end_time`
- `day`

Success:

- Message: `schedule updated successfully`

Notes:

- `course_id`, `classroom_id`, and `schedule_collection_id` are not updatable here.

### `DELETE /schedules/{id}`

Auth: effectively admin only

Success:

- Message: `schedule deleted successfully`

Permission failure:

- `only admins can delete schedules`

## Schedule Collections

Returned fields:

- raw `schedule_collections` row via `sc.*`
- joined field:
  - `email`

### `GET /schedule-collections`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `search` | string | partial match on `title` |
| `user_id` | integer | exact match |
| `sort_by` | string | `sc.schedule_collection_id`, `sc.user_id`, `sc.title` |
| `sort_order` | string | default `ASC` |

Success:

- Message: `schedule collections retrieved successfully`

### `GET /schedule-collections/{id}`

Success:

- Message: `schedule collection retrieved successfully`

### `POST /schedule-collections`

Auth: admin

Request body:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | Yes | required |
| `description` | string | No | optional |
| `registrar_approved` | boolean-like | No | defaults to `false` |

Behavior:

- `user_id` is taken from the authenticated user, not from the request body.

Success:

- Message: `schedule collection created successfully`
- `data.schedule_collection_id`

### `PUT /schedule-collections/{id}`

Auth: admin

Updatable fields:

- `title`
- `description`
- `registrar_approved`

Success:

- Message: `schedule collection updated successfully`

### `DELETE /schedule-collections/{id}`

Auth: admin

Success:

- Message: `schedule collection deleted successfully`

Permission failure:

- `only admins can delete schedule collections`

## Audit Trail

Returned fields:

- raw `audit_trail` row via `at.*`
- joined field:
  - `user_email`
- decoded JSON fields when present:
  - `old_data`
  - `new_data`

### `GET /audit_trail`

Filters:

| Parameter | Type | Notes |
|---|---|---|
| `entity_type` | string | exact match |
| `entity_id` | string | exact match |
| `user_id` | integer | exact match |
| `action` | string | exact match |
| `start_date` | string | `DATE(at.created_at) >= value` |
| `end_date` | string | `DATE(at.created_at) <= value` |
| `sort_by` | string | `at.audit_trail_id`, `at.user_id`, `at.action`, `at.entity_type`, `at.created_at` |
| `sort_order` | string | default `DESC`, only `ASC` switches it |

Success:

- Message: `audit logs retrieved successfully`

### `GET /audit_trail/{id}`

Success:

- Message: `audit log entry retrieved successfully`

Not found:

- `audit log entry not found`

### Write Methods

`POST`, `PUT`, and `DELETE` are blocked.

Response:

- Message: `audit logs are read-only`
- HTTP status: `403`

## Generate Schedule

### `POST /generate_schedule`

Direct PHP: `generate_schedule.php`

Auth: admin

Request body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `schedule_collection_id` | integer | Yes | numeric |
| `college_year_id` | integer | Yes | numeric |

Success:

- Message: `schedule generated successfully`
- HTTP status: `201`
- `data`:
  - `schedule_collection_id`
  - `college_year_id`
  - `replaced_count`
  - `generated_count`
  - `schedule[]` rows with:
    - `schedule_id`
    - `day`
    - `start_time`
    - `end_time`
    - `course_id`
    - `schedule_collection_id`
    - `course_code`
    - `course_description`
    - `units`

Other responses:

- Validation failure:
  - Message: `validation failed`
  - `errors`
  - HTTP status: `400`
- Missing schedule collection:
  - Message: `schedule collection not found`
  - HTTP status: `404`
- Missing college year:
  - Message: `college year not found`
  - HTTP status: `404`
- Empty curriculum:
  - Message: `no courses found for this college year`
  - HTTP status: `422`
- Placement failure:
  - Message: `unable to place all course sessions without overlaps`
  - HTTP status: `409`
- Unexpected failure:
  - Message: `unexpected server error while generating schedule`
  - HTTP status: `500`

Generation rules:

- Uses Monday-Friday only.
- Uses `07:30:00` to `18:00:00` with 30-minute slots.
- Replaces existing rows in the target `schedule_collection_id` inside one transaction.
- Generates one schedule pattern per course only.
- Weekly course time starts from `units * 60`.
- Lecture/lab minutes are split by the ratio of `total_lecture_duration_minutes` to `total_laboratory_duration_minutes`.
- Session durations are derived from lecture/lab min/max duration fields, with fallback to lecture min/max, then `60/120`.
- The generator prevents overlaps inside the target schedule collection and prefers different days for the same course before earlier times.

Current limitations:

- `college_year.total_sections` is ignored because the live `schedules` table has no `section_id`.
- The generator does not assign `instructor_id` or `classroom_id` because the live `schedules` table has no such columns.

## Development/Test Endpoint

### `GET /api/test.php`

Direct PHP: `../test.php` from the `api/v1` base, or full local URL:

```txt
http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/test.php
```

Auth: public

Purpose:

- Development-only utility endpoint.
- Generates a new password hash and salt for the hardcoded password `P@ssw0rd`.
- Not required for normal frontend application flows.

Method behavior:

- The file does not check `$_SERVER['REQUEST_METHOD']`, so any non-`OPTIONS` request currently returns the same response.
- Shared CORS preflight still handles `OPTIONS` with `204 No Content`.

Success:

- Message: `executed test endpoint`
- HTTP status: `200`
- `data`:
  - `HASH`
  - `SALT`

## Common Failure Messages

These messages appear across multiple endpoints:

| Message | Where it comes from |
|---|---|
| `invalid values` | request validation failed |
| `no fields to update` | update endpoint received no supported fields |
| `method not allowed` | unsupported HTTP method on CRUD files |
| `database connection failed` | DB bootstrap failed |
| `failed to create ...` | insert query failed |
| `failed to update ...` | update query failed |
| `failed to delete ...` | delete query failed |

## Suggested Consumer Checklist

- Always send `x-session-token` on protected routes.
- Expect the shared JSON envelope on every response.
- Treat HTTP status and body `success` together. Auth validation can return nonstandard statuses, and login/register validation can return HTTP `200` with `success: false`.
- Use lowercase weekday names for `day` fields:
  - `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`
- `generate_schedule` is usable now, but current-schema limitations still apply:
  - one schedule pattern per course
  - no section expansion
  - no instructor or classroom assignment
- Treat `POST /schedules` and `POST /instructor-time-blocks` as incomplete or currently blocked endpoints until those backend issues are fixed.
