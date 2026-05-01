import { safeGetLocalStorage } from '../utils/localStorage.js'
import { routes } from '../routes.js'

const user_role_ids = {
    admin: 1,
    program_chair: 2
}


export const AuthenticateAuthorize = () => {

    const session_user_role_id = safeGetLocalStorage('user_role_id')
    
    if (session_user_role_id === user_role_ids.admin)
    {
        window.location.href = routes.admin.dashboard
        console.log("redirected to admin pages")

    }
    else if (session_user_role_id === user_role_ids.program_chair)
    {
        window.location.href = routes.program_chair.dashboard
        console.log("redirected to program_chair pages")
    }
    else
    {
        window.location.href = routes.public.login
        console.log("unauthorized & redirected to login")
    }
}