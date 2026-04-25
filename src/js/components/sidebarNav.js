
export const sideBarNav = (header, htmlRouteLinks, footer) =>
{
    const btnStyle = "p-2 bg-green-700 rounded-md text-white hover:scale-105 duration-100  hover:"

    const sideBarNav = 
    `
        <aside class="flex flex-col h-full">
            <header class="flex flex-col">
                ${collapseSideBarButton()}
                
            </header>
            
            <main class="flex flex-col gap-1.5">
                ${htmlRouteLinks}
            </main>

            <div class="grow"></div>
            <footer class="flex flex-col">
                ${footer}
                <button id="logoutBtn" class="${btnStyle}">
                    <i class="bi bi-box-arrow-left"></i>    
                    <label>Logout</label>
                </button>
            </footer>
        </aside>
    `

    return sideBarNav;
}


const collapseSideBarButton = () => {
    let btnIcon = '';
    const collapseIcon = `bi bi-layout-sidebar-inset`
    const expandIcon = `bi bi-layout-sidebar-inset-reverse`
    
    if (true) btnIcon = collapseIcon;
    else btnIcon = expandIcon;
    
    
    const btn = 
    `
        <button onClick="() => { 
            
        }"
            class="flex self-end pr-1 hover:scale-105 duration-100 ease-in-out rounded-md mb-1">
            
            <i class="${btnIcon}"></i>
        </button>
    `

    return btn;
}

