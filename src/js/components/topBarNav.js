export const topBarNav = (routeLinks, hamburgerNavModal) => {
    const topBarNav = 
    `
        <nav class="flex flex-row gap-1.5 p-2">
            <button flex p-1.5 md:hidden>
                <i class="bi bi-list"></i>
            </button>
            <section hidden md:flex gap-1.5>
                ${routeLinks}   
            </section>
        </nav>
    `

    return topBarNav;
}