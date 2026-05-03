import { routes } from '../routes.js'
import { safeSetLocalStorage, safeGetLocalStorage } from './localStorage.js';
import { logout } from '../api/auth.js'

export const handleLogout = async () => {
    const response = await logout();
    safeSetLocalStorage('session_token', null)
    safeSetLocalStorage('user_role_id', null)
    console.log('x-session-token: ' + safeGetLocalStorage('session_token'))
    window.location.href = routes.public.login
    console.log("logged out & redirected to login")
}