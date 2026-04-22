import { baseUrl } from "../js/configs.js"
const basePageUrl = baseUrl.frontend + '/src/pages' 

const url = (link) => {
    return `${basePageUrl}${link}.html`
}

export const addLink = (htmlELement, route) => {
    htmlELement.setAttribute("href", route)
}

export const routes = {
    public: {
        login: url('/auth/login'),
        register: url('/auth/register'),
    },
    
    admin: {
        manage_users: url('/admin/manage_users')
    },
}


