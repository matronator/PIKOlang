export function initDropdowns() {
    const dropdowns = document.querySelectorAll('[data-dropdown]') as NodeListOf<HTMLElement>;
    dropdowns.forEach(dropdown => {
        const dropdownMenu = document.querySelector(`[data-dropdown-content=${dropdown.dataset.dropdown}]`) as HTMLElement;
        dropdown.addEventListener('click', () => {
            dropdownMenu.classList.toggle('hidden');
        });
        const menuItems = dropdownMenu.querySelectorAll('.dropdown-item');
        menuItems.forEach(menuItem => {
            menuItem.addEventListener('click', () => {
                dropdownMenu.classList.add('hidden');
            });
        });
    });

    document.body.addEventListener('click', (event) => {
        if (!(event.target as HTMLElement).dataset.dropdown) {
            dropdowns.forEach(dropdown => {
                const dropdownMenu = document.querySelector(`[data-dropdown-content=${dropdown.dataset.dropdown}]`) as HTMLElement;
                dropdownMenu.classList.add('hidden');
            });
        }
    });
}
