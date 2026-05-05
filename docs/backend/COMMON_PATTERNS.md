# Common Frontend Patterns

Last updated: May 5, 2026

These patterns are ready to adapt in a frontend app.

## Pattern 1: Store Auth Session

```js
export function saveAuthSession(loginResponse) {
  localStorage.setItem("session_token", loginResponse.data.session_token);
  localStorage.setItem("role_id", String(loginResponse.data.role_id));
}

export function readAuthSession() {
  return {
    sessionToken: localStorage.getItem("session_token"),
    roleId: Number(localStorage.getItem("role_id")),
  };
}

export function removeAuthSession() {
  localStorage.removeItem("session_token");
  localStorage.removeItem("role_id");
}
```

## Pattern 2: Protected Route Guard

```js
export function requireAuth(navigate) {
  const token = localStorage.getItem("session_token");

  if (!token) {
    navigate("/login");
    return false;
  }

  return true;
}
```

## Pattern 3: Admin-Only UI

```js
export function canManageData() {
  return Number(localStorage.getItem("role_id")) === 1;
}

export function AdminOnly({ children }) {
  return canManageData() ? children : null;
}
```

Do not rely on UI hiding for security. Backend authorization still decides.

## Pattern 4: List With Pagination

```js
import { apiRequest } from "./apiClient";

export async function fetchPagedList(file, params = {}) {
  const query = new URLSearchParams({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    ...(params.search ? { search: params.search } : {}),
    ...(params.sort_by ? { sort_by: params.sort_by } : {}),
    ...(params.sort_order ? { sort_order: params.sort_order } : {}),
  });

  const body = await apiRequest(`${file}.php?${query}`);

  return {
    rows: body.data ?? [],
    pagination: {
      total: body.meta.total ?? 0,
      page: body.meta.page ?? 1,
      limit: body.meta.limit ?? 10,
      pages: body.meta.pages ?? 0,
      hasNext: body.meta.hasNext ?? false,
      hasPrev: body.meta.hasPrev ?? false,
    },
  };
}
```

## Pattern 5: Create Form Submit

```js
export async function submitCreateProgram(form, setErrors) {
  setErrors({});

  try {
    await apiRequest("programs.php", {
      method: "POST",
      body: {
        program: form.program,
      },
    });

    return true;
  } catch (error) {
    if (error.errors) {
      setErrors(error.errors);
      return false;
    }

    throw error;
  }
}
```

## Pattern 6: Update Single Record

```js
import { resourcePath } from "./routes";

export async function updateProgram(programId, program) {
  return apiRequest(resourcePath("programs", programId), {
    method: "PUT",
    body: { program },
  });
}
```

## Pattern 7: Delete With Confirmation

```js
import { resourcePath } from "./routes";

export async function deleteCourse(courseId) {
  await apiRequest(resourcePath("courses", courseId), {
    method: "DELETE",
  });
}

export async function handleDeleteCourse(courseId, confirmDelete) {
  const confirmed = await confirmDelete(
    "Delete this course? This cannot be undone.",
  );

  if (!confirmed) {
    return false;
  }

  await deleteCourse(courseId);
  return true;
}
```

## Pattern 8: Field Error Renderer

```js
export function getFieldError(errors, field) {
  const messages = errors?.[field] ?? [];
  return messages.length > 0 ? messages.join(", ") : "";
}
```

## Pattern 9: Logout Button

```js
export async function handleLogout(navigate) {
  try {
    await apiRequest("auth/logout.php", { method: "POST" });
  } finally {
    localStorage.removeItem("session_token");
    localStorage.removeItem("role_id");
    navigate("/login");
  }
}
```

## Pattern 10: Schedule Collection Flow

1. Create or choose a schedule collection with `schedule-collections.php`.
2. Choose a college year from `college-year.php`.
3. Call `generate_schedule.php`.
4. Refresh `schedules.php?schedule_collection_id=<id>`.

```js
export async function generateAndLoadSchedule(collectionId, collegeYearId) {
  await apiRequest("generate_schedule.php", {
    method: "POST",
    body: {
      schedule_collection_id: collectionId,
      college_year_id: collegeYearId,
    },
  });

  const query = new URLSearchParams({
    schedule_collection_id: collectionId,
    limit: 25,
  });

  return apiRequest(`schedules.php?${query}`);
}
```

## Pattern 11: Time and Day Display

Day values are lowercase:

```txt
sunday, monday, tuesday, wednesday, thursday, friday, saturday
```

Times are strings:

```txt
07:30:00
18:00:00
```

Display helper:

```js
export function formatTime(time) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`1970-01-01T${time}`));
}
```

## Pattern 12: Global Request Error Handling

```js
export function handleApiError(error, navigate) {
  const authMessages = new Set([
    "invalid token!",
    "unauthenticated",
  ]);

  if (authMessages.has(error.message)) {
    localStorage.removeItem("session_token");
    localStorage.removeItem("role_id");
    navigate("/login");
    return;
  }

  if (error.message === "unauthorized") {
    navigate("/forbidden");
    return;
  }

  throw error;
}
```
