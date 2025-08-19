import { updateChart, updateParametersDefault } from './main.js';
import * as Pokemon from './pokemon.js';
import * as Main from './main.js';

const pInput = document.getElementById('pInput');
const themeMenu = document.getElementById('themeMenu');
const themeButton = document.getElementById('themeButton');
const pageTitle = document.getElementById('pageTitle');
const pageDescription = document.getElementById('pageDescription');

const themeList = ["None", "Pokemon"];
let currentTheme = "None";
let updateParameters; // Implemented separately by each theme


function toTitleCase(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join(' '); 
}

// Returns control element ID for given theme
function getControlID(theme) {
    // ToDo: automate by manipulating string
    switch (theme) {
        case 'None': return 'default-controls';
        case 'Pokemon': return 'pokemon-controls';
    }
}

// Returns control element for given theme
function getControlElement(theme) {
    let id = getControlID(theme);
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
            currentTheme = theme;
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
    updatePageContent(theme);
    updateParameters();
}

function updatePageContent(theme) {
    // ToDo: automate with string manipulation
    let pageContent;
    switch (theme) {
        case 'None':
            pageContent = Main.pageContent;
            console.log('none content');
            break;
        case 'Pokemon':
            pageContent = Pokemon.pageContent;
            console.log('pokemon content');
            break;
        default:
            break;
    }
    pageTitle.textContent = pageContent.title;
    pageDescription.textContent = pageContent.description;
}


//------------------------ Handle Events -------------------------------

applyQueryParams();
updateTheme(currentTheme);

//pInput.addEventListener('input', updateParameters);
pInput.addEventListener('input', (e) => {
    updateParameters();
    updateChart();
});

// Open dropdown themeMenu on click
themeButton.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent window.onclick from immediately closing it
    themeMenu.style.display = themeMenu.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown themeMenu on click outside
window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-button')) {
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
        updateChart();
        themeMenu.style.display = 'none'; // close dropdown
    });
});