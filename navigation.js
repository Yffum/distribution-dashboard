document.addEventListener('DOMContentLoaded', () => {
    const themeMenu = document.getElementById('themeMenu');
    const themeButton = document.getElementById('themeButton');

    const themeList = ["None", "Pokemon"];
    let currentTheme = "None";

    function updateTheme(theme) {
        currentTheme = theme;
        const controls = document.querySelectorAll(".controls");
        controls.forEach(panel => {
            panel.style.display = panel.id === (theme === "None" ? "default-controls" : "pokemon-controls") ? 'block' : 'none';
        });
    }

    themeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.style.display = themeMenu.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropdown-button')) {
            themeMenu.style.display = 'none';
        }
    });

    themeMenu.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            updateTheme(item.dataset.value);
            themeMenu.style.display = 'none';
        });
    });

    updateTheme(currentTheme);
});
