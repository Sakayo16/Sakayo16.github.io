// ================================
// Opportunités Afrique – app.js
// Recherche + Tri dynamique + UX
// ================================

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const countryFilter = document.getElementById("countryFilter");
  const container = document.getElementById("listFeed");

  let dataGlobal = [];

  // Fonction d'affichage dynamique
  function renderList(list) {
    container.innerHTML = "";

    if (!list.length) {
      container.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
          <i class="bi bi-emoji-frown fs-2"></i>
          <p class="mt-2">Aucune opportunité trouvée pour votre recherche.</p>
        </div>`;
      return;
    }

    list.forEach(item => {
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4 fade-in";
      card.innerHTML = `
        <div class="card h-100 shadow-sm border-0 opportunity-card">
          <img src="${item.image}" alt="${item.title}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="text-muted small mb-1">${item.organization} – ${item.country}</p>
            <p class="card-text small">${item.description_short}</p>
          </div>
          <div class="card-footer bg-transparent border-0 text-center">
            <a href="${item.apply_url}" target="_blank" class="btn btn-outline-primary btn-sm rounded-pill">Voir les détails</a>
          </div>
        </div>`;
      container.appendChild(card);
    });
  }

  // Tri des opportunités : les plus proches deadlines d'abord
  function sortByDeadline(list) {
    const now = new Date();
    return list.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline) : null;
      const dateB = b.deadline ? new Date(b.deadline) : null;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA - dateB;
    });
  }

  // Recherche / Filtrage combiné
  function filterList() {
    const query = searchInput.value.toLowerCase().trim();
    const type = typeFilter.value;
    const country = countryFilter.value.toLowerCase().trim();

    const filtered = dataGlobal.filter(item => {
      const matchQuery =
        item.title.toLowerCase().includes(query) ||
        item.organization.toLowerCase().includes(query) ||
        item.description_short.toLowerCase().includes(query);

      const matchType = !type || item.type === type;
      const matchCountry = !country || item.country.toLowerCase().includes(country);

      return matchQuery && matchType && matchCountry;
    });

    renderList(sortByDeadline(filtered));
  }

  // Écouteurs de recherche et filtres
  searchInput?.addEventListener("input", filterList);
  typeFilter?.addEventListener("change", filterList);
  countryFilter?.addEventListener("input", filterList);

  // Chargement des données
  fetch("data/sample.json")
    .then(r => r.json())
    .then(data => {
      dataGlobal = sortByDeadline(data);
      renderList(dataGlobal);
    })
    .catch(err => {
      container.innerHTML = `<p class="text-danger text-center py-5">Erreur de chargement des opportunités.</p>`;
      console.error("Erreur JSON :", err);
    });
});

// ✅ Animation douce
const style = document.createElement("style");
style.textContent = `
.fade-in { animation: fadeIn 0.8s ease-in; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);
