//import { updateTheme } from './main.js';

const themeMenu = document.getElementById('themeMenu');
const themeButton = document.getElementById('themeButton');


// Open dropdown themeMenu on click
themeButton.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent window.onclick from immediately closing it
    themeMenu.style.display = themeMenu.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown themeMenu on click outside
window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-themeButton')) {
        themeMenu.style.display = 'none';
    }
});

// // Handle clicking an item
// menu.querySelectorAll('a').forEach(item => {
//     item.addEventListener('click', (e) => {
//         e.preventDefault(); // optional if you don't want the page to jump
//         const theme = item.dataset.value; // the value of the item
//         console.log('Selected item:', theme);
        
//         updateTheme(theme)
//         menu.style.display = 'none'; // close dropdown
//     });
// });