import { baseUrl } from '../configs';

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

export const logout = async (session_token) => {
    return fetch(baseUrl.backend + '/v1/auth/login.php', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-session-token": session_token
        },
        body: JSON.stringify(session_token)
    })
    .then(res => res.json())
    .then(data => data)
    .catch(error => console.error('Login error:', error));
}


export const register = async (input_data) => {
    return fetch(baseUrl.backend + '/v1/auth/register.php', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input_data)
    })
    .then(res => res.json())
    .then(data => data)
    .catch(error => console.error('Login error:', error));
}

