// assets/js/app.js

document.addEventListener("DOMContentLoaded", function () {
  const listFeed = document.getElementById("listFeed");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const countryFilter = document.getElementById("countryFilter");

  // ✅ Fonction pour afficher les opportunités
  function displayOpportunities(data) {
    listFeed.innerHTML = ""; // nettoie
    if (!data || data.length === 0) {
      listFeed.innerHTML = `<p class="text-center text-muted">Aucune opportunité trouvée.</p>`;
      return;
    }

    data.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0">
          <img src="${item.image}" class="card-img-top" alt="${item.title}" style="height:200px; object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text text-muted small mb-2">${item.organization} – ${item.country}</p>
            <p class="card-text small">${item.description_short}</p>
            <a href="${item.apply_url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm mt-auto rounded-pill">
              Postuler <i class="bi bi-box-arrow-up-right ms-1"></i>
            </a>
          </div>
        </div>
      `;
      listFeed.appendChild(col);
    });
  }

  // ✅ Chargement du JSON
  fetch("data/sample.json")
    .then((res) => res.json())
    .then((data) => {
      let allData = data;

      // Première affichage
      displayOpportunities(allData);

      // ✅ Filtres et recherche dynamique
      function applyFilters() {
        const search = searchInput.value.toLowerCase();
        const type = typeFilter.value.toLowerCase();
        const country = countryFilter.value.toLowerCase();

        const filtered = allData.filter((item) => {
          const matchSearch =
            item.title.toLowerCase().includes(search) ||
            item.organization.toLowerCase().includes(search);
          const matchType = !type || item.type.toLowerCase().includes(type);
          const matchCountry = !country || item.country.toLowerCase().includes(country);
          return matchSearch && matchType && matchCountry;
        });

        displayOpportunities(filtered);
      }

      searchInput.addEventListener("input", applyFilters);
      typeFilter.addEventListener("change", applyFilters);
      countryFilter.addEventListener("input", applyFilters);
    })
    .catch((err) => {
      console.error("Erreur de chargement du JSON :", err);
      listFeed.innerHTML = `<p class="text-danger text-center">Erreur de chargement des opportunités.</p>`;
    });
});
