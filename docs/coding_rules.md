# Comprehensive Best Practices for General Programming, Vanilla JavaScript, and Tailwind CSS Frontend Development

> A practical guide for writing maintainable, secure, scalable, and readable code using general programming principles, vanilla JavaScript, and Tailwind CSS.

---

## Table of Contents

1. [General Programming Best Practices](#general-programming-best-practices)
2. [Project Structure Best Practices](#project-structure-best-practices)
3. [Code Readability and Maintainability](#code-readability-and-maintainability)
4. [Naming Conventions](#naming-conventions)
5. [Error Handling](#error-handling)
6. [Security Best Practices](#security-best-practices)
7. [Performance Best Practices](#performance-best-practices)
8. [Git and Version Control](#git-and-version-control)
9. [Vanilla JavaScript Best Practices](#vanilla-javascript-best-practices)
10. [DOM Manipulation Best Practices](#dom-manipulation-best-practices)
11. [Event Handling Best Practices](#event-handling-best-practices)
12. [API and Fetch Best Practices](#api-and-fetch-best-practices)
13. [Frontend State Management Without Frameworks](#frontend-state-management-without-frameworks)
14. [Reusable JavaScript Components](#reusable-javascript-components)
15. [Form Handling and Validation](#form-handling-and-validation)
16. [Tailwind CSS Best Practices](#tailwind-css-best-practices)
17. [Responsive Design Best Practices](#responsive-design-best-practices)
18. [Accessibility Best Practices](#accessibility-best-practices)
19. [Testing and Debugging](#testing-and-debugging)
20. [Production Readiness Checklist](#production-readiness-checklist)

---

# General Programming Best Practices

## 1. Write Code for Humans First

Code is read more often than it is written. Prioritize clarity over cleverness.

### Good

```js
const isUserAllowed = user.role === "admin" || user.permissions.includes("edit");
```

### Avoid

```js
const x = u.r === "admin" || u.p.includes("edit");
```

## 2. Keep Code Simple

Avoid unnecessary abstractions. Do not over-engineer small features.

Good code should be:

- Easy to understand
- Easy to change
- Easy to test
- Easy to debug

## 3. Follow the Single Responsibility Principle

Each function, module, or component should have one clear purpose.

### Good

```js
function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function formatCurrency(amount) {
  return `₱${amount.toFixed(2)}`;
}
```

### Avoid

```js
function processCart(items) {
  let total = 0;

  items.forEach(item => {
    total += item.price * item.quantity;
  });

  document.querySelector("#total").textContent = `₱${total.toFixed(2)}`;
  localStorage.setItem("cart_total", total);
}
```

The second example calculates data, updates the UI, and writes to storage all in one function.

## 4. Avoid Repetition

Repeated logic should usually be extracted into reusable functions.

### Avoid

```js
const userName = user.name.trim().toLowerCase();
const adminName = admin.name.trim().toLowerCase();
const customerName = customer.name.trim().toLowerCase();
```

### Better

```js
function normalizeName(name) {
  return name.trim().toLowerCase();
}

const userName = normalizeName(user.name);
const adminName = normalizeName(admin.name);
const customerName = normalizeName(customer.name);
```

## 5. Make Invalid States Hard to Represent

Design your data structures so the program avoids impossible or confusing states.

### Avoid

```js
const user = {
  isLoggedIn: false,
  token: "abc123"
};
```

This is confusing because a logged-out user should not have an active token.

### Better

```js
const authState = {
  status: "guest",
  token: null
};
```

or:

```js
const authState = {
  status: "authenticated",
  token: "abc123"
};
```

## 6. Prefer Explicit Logic

Do not hide important behavior behind vague helper functions.

### Avoid

```js
doStuff();
```

### Better

```js
loadUserProfile();
validateUserSession();
renderDashboard();
```

---

# Project Structure Best Practices

A clean project structure makes your code easier to maintain.

## Recommended Vanilla JS Frontend Structure

```txt
project-root/
│
├── index.html
├── package.json
├── README.md
│
├── public/
│   ├── images/
│   └── icons/
│
├── src/
│   ├── main.js
│   ├── app.js
│   │
│   ├── api/
│   │   ├── client.js
│   │   └── usersApi.js
│   │
│   ├── components/
│   │   ├── Table.js
│   │   ├── Modal.js
│   │   └── Pagination.js
│   │
│   ├── utils/
│   │   ├── dom.js
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   ├── state/
│   │   └── store.js
│   │
│   └── styles/
│       └── input.css
│
└── dist/
```

## Folder Responsibilities

| Folder | Purpose |
|---|---|
| `api/` | API request logic |
| `components/` | Reusable UI components |
| `utils/` | General helper functions |
| `state/` | App-level state management |
| `styles/` | Tailwind input CSS and custom styles |
| `public/` | Static files such as images and icons |

## Keep Business Logic Separate from UI Logic

### Good

```js
// usersApi.js
export async function getUsers() {
  const response = await fetch("/api/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users.");
  }

  return response.json();
}
```

```js
// usersPage.js
import { getUsers } from "./api/usersApi.js";

async function renderUsers() {
  const users = await getUsers();
  // Render users to the page
}
```

---

# Code Readability and Maintainability

## 1. Use Consistent Formatting

Use a formatter such as Prettier.

Recommended formatting rules:

- 2 spaces for indentation
- Semicolons enabled or disabled consistently
- Double quotes or single quotes consistently
- Maximum line length around 80–120 characters

## 2. Avoid Deep Nesting

Deep nesting makes code difficult to follow.

### Avoid

```js
if (user) {
  if (user.isActive) {
    if (user.role === "admin") {
      showAdminPanel();
    }
  }
}
```

### Better

```js
if (!user) return;
if (!user.isActive) return;
if (user.role !== "admin") return;

showAdminPanel();
```

## 3. Prefer Guard Clauses

Guard clauses make functions easier to read.

```js
function deleteUser(user) {
  if (!user) {
    throw new Error("User is required.");
  }

  if (user.role === "admin") {
    throw new Error("Admin users cannot be deleted.");
  }

  return apiDeleteUser(user.id);
}
```

## 4. Use Comments Carefully

Good comments explain **why**, not obvious **what**.

### Bad

```js
// Add 1 to count
count++;
```

### Good

```js
// Retry once because the coinslot may send a delayed pulse.
retryCoinValidation();
```

## 5. Remove Dead Code

Do not leave unused functions, old comments, or commented-out code in production.

Use Git history instead of keeping dead code.

---

# Naming Conventions

## General Rules

Names should be:

- Clear
- Searchable
- Specific
- Consistent

## Variables

Use `camelCase`.

```js
const totalAmount = 250;
const selectedUserId = 12;
const isModalOpen = false;
```

## Constants

Use `UPPER_SNAKE_CASE` for fixed configuration values.

```js
const API_BASE_URL = "https://api.example.com";
const MAX_RETRY_COUNT = 3;
```

## Functions

Use verbs or verb phrases.

```js
getUsers();
createInvoice();
validateForm();
renderTable();
```

## Boolean Names

Use prefixes such as:

- `is`
- `has`
- `can`
- `should`

```js
const isLoading = true;
const hasPermission = false;
const canEdit = true;
const shouldRetry = false;
```

## Avoid Vague Names

### Avoid

```js
const data = [];
const item = {};
const temp = "";
function handle() {}
```

### Better

```js
const users = [];
const selectedProduct = {};
const formattedDate = "";
function handleSubmitForm() {}
```

---

# Error Handling

## 1. Fail Clearly

Do not silently ignore errors.

### Avoid

```js
try {
  await saveUser(user);
} catch (error) {}
```

### Better

```js
try {
  await saveUser(user);
} catch (error) {
  console.error("Failed to save user:", error);
  showToast("Unable to save user. Please try again.");
}
```

## 2. Use Specific Error Messages

### Avoid

```js
throw new Error("Something went wrong.");
```

### Better

```js
throw new Error("User email is required before creating an account.");
```

## 3. Handle Expected and Unexpected Errors Differently

Expected errors:

- Invalid form input
- Unauthorized request
- Missing data
- Network timeout

Unexpected errors:

- Null reference
- Broken API response
- Logic bug

```js
if (!response.ok) {
  if (response.status === 401) {
    throw new Error("You are not authorized.");
  }

  if (response.status === 404) {
    throw new Error("Resource not found.");
  }

  throw new Error("Unexpected server error.");
}
```

## 4. Show User-Friendly Errors

Never expose raw system errors directly to users.

### Avoid

```js
alert(error.stack);
```

### Better

```js
showToast("A problem occurred while loading the page.");
console.error(error);
```

---

# Security Best Practices

## 1. Never Trust User Input

Validate data on both frontend and backend.

Frontend validation improves UX. Backend validation protects the system.

## 2. Avoid `innerHTML` with User Input

### Dangerous

```js
element.innerHTML = userInput;
```

This can cause cross-site scripting vulnerabilities.

### Safer

```js
element.textContent = userInput;
```

## 3. Sanitize Dynamic HTML

If you must render HTML from user-generated content, sanitize it first using a trusted sanitizer.

## 4. Do Not Store Sensitive Data in Local Storage

Avoid storing:

- Passwords
- Access tokens
- Refresh tokens
- API secrets
- Private keys

`localStorage` can be accessed by JavaScript running on the page.

## 5. Use HTTPS

All production sites should use HTTPS.

## 6. Protect API Endpoints

Frontend checks are not enough.

Backend must enforce:

- Authentication
- Authorization
- Rate limiting
- Input validation
- CSRF protection where applicable

## 7. Avoid Exposing Secrets in Frontend Code

Anything shipped to the browser is visible to users.

Never put this in frontend JavaScript:

```js
const SECRET_API_KEY = "super-secret-key";
```

## 8. Use Content Security Policy

A Content Security Policy helps reduce XSS risk.

Example header:

```txt
Content-Security-Policy: default-src 'self'; script-src 'self';
```

---

# Performance Best Practices

## 1. Avoid Unnecessary DOM Updates

DOM operations are expensive compared to normal JavaScript operations.

### Avoid

```js
users.forEach(user => {
  list.innerHTML += `<li>${user.name}</li>`;
});
```

### Better

```js
const fragment = document.createDocumentFragment();

users.forEach(user => {
  const item = document.createElement("li");
  item.textContent = user.name;
  fragment.appendChild(item);
});

list.appendChild(fragment);
```

## 2. Debounce Expensive Input Events

For search fields, avoid firing API calls on every keystroke.

```js
function debounce(callback, delay = 300) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

const handleSearch = debounce((event) => {
  fetchSearchResults(event.target.value);
}, 400);

searchInput.addEventListener("input", handleSearch);
```

## 3. Lazy Load Heavy Resources

Load large images, modules, or data only when needed.

```html
<img src="product.jpg" alt="Product image" loading="lazy">
```

## 4. Minimize Bundle Size

For vanilla JS projects:

- Avoid large libraries unless necessary
- Remove unused code
- Use production builds
- Minify CSS and JS
- Compress images

## 5. Cache Repeated Queries

```js
const userCache = new Map();

async function getUserById(id) {
  if (userCache.has(id)) {
    return userCache.get(id);
  }

  const user = await fetchUserById(id);
  userCache.set(id, user);

  return user;
}
```

---

# Git and Version Control

## 1. Commit Small, Logical Changes

Good commits are easy to review and revert.

### Good

```txt
Add user pagination component
Fix form validation for empty email
Refactor API client error handling
```

### Avoid

```txt
update
final
fix stuff
changes
```

## 2. Use Branches

Recommended branch names:

```txt
feature/user-table
fix/login-validation
refactor/api-client
docs/setup-guide
```

## 3. Write Useful Commit Messages

Recommended format:

```txt
type: short description
```

Examples:

```txt
feat: add reusable modal component
fix: prevent duplicate form submission
docs: update installation guide
refactor: simplify table rendering
```

## 4. Do Not Commit Secrets

Use `.env` files for local configuration and add them to `.gitignore`.

```txt
.env
.env.local
node_modules/
dist/
```

## 5. Use Pull Requests or Code Review

Even solo developers benefit from reviewing their own changes before merging.

---

# Vanilla JavaScript Best Practices

## 1. Use Modern JavaScript

Prefer:

- `const` by default
- `let` when reassignment is needed
- Arrow functions for short callbacks
- Template literals
- Destructuring
- Modules

### Good

```js
const user = {
  id: 1,
  name: "Ana",
  role: "admin"
};

const { id, name } = user;
```

## 2. Avoid `var`

`var` has function scope and can cause confusing bugs.

### Avoid

```js
var count = 0;
```

### Better

```js
let count = 0;
```

## 3. Prefer `const`

Use `const` unless the variable needs to be reassigned.

```js
const users = [];
users.push("Ana"); // This is allowed.

let selectedUser = null;
selectedUser = users[0];
```

## 4. Avoid Global Variables

Global variables can be modified from anywhere.

### Avoid

```js
let users = [];
let currentPage = 1;
```

### Better

```js
const appState = {
  users: [],
  currentPage: 1
};
```

or isolate state inside a module.

```js
const UserStore = (() => {
  let users = [];

  return {
    getUsers() {
      return [...users];
    },
    setUsers(newUsers) {
      users = [...newUsers];
    }
  };
})();
```

## 5. Use ES Modules

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

```js
// main.js
import { add } from "./math.js";

console.log(add(2, 3));
```

```html
<script type="module" src="./src/main.js"></script>
```

## 6. Avoid Mutating Data Unexpectedly

### Avoid

```js
function addUser(users, user) {
  users.push(user);
  return users;
}
```

### Better

```js
function addUser(users, user) {
  return [...users, user];
}
```

## 7. Prefer Pure Functions for Business Logic

Pure functions are easier to test.

```js
function calculateDiscount(price, percentage) {
  return price * (percentage / 100);
}
```

A pure function:

- Does not change external state
- Returns the same output for the same input
- Has no hidden side effects

## 8. Use Strict Equality

### Avoid

```js
if (value == 1) {}
```

### Better

```js
if (value === 1) {}
```

## 9. Handle Null and Undefined Safely

```js
const city = user?.address?.city ?? "Unknown";
```

## 10. Use Meaningful Data Structures

Use arrays for ordered lists and maps for key-value lookups.

```js
const usersById = new Map();

users.forEach(user => {
  usersById.set(user.id, user);
});
```

---

# DOM Manipulation Best Practices

## 1. Cache DOM Selectors

### Avoid

```js
document.querySelector("#submitBtn").disabled = true;
document.querySelector("#submitBtn").textContent = "Saving...";
```

### Better

```js
const submitButton = document.querySelector("#submitBtn");

submitButton.disabled = true;
submitButton.textContent = "Saving...";
```

## 2. Check Elements Before Using Them

```js
const form = document.querySelector("#userForm");

if (!form) {
  console.warn("User form not found.");
} else {
  form.addEventListener("submit", handleSubmit);
}
```

## 3. Prefer `textContent` for Text

```js
nameElement.textContent = user.name;
```

Avoid using `innerHTML` unless necessary.

## 4. Use `dataset` for Custom Data

```html
<button data-user-id="15">Edit</button>
```

```js
const userId = button.dataset.userId;
```

## 5. Use Template Functions

```js
function createUserRow(user) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td class="px-4 py-2"></td>
    <td class="px-4 py-2"></td>
  `;

  row.children[0].textContent = user.name;
  row.children[1].textContent = user.email;

  return row;
}
```

This approach avoids injecting user input directly into HTML.

---

# Event Handling Best Practices

## 1. Use Named Event Handlers

### Avoid

```js
button.addEventListener("click", () => {
  // many lines of logic
});
```

### Better

```js
button.addEventListener("click", handleSaveButtonClick);

function handleSaveButtonClick(event) {
  event.preventDefault();
  saveUser();
}
```

## 2. Use Event Delegation for Dynamic Elements

Instead of adding listeners to every button, attach one listener to a parent.

```js
const table = document.querySelector("#usersTable");

table.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-action='edit']");

  if (!editButton) return;

  const userId = editButton.dataset.userId;
  openEditModal(userId);
});
```

## 3. Remove Event Listeners When Needed

Useful for modals, temporary views, or cleanup.

```js
function handleEscape(event) {
  if (event.key === "Escape") {
    closeModal();
    document.removeEventListener("keydown", handleEscape);
  }
}

document.addEventListener("keydown", handleEscape);
```

## 4. Prevent Duplicate Submissions

```js
let isSubmitting = false;

async function handleSubmit(event) {
  event.preventDefault();

  if (isSubmitting) return;

  isSubmitting = true;

  try {
    await saveForm();
  } finally {
    isSubmitting = false;
  }
}
```

---

# API and Fetch Best Practices

## 1. Create a Reusable API Client

```js
const API_BASE_URL = "/api";

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "API request failed.");
  }

  return data;
}
```

## 2. Use HTTP Methods Properly

| Action | Method |
|---|---|
| Get data | `GET` |
| Create data | `POST` |
| Replace data | `PUT` |
| Partially update data | `PATCH` |
| Delete data | `DELETE` |

## 3. Send JSON Correctly

```js
await apiRequest("/users", {
  method: "POST",
  body: JSON.stringify({
    name: "Ana",
    email: "ana@example.com"
  })
});
```

## 4. Handle Loading, Success, and Error States

```js
async function loadUsers() {
  setLoading(true);
  clearError();

  try {
    const users = await apiRequest("/users");
    renderUsers(users);
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}
```

## 5. Use `AbortController` for Cancellable Requests

```js
let currentController = null;

async function searchUsers(query) {
  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();

  try {
    const users = await apiRequest(`/users/search?q=${encodeURIComponent(query)}`, {
      signal: currentController.signal
    });

    renderUsers(users);
  } catch (error) {
    if (error.name === "AbortError") return;

    showError("Search failed.");
  }
}
```

## 6. Encode URL Parameters

```js
const params = new URLSearchParams({
  search: "john doe",
  page: "1",
  limit: "10"
});

fetch(`/api/users?${params.toString()}`);
```

---

# Frontend State Management Without Frameworks

For small to medium vanilla JS apps, simple state management is enough.

## Basic Store Pattern

```js
export function createStore(initialState) {
  let state = structuredClone(initialState);
  const listeners = new Set();

  function getState() {
    return structuredClone(state);
  }

  function setState(updater) {
    const nextState =
      typeof updater === "function" ? updater(state) : updater;

    state = {
      ...state,
      ...nextState
    };

    listeners.forEach(listener => listener(getState()));
  }

  function subscribe(listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  return {
    getState,
    setState,
    subscribe
  };
}
```

## Usage

```js
const store = createStore({
  users: [],
  selectedUserId: null,
  isLoading: false
});

store.subscribe((state) => {
  renderUsers(state.users);
});

store.setState({
  isLoading: true
});
```

## State Best Practices

- Keep state minimal
- Do not duplicate derived data
- Keep UI rendering separate from state updates
- Avoid modifying state directly
- Centralize important state transitions

---

# Reusable JavaScript Components

A reusable component should:

- Accept configuration
- Avoid hardcoded selectors
- Expose clear public methods
- Keep internal implementation private
- Clean up event listeners if destroyed

## Example: Reusable Modal Component

```js
export function createModal({ root, onClose }) {
  if (!root) {
    throw new Error("Modal root element is required.");
  }

  const closeButton = root.querySelector("[data-modal-close]");

  function open() {
    root.classList.remove("hidden");
    document.addEventListener("keydown", handleKeydown);
  }

  function close() {
    root.classList.add("hidden");
    document.removeEventListener("keydown", handleKeydown);
    onClose?.();
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      close();
    }
  }

  closeButton?.addEventListener("click", close);

  function destroy() {
    closeButton?.removeEventListener("click", close);
    document.removeEventListener("keydown", handleKeydown);
  }

  return {
    open,
    close,
    destroy
  };
}
```

## Example: Reusable Pagination Component

```js
export function createPagination({
  root,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) {
  if (!root) {
    throw new Error("Pagination root element is required.");
  }

  let state = {
    currentPage,
    totalPages
  };

  function render() {
    root.innerHTML = "";

    const previousButton = createButton("Previous", state.currentPage === 1);
    const nextButton = createButton("Next", state.currentPage === state.totalPages);

    previousButton.addEventListener("click", () => goToPage(state.currentPage - 1));
    nextButton.addEventListener("click", () => goToPage(state.currentPage + 1));

    root.append(previousButton, createPageLabel(), nextButton);
  }

  function createButton(label, disabled) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.disabled = disabled;
    button.className = "rounded-lg border px-3 py-2 disabled:opacity-50";

    return button;
  }

  function createPageLabel() {
    const label = document.createElement("span");
    label.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
    label.className = "px-3 py-2 text-sm text-gray-700";

    return label;
  }

  function goToPage(page) {
    if (page < 1 || page > state.totalPages) return;

    state.currentPage = page;
    render();
    onPageChange?.(page);
  }

  function update(nextState) {
    state = {
      ...state,
      ...nextState
    };

    render();
  }

  render();

  return {
    update,
    goToPage
  };
}
```

---

# Form Handling and Validation

## 1. Use Native Form Features First

```html
<input
  type="email"
  name="email"
  required
  class="rounded-lg border px-3 py-2"
>
```

Use built-in attributes:

- `required`
- `minlength`
- `maxlength`
- `type="email"`
- `type="number"`
- `min`
- `max`
- `pattern`

## 2. Extract Form Data Safely

```js
function getFormData(form) {
  const formData = new FormData(form);

  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    role: String(formData.get("role") || "user")
  };
}
```

## 3. Validate Before Submitting

```js
function validateUserForm(values) {
  const errors = {};

  if (!values.name) {
    errors.name = "Name is required.";
  }

  if (!values.email) {
    errors.email = "Email is required.";
  } else if (!values.email.includes("@")) {
    errors.email = "Email is invalid.";
  }

  return errors;
}
```

## 4. Display Field-Level Errors

```js
function showFieldError(fieldName, message) {
  const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);

  if (!errorElement) return;

  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}
```

## 5. Disable Submit Button While Saving

```js
async function handleSubmit(event) {
  event.preventDefault();

  const submitButton = event.submitter;
  submitButton.disabled = true;
  submitButton.textContent = "Saving...";

  try {
    await saveData();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Save";
  }
}
```

---

# Tailwind CSS Best Practices

## 1. Use Tailwind for Utility-First Styling

Tailwind is best when you compose small utility classes directly in your HTML or JS-generated templates.

```html
<button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
  Save
</button>
```

## 2. Keep Class Lists Organized

A common order:

1. Layout
2. Spacing
3. Sizing
4. Typography
5. Color
6. Border
7. Effects
8. States
9. Responsive variants

Example:

```html
<div class="flex items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm hover:shadow-md md:p-6">
  ...
</div>
```

## 3. Extract Repeated Patterns

If the same long class list appears repeatedly, create reusable component classes or JavaScript constants.

### Option A: JavaScript Constant

```js
const buttonBaseClass =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition";

const buttonPrimaryClass =
  `${buttonBaseClass} bg-blue-600 text-white hover:bg-blue-700`;
```

### Option B: Tailwind `@apply`

```css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }
}
```

Use `@apply` carefully. Do not recreate an entire CSS framework inside Tailwind.

## 4. Avoid Random One-Off Values Unless Needed

### Avoid

```html
<div class="mt-[13px] w-[427px]">
```

### Better

```html
<div class="mt-3 w-full max-w-md">
```

Use arbitrary values only when the design truly requires them.

## 5. Use Design Tokens in `tailwind.config.js`

```js
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          700: "#1d4ed8"
        }
      },
      spacing: {
        18: "4.5rem"
      }
    }
  }
};
```

## 6. Use Responsive Utilities Intentionally

Start with mobile-first styles, then add larger breakpoints.

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  ...
</div>
```

## 7. Use State Variants

```html
<button class="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50">
  Submit
</button>
```

Useful variants:

- `hover:`
- `focus:`
- `active:`
- `disabled:`
- `dark:`
- `sm:`
- `md:`
- `lg:`
- `xl:`

## 8. Avoid Excessive Custom CSS

Before writing custom CSS, check whether Tailwind already provides the utility.

## 9. Use Consistent Spacing

Recommended spacing pattern:

| Element | Suggested Classes |
|---|---|
| Small button | `px-3 py-2` |
| Normal button | `px-4 py-2` |
| Card | `p-4 md:p-6` |
| Section | `py-8 md:py-12` |
| Page container | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` |

## 10. Build Components with Variants

```js
const buttonVariants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

function createButton({ label, variant = "primary" }) {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = label;
  button.className = [
    "rounded-lg px-4 py-2 text-sm font-medium transition",
    buttonVariants[variant] ?? buttonVariants.primary
  ].join(" ");

  return button;
}
```

---

# Responsive Design Best Practices

## 1. Design Mobile First

Start with the smallest layout, then enhance for larger screens.

```html
<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  ...
</div>
```

## 2. Avoid Fixed Widths

### Avoid

```html
<div class="w-[900px]">
```

### Better

```html
<div class="w-full max-w-4xl">
```

## 3. Use Fluid Containers

```html
<main class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
  ...
</main>
```

## 4. Test Common Screen Sizes

Check layouts at:

- 320px
- 375px
- 768px
- 1024px
- 1280px
- 1440px

## 5. Make Tables Responsive

For large tables, wrap them in an overflow container.

```html
<div class="overflow-x-auto rounded-xl border">
  <table class="min-w-full divide-y divide-gray-200">
    ...
  </table>
</div>
```

---

# Accessibility Best Practices

Accessibility improves usability for all users.

## 1. Use Semantic HTML

### Good

```html
<button type="button">Open Menu</button>
```

### Avoid

```html
<div onclick="openMenu()">Open Menu</div>
```

## 2. Always Label Form Inputs

```html
<label for="email" class="block text-sm font-medium text-gray-700">
  Email
</label>

<input
  id="email"
  name="email"
  type="email"
  required
  class="mt-1 rounded-lg border px-3 py-2"
>
```

## 3. Use Button Elements for Actions

Use:

```html
<button type="button">Delete</button>
```

Not:

```html
<a href="#" onclick="deleteItem()">Delete</a>
```

## 4. Maintain Keyboard Support

Interactive elements should be reachable and usable with the keyboard.

Check:

- `Tab`
- `Enter`
- `Space`
- `Escape`
- Arrow keys where appropriate

## 5. Provide Focus Styles

```html
<button class="rounded-lg bg-blue-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
  Save
</button>
```

## 6. Use ARIA Only When Necessary

Native HTML is usually better than custom ARIA-heavy components.

### Good

```html
<nav aria-label="Main navigation">
  ...
</nav>
```

## 7. Add Useful Alt Text

```html
<img src="profile.jpg" alt="Profile photo of Juan Dela Cruz">
```

For decorative images:

```html
<img src="divider.svg" alt="">
```

## 8. Ensure Color Contrast

Text should be readable against its background.

Avoid very light gray text on white backgrounds.

---

# Testing and Debugging

## 1. Test Core Logic Separately

Business logic should be testable without the DOM.

```js
function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
```

## 2. Use Console Methods Properly

```js
console.log("User:", user);
console.warn("Missing optional config.");
console.error("Failed to load users:", error);
console.table(users);
```

Remove unnecessary logs before production.

## 3. Test User Flows

Test complete flows such as:

- Login
- Create item
- Edit item
- Delete item
- Search
- Pagination
- Form validation
- Error state
- Empty state
- Loading state

## 4. Test Edge Cases

Examples:

- Empty API response
- Slow network
- Failed API response
- Invalid input
- Long text
- Special characters
- Duplicate submission
- User double-clicks button
- User refreshes page mid-action

## 5. Use Browser DevTools

Useful DevTools tabs:

| Tab | Purpose |
|---|---|
| Elements | Inspect HTML and CSS |
| Console | View logs and errors |
| Network | Inspect API requests |
| Application | Inspect local storage and cookies |
| Performance | Find slow rendering |
| Lighthouse | Audit accessibility and performance |

---

# Production Readiness Checklist

## General Code

- [ ] Code is formatted consistently
- [ ] Naming is clear and consistent
- [ ] Dead code is removed
- [ ] Repeated logic is extracted
- [ ] Functions have single responsibilities
- [ ] Errors are handled properly
- [ ] No unnecessary global variables
- [ ] No hardcoded secrets

## JavaScript

- [ ] Uses `const` and `let`, not `var`
- [ ] Uses strict equality
- [ ] API calls handle loading, success, and error states
- [ ] Form submissions prevent duplicates
- [ ] User input is validated
- [ ] DOM updates are efficient
- [ ] Event listeners are organized
- [ ] Dynamic elements use event delegation where appropriate
- [ ] URL parameters are encoded
- [ ] Async operations are wrapped in `try/catch`

## Tailwind CSS

- [ ] Layout is mobile-first
- [ ] Repeated class groups are extracted when useful
- [ ] Arbitrary values are minimized
- [ ] Spacing is consistent
- [ ] Responsive breakpoints are tested
- [ ] Focus states are visible
- [ ] Disabled states are styled
- [ ] Dark mode is handled if supported

## Accessibility

- [ ] Semantic HTML is used
- [ ] Inputs have labels
- [ ] Buttons are real `<button>` elements
- [ ] Images have appropriate `alt` text
- [ ] Keyboard navigation works
- [ ] Color contrast is readable
- [ ] Modals handle focus properly
- [ ] Error messages are visible and understandable

## Security

- [ ] User input is not inserted with unsafe `innerHTML`
- [ ] Sensitive data is not stored in local storage
- [ ] Frontend does not expose API secrets
- [ ] API endpoints validate permissions server-side
- [ ] HTTPS is used in production
- [ ] Error messages do not expose sensitive internals

## Performance

- [ ] Images are optimized
- [ ] Large resources are lazy-loaded
- [ ] Expensive input events are debounced
- [ ] DOM updates are batched
- [ ] Unused CSS and JS are removed in production
- [ ] Network requests are not duplicated unnecessarily

---

# Recommended Development Workflow

## 1. Plan

Before coding, identify:

- What problem is being solved?
- What data is needed?
- What UI states are required?
- What errors can happen?
- What can be reused?

## 2. Build Small Pieces

Develop in small steps:

1. Create static HTML layout
2. Add Tailwind styling
3. Add JavaScript behavior
4. Connect API
5. Add loading and error states
6. Add validation
7. Refactor reusable logic

## 3. Review

Before finishing:

- Read the code from top to bottom
- Remove unnecessary complexity
- Rename unclear variables
- Test edge cases
- Check mobile layout
- Check accessibility

---

# Example: Clean Vanilla JS + Tailwind Pattern

## HTML

```html
<section class="mx-auto max-w-4xl px-4 py-8">
  <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h1 class="text-2xl font-bold text-gray-900">Users</h1>

    <button
      id="addUserBtn"
      type="button"
      class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Add User
    </button>
  </div>

  <div id="statusMessage" class="mb-4 hidden rounded-lg border px-4 py-3 text-sm"></div>

  <div class="overflow-x-auto rounded-xl border bg-white">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Name</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Email</th>
          <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Actions</th>
        </tr>
      </thead>
      <tbody id="usersTableBody" class="divide-y divide-gray-200"></tbody>
    </table>
  </div>
</section>
```

## JavaScript

```js
const tableBody = document.querySelector("#usersTableBody");
const statusMessage = document.querySelector("#statusMessage");

async function loadUsers() {
  showStatus("Loading users...", "info");

  try {
    const users = await fetchUsers();

    renderUsers(users);
    hideStatus();
  } catch (error) {
    console.error(error);
    showStatus("Unable to load users.", "error");
  }
}

async function fetchUsers() {
  const response = await fetch("/api/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users.");
  }

  return response.json();
}

function renderUsers(users) {
  tableBody.textContent = "";

  if (users.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 3;
    cell.textContent = "No users found.";
    cell.className = "px-4 py-6 text-center text-sm text-gray-500";

    row.appendChild(cell);
    tableBody.appendChild(row);

    return;
  }

  const fragment = document.createDocumentFragment();

  users.forEach(user => {
    fragment.appendChild(createUserRow(user));
  });

  tableBody.appendChild(fragment);
}

function createUserRow(user) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = user.name;
  nameCell.className = "px-4 py-3 text-sm text-gray-900";

  const emailCell = document.createElement("td");
  emailCell.textContent = user.email;
  emailCell.className = "px-4 py-3 text-sm text-gray-600";

  const actionCell = document.createElement("td");
  actionCell.className = "px-4 py-3 text-right";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.dataset.userId = user.id;
  editButton.className = "text-sm font-medium text-blue-600 hover:text-blue-800";

  actionCell.appendChild(editButton);
  row.append(nameCell, emailCell, actionCell);

  return row;
}

function showStatus(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.className = "mb-4 rounded-lg border px-4 py-3 text-sm";

  if (type === "error") {
    statusMessage.classList.add("border-red-200", "bg-red-50", "text-red-700");
  } else {
    statusMessage.classList.add("border-blue-200", "bg-blue-50", "text-blue-700");
  }
}

function hideStatus() {
  statusMessage.classList.add("hidden");
}

loadUsers();
```

---

# Final Notes

Strong frontend code is not only about making the interface look good. It should also be:

- Predictable
- Secure
- Accessible
- Responsive
- Maintainable
- Easy to debug
- Easy to extend

For vanilla JavaScript and Tailwind CSS projects, the best approach is usually:

1. Keep JavaScript modular.
2. Keep UI components reusable.
3. Keep Tailwind classes consistent.
4. Keep user input safe.
5. Keep state predictable.
6. Keep the user experience clear in loading, empty, success, and error states.
