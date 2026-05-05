

// priority: 
//    0 = blacklisted & 1+ = whitelisted
//    2+ is higher priority than 1
// total_time_requirement: 0 = not required

Table roles {
  role_id int PK [increment, unique, not null]
  role varchar 
}

Records roles(role_id, role) {
  1, 'admin'
    // - AKA registrar
    // - finalizes & approves schedule
  2, 'program_chair'
    // - makes sched
    // - send to registrar 
    // - print & distribute approved schedule 
  
    
}

Table users {
  user_id int PK [increment, unique, not null]
  email varchar [unique, not null]
  password_hash varchar [not null]
  password_salt varchar [not null]
  verified bool [default: false] // registrar handles this
  
  // -------- FK --------
  role_id int [default: 2] // 2 = program_chair
  Indexes {
    (email)
    (role_id)
  }
} 

// password: P@ssw0rd
Records users (user_id, email, password_hash, password_salt, verified, role_id) {
  1, 'admin@gmail.com', '$argon2id$v=19$m=7168,t=5,p=1$R0F3T1Jyd25SRk0ySW41OA$JZGHI7L1RxCCiam+yiXVJqXEPKqhx0JB1hL0tW6byoA', 'c0c253bceec5b0fb269cc38a698ef83a', true, 1 
  2, 'programchair@gmail.com', '$argon2id$v=19$m=7168,t=5,p=1$R0F3T1Jyd25SRk0ySW41OA$JZGHI7L1RxCCiam+yiXVJqXEPKqhx0JB1hL0tW6byoA', 'c0c253bceec5b0fb269cc38a698ef83a', true, 2 
}

Enum gender {
  male
  female
  non_binary
  agender
  genderfluid
  genderqueer
  bigender
  pangender
  demiboy
  demigirl
  two_spirit
  other
  prefer_not_to_say
}

Enum sex {
  male
  female
  intersex
}

Table person_details {
  person_detail_id int PK [increment, unique, not null]
  first_name varchar
  middle_name varchar
  last_name  varchar
  birth_date date 
  contact_number varchar
  contact_email varchar 
  address text

  gender gender
  sex sex 
}


Records person_details(person_detail_id, first_name, middle_name, last_name, birth_date, contact_number, contact_email, address, gender, sex)
{

  // BSIT 2nd year 2nd Semester
  1, 'Mark Reinier', 'G', 'De Guzman', '2026-01-01', '0987654321', 'contact@email.com', 'address...', 'prefer_not_to_say', 'male'
  2, 'Paulo Jay Christian', 'P', 'De Guzman', '2026-01-01', '0987654321', 'contact@email.com', 'address...', 'prefer_not_to_say', 'male'
  3, 'Nicko', 'A', 'Magnaye', '2026-01-01', '0987654321', 'contact@email.com', 'address...', 'prefer_not_to_say', 'male'
  4, 'Ernesto JR.', 'B', 'Rodriguez', '2026-01-01', '0987654321', 'contact@email.com', 'address...', 'prefer_not_to_say', 'male'
  5, 'Christian', '', 'Cabrera', '2026-01-01', '0987654321', 'contact@email.com', 'address...', 'prefer_not_to_say', 'male'
  6, 'Uriel', 'M', 'Melendres', '2026-01-01', '0987654321', 'contact@email.com', 'address...', 'prefer_not_to_say', 'male'
  7, 'Kate Anne', '', 'Maganggo', '2026-01-01', '0987654321', 'contact@email.com', 'address...', 'prefer_not_to_say', 'female'
  8, 'Program', 'PC', 'Chair', '2026-01-01', '0987654321', 'contact@email.com', 'address...', 'prefer_not_to_say', 'female'
}

Table assign_personal_details {
  assign_personal_detail_id int PK [increment, unique, not null]
  // -------- FK --------
  person_detail_id int
  user_id int [null]
  instructor_id int [null] 
    // exept for "person_detail_id" only 1 can be null
}

