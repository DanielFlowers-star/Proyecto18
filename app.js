const languageSelect = document.getElementById("languageSelect");
const stateBox = document.getElementById("stateBox");
const refreshBtn = document.getElementById("refreshBtn");

// Evento cambio de idioma
languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    if (lang) fetchRandomRepo(lang);
    else showEmptyState();
});

// Botón de refrescar
refreshBtn.addEventListener("click", () => {
    fetchRandomRepo(languageSelect.value);
});

// Estado inicial vacío
function showEmptyState() {
    stateBox.className = "state-box";
    stateBox.innerHTML = "Please select a language";
    refreshBtn.classList.add("hidden");
}

// Estado de carga
function showLoading() {
    stateBox.className = "state-box";
    stateBox.innerHTML = "Loading, please wait...";
    refreshBtn.classList.add("hidden");
}

// Estado de error
function showError() {
    stateBox.className = "state-box error";
    stateBox.innerHTML = `
        Error fetching repositories <br><br>
        <button onclick="fetchRandomRepo(languageSelect.value)">Click to retry</button>
    `;
    refreshBtn.classList.add("hidden");
}

// Mostrar repositorio
function renderRepository(repo) {
    stateBox.className = "state-box repo-card";

    stateBox.innerHTML = `
        <div class="repo-title">${repo.name}</div>
        <p>${repo.description ?? "No description available"}</p>

        <div class="repo-stars">
            ⭐ Stars: ${repo.stargazers_count}
            🍴 Forks: ${repo.forks_count}
            🐞 Issues: ${repo.open_issues}
        </div>
    `;

    refreshBtn.classList.remove("hidden");
}

// Llamado a la API de GitHub
async function fetchRandomRepo(language) {
    showLoading();

    try {
        const url = `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=50`;

        const response = await fetch(url);

        if (!response.ok) throw new Error("API error");

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            showError();
            return;
        }

        // Repositorio aleatorio
        const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];

        renderRepository(randomRepo);

    } catch (error) {
        showError();
    }
}

// Mostrar estado vacío al inicio
showEmptyState();
