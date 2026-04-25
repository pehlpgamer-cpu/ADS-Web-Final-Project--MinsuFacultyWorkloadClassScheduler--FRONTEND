export const sideBarNav = (header, htmlRouteLinks, footer) =>
{
    const sideBarNav = 
    `
        <aside class="flex flex-col h-full">
            <header class="">
                ${header}
            </header>
            
            <main class="flex flex-col gap-1.5">
                ${htmlRouteLinks}
            </main>

            <div class="grow"></div>
            <footer class="flex flex-col">
                ${footer}
                <button id="logoutBtn" class="p-2 bg-green-700 rounded-md my-1">
                    <i class="bi bi-box-arrow-left"></i>    
                    <label>Logout</label>
                </button>
            </footer>
        </aside>
    `

    return sideBarNav;
}