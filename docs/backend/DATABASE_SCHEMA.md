# Frontend Data Model Reference

Last updated: May 5, 2026

This is a frontend-friendly overview. The source schema notes and seed data live in [schema.md](schema.md).

## Roles and Users

| Table | Primary fields | Used by frontend |
|---|---|---|
| `roles` | `role_id`, `role` | Role display and permission checks |
| `users` | `user_id`, `email`, `verified`, `role_id` | User management and login identity |
| `user_sessions` | `session_token`, `user_id`, `expires_at`, `logged_out` | Session token returned by login |
| `loggin_attempts` | `ip_address`, `successful`, `created_at` | Login rate limiting |

Role IDs:

| ID | Role |
|---:|---|
| `1` | `admin` |
| `2` | `program_chair` |

## People and Instructors

| Table | Primary fields | Notes |
|---|---|---|
| `person_details` | `person_detail_id`, `first_name`, `middle_name`, `last_name`, `birth_date`, `contact_number`, `contact_email`, `address`, `gender`, `sex` | Human profile data |
| `instructors` | `instructor_id`, `major`, `workload_lower_limit_minutes`, `workload_upper_limit_minutes`, `tin_number`, `GSIS_number` | Instructor workload and identifiers |
| `assign_personal_details` | `assign_personal_detail_id`, `person_detail_id`, `user_id`, `instructor_id` | Connects profile rows to users and/or instructors |

## Academic Structure

| Table | Primary fields | Notes |
|---|---|---|
| `programs` | `program_id`, `program` | Degree/program list |
| `college_year` | `college_year_id`, `college_year`, `semester`, `total_sections`, `program_id` | Year and semester under a program |
| `courses` | `course_id`, `course_code`, `course_description`, `units`, duration fields | Course master data |
| `curriculums` | `curriculum_id`, `college_year_id`, `course_id` | Courses assigned to a college year |

## Facilities and Classrooms

| Table | Primary fields | Notes |
|---|---|---|
| `facilities` | `facility_id`, `facility_name`, `total_rooms`, `total_floors`, `location` | Building/facility data |
| `classrooms` | `classroom_id`, `classroom_code`, `floor`, `is_laboratory`, `is_available`, `facility_id` | Rooms inside facilities |
| `classroom_courses` | `classroom_course_id`, `priority`, `classroom_id`, `course_id` | Preferred classrooms for courses |

## Scheduling

| Table | Primary fields | Notes |
|---|---|---|
| `schedule_collections` | `schedule_collection_id`, `title`, `description`, `registrar_approved`, `user_id` | Named schedule versions |
| `schedules` | `schedule_id`, `start_time`, `end_time`, `day`, `course_id`, `schedule_collection_id` | Current API writes these fields |
| `instructor_time_blocks` | `instructor_time_block_id`, `priority`, `start_time`, `end_time`, `day`, `instructor_id` | Instructor availability/preference blocks |
| `course_instructors` | `course_instructor_id`, `priority`, `assign_personal_detail_id`, `course_id` | Preferred instructors for courses |

Day values:

```txt
sunday, monday, tuesday, wednesday, thursday, friday, saturday
```

Time values use `HH:MM:SS`.

## Audit Trail

| Table | Primary fields | Notes |
|---|---|---|
| `audit_trail` | `audit_trail_id`, `user_id`, `action`, `entity_type`, `entity_id`, `old_data`, `new_data`, `created_at` | Read-only audit history for frontend display |

## Key Relationships

- `users.role_id` -> `roles.role_id`
- `user_sessions.user_id` -> `users.user_id`
- `assign_personal_details.user_id` -> `users.user_id`
- `assign_personal_details.instructor_id` -> `instructors.instructor_id`
- `assign_personal_details.person_detail_id` -> `person_details.person_detail_id`
- `college_year.program_id` -> `programs.program_id`
- `curriculums.college_year_id` -> `college_year.college_year_id`
- `curriculums.course_id` -> `courses.course_id`
- `classrooms.facility_id` -> `facilities.facility_id`
- `classroom_courses.classroom_id` -> `classrooms.classroom_id`
- `classroom_courses.course_id` -> `courses.course_id`
- `course_instructors.assign_personal_detail_id` -> `assign_personal_details.assign_personal_detail_id`
- `course_instructors.course_id` -> `courses.course_id`
- `schedules.course_id` -> `courses.course_id`
- `schedules.schedule_collection_id` -> `schedule_collections.schedule_collection_id`

## Current API Limitation

The schema notes include `classroom_id` and `instructor_id` on `schedules`, but the current `generate_schedule.php` and `schedules.php` API implementation writes only `start_time`, `end_time`, `day`, `course_id`, and `schedule_collection_id`.