Records assign_personal_details(assign_personal_detail_id, person_detail_id, user_id, instructor_id)
{
  // instructors only
  1, 1, null, 1 // Mark Reinier
  2, 2, null, 2 // Paulo Jay Christian
  3, 3, null, 3 // Nicko
  4, 4, null, 4 // Ernesto JR.
  5, 5, null, 5 // Christian
  6, 6, null, 6 // Uriel
  7, 7, null, 7 // Kate Anne

  // both an instructor & user
  8, 8, 2, 8 // Program chair
}


Table instructors {
  instructor_id int PK [increment, unique, not null]
  major varchar [not null]
  workload_lower_limit_minutes int [not null]
  workload_upper_limit_minutes int [not null]  // gives warning when exceeded
  tin_number varchar(20) [not null, unique]
  GSIS_number varchar(20) [not null, unique]
} 


// 18000 = 300 hours
Records instructors(instructor_id, major, workload_lower_limit_minutes, workload_upper_limit_minutes, tin_number, GSIS_number){
  1, 'Arts', 18000, 18000, '42381794', '3874897'
  2, 'IT', 18000, 18000, '42381213794', '387423897'
  3, 'n/a', 18000, 18000, '42421794', '3874231897'
  4, 'Networking', 18000, 18000, '423812333794', '3874321897'
  5, 'IT', 18000, 18000, '4238123213794', '3872134897'
  6, 'IT', 18000, 18000, '41212381794', '3874213897'
  7, 'English', 18000, 18000, '4238217944231', '38748123197'
  8, 'n/a', 18000, 18000, '42382179441', '387481297' 
}






Table instructor_time_blocks { 
  instructor_time_block_id int PK [increment, unique, not null]
  priority int [not null, default: 1]
  start_time time [not null]
  end_time time [not null]
  day day [not null]

  // -------- FK -------- 
  instructor_id int [not null]
}


Enum day 
{
  sunday
  monday
  tuesday
  wednesday
  thursday
  friday
  saturday
}

Table course_instructors { // assigned courses to instructors
  course_instructor_id int PK [increment, unique, not null]
  priority int [not null, default: 1]
  
  // -------- FK --------
  assign_personal_detail_id int [not null]
  course_id int [not null]
} 

Records course_instructors (course_instructor_id, priority, assign_personal_detail_id, course_id) 
{
  1, 1, 1, 1 // mark rienier + hum 112
  2, 1, 2, 2
  3, 1, 3, 3
  4, 1, 4, 4
  5, 1, 5, 5
  6, 1, 6, 6
  7, 1, 7, 7  
  8, 1, 8, 8 // kate anne + p.e. 222
}

Table courses { // AKA subjects
  course_id int PK [increment, unique, not null]
  course_code varchar [not null, unique]
  course_description varchar [not null, unique]

  units int [not null] // doesn't affect scheduler algorithm

  total_course_duration_minutes int [not null]
  
  total_lecture_duration_minutes int [not null]      // (lab + lect) =< total_time
  minimum_lecture_duration_minutes int [not null]
  maximum_lecture_duration_minutes int [not null]

  total_laboratory_duration_minutes int [not null]   // (lab + lect) =< total_time
  minimum_laboratory_duration_minutes int [not null]
  maximum_laboratory_duration_minutes int [not null]

  checks {
    `total_lecture_duration_minutes + total_laboratory_duration_minutes <= total_course_duration_minutes` [name: 'not exceed total']
  }
} 

// 4800 = 80 hours
Records courses(course_id, course_code, course_description, units, total_course_duration_minutes, total_lecture_duration_minutes, minimum_lecture_duration_minutes, maximum_lecture_duration_minutes, total_laboratory_duration_minutes, minimum_laboratory_duration_minutes, maximum_laboratory_duration_minutes)
{
  // BSIT 2nd year 2nd Semester
  1, 'HUM 112', 'Art appreciation',3,                            4800, 4800, 60, 120, 0, 0, 0
  2, 'ITP 221', 'Advance Database Systems', 3,                   4800, 4800, 60, 120, 0, 0, 0
  3, 'ITP 222', 'Quantitative Methods', 3,                       4800, 4800, 60, 120, 0, 0, 0
  4, 'ITP 223', 'Networking 1', 3,                               4800, 4800, 60, 120, 0, 0, 0
  5, 'ITP 224', 'Integrative Programming and Technologies 1', 3, 4800, 4800, 60, 120, 0, 0, 0
  6, 'ITE 221', 'Web System and Technologies', 3,                4800, 4800, 60, 120, 0, 0, 0
  7, 'ITE 222', 'Embedded System', 3,                            4800, 4800, 60, 120, 0, 0, 0
  8, 'P.E. 222', 'Team Games and Sports', 2,                     4800, 4800, 60, 120, 0, 0, 0
  
  // BSIT 1st year 2nd Semester
  // ...
}

