# API Quick Reference

Last updated: May 5, 2026

## Base URLs

```txt
http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1
```

Development-only API root:

```txt
http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api
```

## Required Headers

| Use case | Headers |
|---|---|
| Public `GET` without body | none |
| JSON body | `Content-Type: application/json` |
| Protected route | `x-session-token: <session_token>` |
| Protected JSON route | both headers above |

## Roles

| Role | `role_id` | Typical access |
|---|---:|---|
| Admin | `1` | Full management, most writes/deletes, schedule generation |
| Program Chair | `2` | Authenticated reads and selected create actions |

## Endpoint Matrix

All paths below are direct PHP files under the base URL.

| Area | File | Methods | Auth |
|---|---|---|---|
| Login | `auth/login.php` | `POST` | Public |
| Register | `auth/register.php` | `POST` | Public |
| Logout | `auth/logout.php` | `POST` intended | Any authenticated user |
| Current user | `auth/user.php` | `GET` intended | Admin or Program Chair |
| Users | `users.php` | `GET`, `POST`, `PUT`, `DELETE` | Admin |
| Programs | `programs.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Courses | `courses.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Instructors | `instructors.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Facilities | `facilities.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Classrooms | `classrooms.php` | `GET`, `POST`, `PUT`, `DELETE` | `GET/PUT/DELETE` admin, `POST` authenticated |
| College Year | `college-year.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Person Details | `person-details.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Assign Personal Details | `assign-personal-details.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Curriculums | `curriculums.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Course Instructors | `course-instructors.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Classroom Courses | `classroom-courses.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Instructor Time Blocks | `instructor-time-blocks.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Schedules | `schedules.php` | `GET`, `POST`, `PUT`, `DELETE` | Read/write authenticated, delete admin |
| Schedule Collections | `schedule-collections.php` | `GET`, `POST`, `PUT`, `DELETE` | Read authenticated, write admin |
| Audit Trail | `audit_trail.php` | `GET` | Any authenticated user |
| Generate Schedule | `generate_schedule.php` | `POST` | Admin |

## Endpoint Outside `api/v1`

| Area | Full file URL | Methods | Auth | Notes |
|---|---|---|---|---|
| Dev/Test | `/api/test.php` | Any non-`OPTIONS` method | Public | Generates a password `HASH` and `SALT` for hardcoded `P@ssw0rd`; development-only, not needed by the frontend app |

Method caveat:

- `auth/logout.php`, `auth/user.php`, and `api/test.php` do not currently enforce the documented frontend method in code. Browser preflight `OPTIONS` still returns `204 No Content`.
- Frontend code should use the intended methods shown above.

## Common Query Parameters

Most list endpoints support:

| Param | Type | Default | Notes |
|---|---|---:|---|
| `page` | integer | `1` | Minimum `1` |
| `limit` | integer | `10` | Minimum `1`, maximum `25` |
| `sort_by` | string | endpoint-specific | See [API_ENDPOINTS.md](API_ENDPOINTS.md) |
| `sort_order` | `ASC` or `DESC` | `ASC` | Anything except `DESC` becomes `ASC` |

Common filters:

| Endpoint | Filters |
|---|---|
| `users.php` | `search`, `role_id`, `verified` |
| `programs.php` | `search` |
| `courses.php` | `search`, `course_code` |
| `instructors.php` | `search`, `major` |
| `facilities.php` | `search`, `location` |
| `classrooms.php` | `search`, `capacity` |
| `college-year.php` | `program_id`, `year_level` |
| `person-details.php` | `search`, `first_name`, `last_name` |
| `assign-personal-details.php` | `instructor_id`, `person_detail_id` |
| `curriculums.php` | `program_id`, `year_level`, `semester` |
| `course-instructors.php` | `course_id`, `instructor_id` |
| `classroom-courses.php` | `classroom_id`, `course_id` |
| `instructor-time-blocks.php` | `instructor_id`, `day_of_week` |
| `schedules.php` | `course_id`, `classroom_id`, `schedule_collection_id` |
| `schedule-collections.php` | `search`, `user_id` |
| `audit_trail.php` | `entity_type`, `entity_id`, `user_id`, `action`, `start_date`, `end_date` |

## Single-Record Path Patterns

The backend does not consistently support clean `/resource/id` URLs. Use the `path` query parameter.

| Pattern | Files |
|---|---|
| `?path=v1/<resource>/<id>` | `users.php`, `programs.php`, `courses.php`, `instructors.php`, `facilities.php`, `classrooms.php`, `college-year.php`, `curriculums.php`, `instructor-time-blocks.php`, `person-details.php`, `schedule-collections.php` |
| `?path=api/v1/<resource>/<id>` | `assign-personal-details.php`, `course-instructors.php`, `classroom-courses.php`, `schedules.php`, `audit_trail.php` |

Examples:

```txt
GET    courses.php?path=v1/courses/5
PUT    programs.php?path=v1/programs/2
DELETE course-instructors.php?path=api/v1/course-instructors/7
GET    audit_trail.php?path=api/v1/audit_trail/10
```

## Response Checklist

- Parse JSON even if the server response `Content-Type` is not ideal in local Apache.
- Check `response.ok` for transport-level status.
- Check `body.success` for API-level success.
- Display `body.message` for simple errors.
- Display `body.errors[field]` for validation errors.
- Use `body.meta.total`, `body.meta.page`, `body.meta.pages`, `body.meta.hasNext`, and `body.meta.hasPrev` for paginated tables.

## Current Backend Caveats

- `auth/logout.php` sets `logged_out = true`, but auth checks currently use only token and expiry. Clear the token in the frontend after logout.
- `POST /schedules` and `POST /instructor-time-blocks` currently reject valid weekday values because of a backend day-validation bug.
- `generate_schedule.php` does not assign classrooms, instructors, or sections in the current schema-backed implementation.
