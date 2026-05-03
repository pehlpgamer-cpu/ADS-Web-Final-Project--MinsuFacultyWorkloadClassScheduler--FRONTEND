import { safeGetLocalStorage } from '../utils/localStorage.js'
import { routes } from '../routes.js'

const user_role_ids = {
    admin: 1,
    program_chair: 2
}


export const authenticateAuthorize = () => {

    const session_user_role_id = safeGetLocalStorage('user_role_id')
    const session_token = safeGetLocalStorage('session_token')
    const page = document.querySelector('meta[name="page"]')?.content;

    console.log("page: " + page)
    console.log("role: " + session_user_role_id)
    console.log("session token: " + session_token)

    // 3x equals doesn't work
   

    if (session_user_role_id == user_role_ids.admin && page === 'program_chair' )
    {
        window.location.href = routes.admin.dashboard
        console.log("redirected to admin pages")

    }
    else if (session_user_role_id == user_role_ids.program_chair  && page === 'admin' )
    {
        window.location.href = routes.program_chair.dashboard
        console.log("redirected to program_chair pages")
    }
    else if (session_user_role_id === null || session_token === null)
    {
        window.location.href = routes.public.login
        console.log("unauthorized & redirected to login")
    }
}