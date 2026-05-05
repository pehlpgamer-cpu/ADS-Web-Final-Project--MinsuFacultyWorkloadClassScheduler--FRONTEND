# Frontend Integration Guide

Last updated: May 5, 2026

This guide shows how to call the backend from a browser frontend such as Vite, React, Vue, or plain JavaScript.

## Environment Setup

Use this in the frontend `.env` file:

```env
VITE_API_BASE=http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1
```

The backend currently allows CORS requests only from:

```txt
http://localhost:5173
```

## Fetch Client

This helper handles:

- base URL
- `x-session-token`
- JSON request body
- JSON parsing when local Apache returns a non-JSON content type
- API-level errors where HTTP status is still `200`

```js
const API_BASE =
  import.meta.env.VITE_API_BASE ??
  "http://localhost/ADS-Web-Final-Project--MinsuFacultyWorkloadClassScheduler--BACKEND/api/v1";

export class ApiError extends Error {
  constructor(message, { status, body, errors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.errors = errors;
  }
}

export function getSessionToken() {
  return localStorage.getItem("session_token");
}

export function setSession({ session_token, role_id }) {
  localStorage.setItem("session_token", session_token);
  localStorage.setItem("role_id", String(role_id));
}

export function clearSession() {
  localStorage.removeItem("session_token");
  localStorage.removeItem("role_id");
}

export async function apiRequest(path, options = {}) {
  const token = options.token === undefined ? getSessionToken() : options.token;
  const headers = new Headers(options.headers ?? {});

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("x-session-token")) {
    headers.set("x-session-token", token);
  }

  const response = await fetch(`${API_BASE}/${path}`, {
    ...options,
    headers,
    body:
      options.body !== undefined && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body,
  });

  const rawText = await response.text();
  const body = rawText ? JSON.parse(rawText) : null;

  if (!response.ok || body?.success === false) {
    throw new ApiError(body?.message ?? "Request failed", {
      status: response.status,
      body,
      errors: body?.errors,
    });
  }

  return body;
}
```

## Auth Functions

```js
import { apiRequest, clearSession, setSession } from "./apiClient";

export async function login(email, password) {
  const body = await apiRequest("auth/login.php", {
    method: "POST",
    body: { email, password },
    token: null,
  });

  setSession({
    session_token: body.data.session_token,
    role_id: body.data.role_id,
  });

  return body.data;
}

export async function logout() {
  try {
    await apiRequest("auth/logout.php", { method: "POST" });
  } finally {
    clearSession();
  }
}

export async function getCurrentUser() {
  return apiRequest("auth/user.php");
}
```

## Route Helpers

Use file names for collection routes:

```js
export function listPrograms(params = {}) {
  return apiRequest(`programs.php?${new URLSearchParams(params)}`);
}
```

Use the correct `path` format for single records:

```js
const V1_PATH_FILES = new Set([
  "users",
  "programs",
  "courses",
  "instructors",
  "facilities",
  "classrooms",
  "college-year",
  "curriculums",
  "instructor-time-blocks",
  "person-details",
  "schedule-collections",
]);

export function resourcePath(resource, id) {
  const prefix = V1_PATH_FILES.has(resource) ? "v1" : "api/v1";
  return `${resource}.php?path=${prefix}/${resource}/${id}`;
}

// Examples:
// resourcePath("courses", 5)
// "courses.php?path=v1/courses/5"
//
// resourcePath("course-instructors", 7)
// "course-instructors.php?path=api/v1/course-instructors/7"
```

## CRUD Examples

```js
export function getCourses({ page = 1, limit = 10, search = "" } = {}) {
  return apiRequest(
    `courses.php?${new URLSearchParams({ page, limit, search })}`,
  );
}

export function createProgram(program) {
  return apiRequest("programs.php", {
    method: "POST",
    body: { program },
  });
}

export function updateCourse(courseId, fields) {
  return apiRequest(resourcePath("courses", courseId), {
    method: "PUT",
    body: fields,
  });
}

export function deleteFacility(facilityId) {
  return apiRequest(resourcePath("facilities", facilityId), {
    method: "DELETE",
  });
}
```

## Pagination Pattern

```js
const response = await apiRequest("courses.php?page=1&limit=10");

const rows = response.data;
const pagination = {
  total: response.meta.total,
  page: response.meta.page,
  limit: response.meta.limit,
  pages: response.meta.pages,
  hasNext: response.meta.hasNext,
  hasPrev: response.meta.hasPrev,
};
```

## Form Error Pattern

```js
try {
  await createProgram("");
} catch (error) {
  if (error.errors) {
    // Example: { program: ["this field is required", "min length is 1"] }
    setFieldErrors(error.errors);
  } else {
    setToast(error.message);
  }
}
```

## Role-Gated UI

```js
export function getRoleId() {
  return Number(localStorage.getItem("role_id"));
}

export function isAdmin() {
  return getRoleId() === 1;
}

export function isProgramChair() {
  return getRoleId() === 2;
}
```

Use this to hide admin-only buttons, but keep backend errors handled because UI hiding is not authorization.

## Schedule Generation

```js
export function generateSchedule(schedule_collection_id, college_year_id) {
  return apiRequest("generate_schedule.php", {
    method: "POST",
    body: {
      schedule_collection_id,
      college_year_id,
    },
  });
}
```

The generated rows include `schedule_id`, `day`, `start_time`, `end_time`, `course_id`, `schedule_collection_id`, `course_code`, `course_description`, and `units`.

Current generator limitations:

- Monday-Friday only.
- Time range `07:30:00` to `18:00:00`.
- Replaces existing rows in the target schedule collection.
- No instructor, classroom, or section assignment in the current implementation.
