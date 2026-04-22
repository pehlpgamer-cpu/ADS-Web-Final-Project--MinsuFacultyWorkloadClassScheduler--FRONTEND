
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
    },
    
    admin: {
        admin_dashboard: url('/admin/admin_dashboard'),
        manage_users: url('/admin/manage_users'),
        manage_facilities: url('/admin/manage_facilities'),
        manage_classrooms: url('/admin/manage_classrooms'),
        manage_instructors: url('admin/manage_instructors'),
        manage_courses: url('/admin/manage_courses')
    },
    program_chair: {
        program_chair_dashboard: url('/program_chair/program_chair_dashboard'),
        scheduler: url('program_chair/scheduler'),
    },
    authenticated: {
        account: url('authenticated/account'),
        settings: url('authenticated/settings'),
    }
}


// ------- ROUTE COLLECTIONS --------------------------------------------------------------------------------------------------------------------

export const routeCollections = {
    
} 



