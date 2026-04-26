export const pagination = (
    currentPage, 
    itemsPerPage, 
    totalPages
) => {
    
    let pageBtns = ''


    
    const pagination = 
    `
        <section class="flex gap-1">

            <!-- Prev & Next -->
            <div>
                <button class="rounded-l-lg p-1.5">
                    <i class="bi bi-arrow-left"></i>
                    <label>Prev</label>
                </button>
                <button class="rounded-r-lg p-1.5">
                    <i class="bi bi-arrow-right"></i>
                    <label>Next</label>
                </button>
            </div>

            <!-- Pages -->
            <div>

            </div>
            <!-- Jump to page -->
            <div>
            
            </div>
        </section>
    `

    return pagination;
}  

const pageBtn = (pageNumber, currentPage) => {
    const btn = 
    `
    
    `

    return btn;
}