import { routes } from '../routes.js'
import { navButton } from './navButton.js'

export const publicNavButtons = 
    navButton('bi bi-house', 'home', routes.public.home) +
    navButton('bi bi-box-arrow-in-left', 'login', routes.public.login) + 
    navButton('bi bi-vector-pen', 'register', routes.public.register)


export const adminNavButtons = ''

export const programChairNavButtons = ''