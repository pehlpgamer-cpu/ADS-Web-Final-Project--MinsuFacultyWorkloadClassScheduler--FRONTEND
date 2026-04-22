
import { baseUrl } from "../js/configs.js"
const basePageUrl = window.location.origin + '/src/pages' 

const url = (link) => {
    return `${basePageUrl}${link}.html`
}

export const addLink = (htmlELement, route) => {
    htmlELement.setAttribute("href", route)
}

export const routes = {
    public: {
        home: url('/index'),
        login: url('/public/login'),
        register: url('/public/register'),
        about: '',
        contacts: ''
    },
    
    admin: {
        dashboard: url('/admin/dashboard'),
        audit_trail: url('/admin/audit_trail'),
        users: url('/admin/manage_users'),
        facilities: url('/admin/facilities'),
        classrooms: url('/admin/classrooms'),
        instructors: url('admin/instructors'),
        courses: url('/admin/courses')
    },
    program_chair: {
        dashboard: url('/program_chair/dashboard'),
        scheduler: url('/program_chair/scheduler'),
    },
    authenticated: {
        account: url('authenticated/account'),
        settings: url('authenticated/settings'),
    }
}


// ------- ROUTE COLLECTIONS --------------------------------------------------------------------------------------------------------------------

export const routeCollections = {
    // ????
} 



