

const basePageUrl = window.location.origin + '/src/pages/' 

const url = (link) => {
    return `${basePageUrl}${link}.html`
}

export const addLink = (htmlELement, route) => {
    htmlELement.setAttribute("href", route)
}

export const routes = {
    public: {
        home: url('index'),
        login: url('public/login'),
        register: url('public/register'),
        about: url('public/about'),
        contacts: url('public/contacts')
    },
    admin: {
        audit_trail: url('admin/audit_trail'),
        backups: url('admin/backups'),
        classrooms: url('admin/classrooms'),
        courses: url('admin/courses'),
        dashboard: url('admin/dashboard'),
        facilities: url('admin/facilities'),
        instructors: url('admin/instructors'),
        roles: url('admin/roles'),
        sessions: url('admin/sessions'),
        users: url('admin/users'),

        schedules: url('admin/schedules'), // ???
    },
    program_chair: {
        dashboard: url('program_chair/dashboard'),
        scheduler: url('program_chair/scheduler'),
    },
    authenticated: {
        notifications: url('authenticated/notifications'),
        account: url('authenticated/account'),
        settings: url('authenticated/settings'),
    }
}





