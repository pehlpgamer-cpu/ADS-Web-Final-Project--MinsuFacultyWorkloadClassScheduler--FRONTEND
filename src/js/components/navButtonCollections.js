import { routes } from '../routes.js'
import { navButton } from './navButton.js'

export const publicNavButtons = 
    navButton('bi bi-house', 'Home', routes.public.home) +
    navButton('bi bi-box-arrow-in-left', 'Login', routes.public.login) + 
    navButton('bi bi-vector-pen', 'Register', routes.public.register)


export const adminNavButtons = 
    navButton('bi bi-columns-gap', 'Dashboard', routes.admin.dashboard) +
    navButton('bi bi-file-earmark-text-fill', 'Audit Trail', routes.admin.audit_trail) +
    navButton('bi bi-database-fill', 'Backups', routes.admin) +
    navButton('bi bi-people-fill', 'Users', routes.admin.users) + 
    navButton('bi bi-fingerprint', 'Sessions', routes.admin.sessions) +
    navButton('bi bi-person-vcard-fill', 'Roles', routes.admin.roles) +
    navButton('bi bi-mortarboard-fill', 'Instructors', routes.admin) +
    navButton('bi bi-buildings-fill', 'Facilities', routes.admin.facilities) +
    navButton('bi bi-door-open-fill', 'Classrooms', routes.admin.classrooms) +
    navButton('bi bi-bell-fill', 'Notifications', routes.authenticated.notifications) +
    navButton('bi bi-gear-fill', 'Settings', routes.authenticated.settings) +
    navButton('bi bi-person-circle', 'Account', routes.authenticated.account)


export const programChairNavButtons = 
    navButton('bi bi-columns-gap', 'Dashboard', routes.program_chair.dashboard) +
    navButton('bi bi-calendar3', 'Schedules', routes.program_chair.scheduler) +
    navButton('bi bi-bell-fill', 'Notifications', routes.authenticated.notifications) +
    navButton('bi bi-gear-fill', 'Settings', routes.authenticated.settings) +
    navButton('bi bi-person-circle', 'Account', routes.authenticated.account)