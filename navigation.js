import { updateChart, updateParametersDefault } from './main.js';
import * as Pokemon from './pokemon.js';

const themeMenu = document.getElementById('themeMenu');
const themeButton = document.getElementById('themeButton');

const themeList = ["None", "Pokemon"];
let currentTheme = "None";
let updateParameters; // Implemented separately by each theme


function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
    .join(' '); 
}

// Returns control element ID for given theme
function getControlID(theme) {
    switch (theme) {
        case 'None': return 'default-controls';
        case 'Pokemon': return 'pokemon-controls';
    }
}

// Returns control element for given theme
function getControlElement(theme) {
    id = getControlID(theme);
    return document.getElementById(id);
}


// Returns the update function for given theme
function getUpdateFunction(theme) {
    switch (theme) {
        case 'None': return updateParametersDefault;
        case 'Pokemon': return Pokemon.updateParameters;
    } 
}

// Handle URL parameters e.g. /?theme=none
function applyQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const theme = toTitleCase(params.get("theme"));
    if (theme) {
        // Set theme if it exists
        if (themeList.includes(theme)) {
            updateTheme(theme);
        }
    }
}

// Update theme based on themeSelect and set updateParameters
export function updateTheme(theme) {
    console.log(`updateTheme(${theme})`);
    currentTheme = theme;
    // Get controls id for selected theme
    let id = getControlID(theme);
    // Hide other controls
    const controls = document.querySelectorAll(".controls");
    controls.forEach(panel => {
        if (panel.id === id) {
            panel.style.display = "block";
        } else {
            panel.style.display = "none";
        }
    });

    // Set parameter update function
    updateParameters = getUpdateFunction(theme);

    // Update chart
    updateParameters();
}


//------------------------ Handle Events -------------------------------

applyQueryParams();
updateTheme(currentTheme);

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

// Handle clicking an item
themeMenu.querySelectorAll('a').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); // optional if you don't want the page to jump
        const theme = item.dataset.value; // the value of the item
        console.log('Selected item:', theme);
        
        updateTheme(theme);
        themeMenu.style.display = 'none'; // close dropdown
    });
});