Table curriculums { // assigned courses to each Year & Semester
  curriculum_id int PK [increment, unique, not null]
  college_year_id int [not null]
  course_id int [not null]
}

Records curriculums(curriculum_id, college_year_id, course_id)
{
  // 2ndYear 2nd-Semester 3-Sections BSIT
  1, 1, 1  // HUM 112
  2, 1, 2 
  3, 1, 3
  4, 1, 4
  5, 1, 5
  6, 1, 6
  7, 1, 7
  8, 1, 8 // P.E. 222

  // ETC...
}


Table programs {
  program_id int PK [increment, unique, not null]
  program varchar(20)
}

Records programs(program_id, program) {
  1, 'BSIT'
  2, 'BSCPE'
  3, 'BSFI'
  4, 'BSEd'
  5, 'BSTM'
  6, 'BSCrim'
  7, 'BTVTEd'
  8, 'AB-ENGLISH'
  9, 'AB-PSYCHOLOGY'
}

Table college_year
{
  college_year_id int PK [increment, unique, not null]
  college_year int [not null]
  semester int [not null]
  total_sections int [not null] 

  // -------- FK --------
  program_id int [not null]

  checks {
    `semester >= 1 && semester <= 2 ` [name: 'semesters']
    `total_sections >= 1 && total_sections <= 4 ` [name: 'total_sections']
  }
}

Records college_year(college_year_id, college_year, semester, total_sections, program_id)
{
  1, 2, 2, 3, 1 // 2ndYear 2nd-Semester 3-Sections BSIT 
  2, 2, 2, 3, 1 
}





// courses requires a specific set of classrooms
Table classroom_courses { // assigned course to classrooms 
  classroom_course_id int PK [increment, unique, not null]
  priority int [not null, default: 1] 

  // -------- FK --------
  classroom_id int [not null]
  course_id int [not null]
} 

Records classroom_courses (classroom_course_id, priority, classroom_id, course_id)
{
  // IT Building
  2, 10, 3, 2 // Comlab 1 + Advance DB
  3, 10, 5, 2 // Comlab 2 + Advance DB
  4, 2, 2, 2 // (Lecture room) 201 + Advance DB  

}

Table classrooms {
  classroom_id int PK [increment, unique, not null]
  classroom_code varchar(20) [null]
  floor int [not null]
  is_laboratory bool [not null]
  is_available bool [not null, default: true]
  
  // -------- FK --------
  facility_id int [not null]
} 

Records classrooms(classroom_id, classroom_code, floor, is_laboratory, is_available, facility_id)
{
  // IT Building
  1, '105', 1, false, true, 1
  2, '201', 2, false, true, 1
  3, '202', 2, true, true, 1 // Com Lab 1
  4, '203', 2, false, true, 1
  5, '204', 2, true, true, 1 // Com Lab 2
  6, '205', 2, false, true, 1

  // Library
  8, null, 1, false, true, 4

  // ETC...
}

Table facilities {
  facility_id int PK [increment, unique, not null]
  facility_name varchar [not null, unique]
  total_rooms int [not null] // prevents adding classroom that exceeds floor limits
  total_floors int [not null] // prevents adding classroom that exceeds floor limits
  location int [null, unique] // data is based on campus map
} 

Records facilities(facility_id, facility_name, total_rooms, total_floors){
  1, 'IT building', 8, 2
  2, 'CAS', 20, 3
  3, 'CMB building', 20, 2
  4, 'Library', 4, 3
}


