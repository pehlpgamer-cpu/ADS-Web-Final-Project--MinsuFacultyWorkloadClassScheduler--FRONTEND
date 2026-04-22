
export const navButton = (iconStyle, label, link, addStyle = '', highlighted = false) =>
{
    let style = '';
    const currentDir = window.location.href;
    

    if (link === currentDir) style = "text-white bg-black font-bold"
    else style = "bg-green-900"

    const navButton = 
    `
        <a type="button" class="${addStyle} ${style} flex flex-row items-center gap-1.5 p-1.5 rounded-md hover:scale-105 duration-100 ease-in-out cursor-pointer" href="${link}">
            <i class="${iconStyle} cursor-pointer"></i>
            <label class="cursor-pointer">
                ${label}
            </label>
        </a>
    `

    return navButton;
}