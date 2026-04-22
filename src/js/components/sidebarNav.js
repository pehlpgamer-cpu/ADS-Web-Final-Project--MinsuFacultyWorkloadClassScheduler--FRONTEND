export const sideBarNav = (header, htmlRouteLinks, footer) =>
{
    const sideBarNav = 
    `
        <aside class="w-12 md:w-38 h-screen fixed justify-center md:flex p-2 bg-green-800">
            <header>
                ${header}
            </header>
            
            <main class="grow flex flex-col gap-1.5">
                ${htmlRouteLinks}
            </main>
            
            <footer>
                ${footer}
            </footer>
        </aside>
    `

    return sideBarNav;
}