Table schedule_collections { // for comparison & evaluation 
  schedule_collection_id int PK [increment, unique, not null]
  title varchar(32) [not null, unique]
  description varchar(255) [null, unique]
  registrar_aprroved bool  [not null, default: false] 

  // -------- FK --------
  user_id int [not null] // created_by...
}

Records schedule_collections(schedule_collection_id, title, description, registrar_aprroved, user_id)
{
  1, 'developer test collection', null, true, 2
  2, 'algorithm test collection', null, true, 2
}

Table schedules {
  schedule_id int PK [increment, unique, not null]
  start_time time [not null] 
  end_time time [not null]
  day day [not null]

  // -------- FK --------
  course_id int [not null]
  classroom_id int [not null]
  instructor_id int [not null]
  schedule_collection_id int [not null]
}

// ----------------- SECURITY ----------------- //

Table user_sessions {
  user_session_id bigint [pk, increment]

  session_token varchar(255) [not null, unique]
  user_id int [not null]
  ip_address varchar(45) [not null]
  user_agent text [not null]
  last_activity timestamp [not null]
  expires_at timestamp [not null]

  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  logged_out bool [not null, default: false]
  Indexes {
    (user_id)
    (expires_at)
  }
}



Table loggin_attempts {
  loggin_attempt_id int PK [increment, unique, not null]
  ip_address varchar [not null]
  successful bool [not null]
  
  created_at datetime [not null]
  updated_at datetime [not null] 
  deleted_at datetime 
}


Enum audit_status {
  success
  failed
  denied
}

Enum actor_type_enum {
  user
  admin
  system
  api
}


Table audit_trail {
  audit_trail_id bigint [increment, unique, not null]
  event_time datetime [not null]
  created_at timestamp [default: `CURRENT_TIMESTAMP`]

  user_id int [not null]
  actor_type actor_type_enum [not null, default: 'user']
  action varchar(50) [not null]
  entity_type varchar(100) [not null]
  entity_id varchar(100) [not null]

  old_data json 
  new_data json

  ip_address varchar(45)
  user_agent varchar(255)
  request_id varchar(100)
  status audit_status [not null, default: 'success']
  remarks varchar(255)

  indexes {
    (user_id)
    (entity_type, entity_id)
    (event_time)
    (action)
    (request_id)
  }
}

Enum notification_type {
  system
  schedule
  workload
  account
  reminder
  request
}

Table notifications {
  notification_id int [pk, increment]

  user_id int [not null, ref: > users.user_id]

  title varchar(150) [not null]
  message text [not null]

  type notification_type [not null]

  reference_type varchar(50)
  reference_id int

  is_read boolean [not null, default: false]
  read_at datetime

  created_at datetime [not null, default: `CURRENT_TIMESTAMP`]
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
  deleted_at datetime

  indexes {
    user_id
    is_read
    type
    created_at
    (user_id, is_read)
  }
}






Ref: "courses"."course_id" < "course_instructors"."course_id"


Ref: "facilities"."facility_id" < "classrooms"."facility_id"



Ref: "classrooms"."classroom_id" < "classroom_courses"."classroom_id"



Ref: "user_sessions"."user_id" > "users"."user_id"

Ref: "roles"."role_id" < "users"."role_id"





Ref: "schedule_collections"."schedule_collection_id" < "schedules"."schedule_collection_id"






Ref: "college_year"."college_year_id" < "curriculums"."college_year_id"

Ref: "courses"."course_id" < "curriculums"."course_id"



Ref: "programs"."program_id" < "college_year"."program_id"

Ref: "courses"."course_id" < "classroom_courses"."course_id"



Ref: "instructors"."instructor_id" < "instructor_time_blocks"."instructor_id"

Ref: "person_details"."person_detail_id" < "assign_personal_details"."person_detail_id"

Ref: "instructors"."instructor_id" < "assign_personal_details"."instructor_id"

Ref: "users"."user_id" < "assign_personal_details"."user_id"



Ref: "courses"."course_id" < "schedules"."course_id"

Ref: "assign_personal_details"."assign_personal_detail_id" < "course_instructors"."assign_personal_detail_id"

Ref: "instructors"."instructor_id" < "schedules"."instructor_id"

Ref: "classrooms"."classroom_id" < "schedules"."classroom_id"