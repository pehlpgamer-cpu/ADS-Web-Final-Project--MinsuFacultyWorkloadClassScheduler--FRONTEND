export const sideBarNav = (header, routeLinks, footer) =>
{
    const sideBarNav = 
    `
        <aside class="hidden w-22 md:flex">
            <header>
                ${header}
            </header>
            
            <main>
                ${routeLinks}
            </main>
            
            <footer>
                ${footer}
            </footer>
        </aside>
    `

    return sideBarNav;
}