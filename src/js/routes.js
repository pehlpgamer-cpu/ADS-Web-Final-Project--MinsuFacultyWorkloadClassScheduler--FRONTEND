

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
        dashboard: url('admin/dashboard'),
        audit_trail: url('admin/audit_trail'),
        backups: url('admin/backups'),
        users: url('admin/users'),
        sessions: url('admin/sessions'),
        instructors: url('admin/instructors'),
        academic_ranks: url('admin/academic_ranks'),
        roles: url('admin/roles'),
        facilities: url('admin/facilities'),
        classrooms: url('admin/classrooms'),
        courses: url('admin/courses'),
        schedules: url('admin/schedules')
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





