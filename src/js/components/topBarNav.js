import { routes } from '../routes.js'
import { baseUrl } from '../configs'

export const topBarNav = (htmlRouteLinks) => {
    const topBarNav = 
    `
        <nav class="flex flex-row gap-1.5 p-2 w-screen bg-green-800 ">
            <a href="${routes.public.home}" class="hover:scale-112 duration-600 ease-in-out">
                <img alt=logo src='${baseUrl.frontend}/src/assets/calendar-clock-svgrepo-com.svg' class="size-10"/>
            </a>

            <div class="grow"></div>

            
            <section class="hidden md:flex flex-row gap-1.5">
                ${htmlRouteLinks}   
            </section>
            <button class="flex justify-center items-center w-10 md:hidden hover:border bg-green-900 rounded-md duration-150 ease-in-out cursor-pointer">
                <i class="bi bi-list cursor-pointer"></i>
            </button>
        </nav>
    `

    return topBarNav;
}