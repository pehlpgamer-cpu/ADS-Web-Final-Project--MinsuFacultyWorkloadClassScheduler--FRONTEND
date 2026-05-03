import { baseUrl, user_role_ids } from '../configs';
import { safeSetLocalStorage, safeGetLocalStorage } from '../utils/localStorage';

export const login = async (input_data) => {
    const res = await fetch(baseUrl.backend + '/v1/auth/login.php', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
        body: JSON.stringify(input_data)
    });

    return await res.json();
};


export const logout = async () => {
    
    const session_token = safeGetLocalStorage("session_token");

    const res = await fetch(baseUrl.backend + "/v1/auth/logout.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-session-token": session_token ?? ""
        }
    });

    return await res.json();
    
};

export const register = async (input_data) => {
    
    const res = await fetch(baseUrl.backend + "/v1/auth/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input_data)
    });

    return await res.json();
};