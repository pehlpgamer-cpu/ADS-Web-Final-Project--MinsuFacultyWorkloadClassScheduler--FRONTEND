import { trim } from "zod";

export const navButton = (icon, label, link, addStyle, highlighted = false) =>
{
    let highlightStyle;

    if (highlighted === true) highlightStyle = "text-white bg-black font-bold"

    const navButton = 
    `
        <a type="button" class="flex ${addStyle} ${highlightStyle}" href="${link}">
            <span>
                ${icon}
            </span>
            <label>
                ${label}
            </label>
        </a>
    `

    return navButton;
}