document.addEventListener("DOMContentLoaded", function () {
  const listFeed = document.getElementById("listFeed");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const countryFilter = document.getElementById("countryFilter");

  function displayOpportunities(data) {
    listFeed.innerHTML = "";

    if (!data || data.length === 0) {
      listFeed.innerHTML = `<p class="text-center text-muted">Aucune opportunité trouvée.</p>`;
      return;
    }

    data.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4";

      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0">
          <img src="${item.image}" class="card-img-top" alt="${item.title}"
               style="height:200px; object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text text-muted small mb-2">
              ${item.organization} – ${item.country}
            </p>
            <p class="card-text small">${item.description_short}</p>
            <a href="opportunite.html?id=${encodeURIComponent(item.title)}"
               class="btn btn-outline-primary btn-sm mt-auto rounded-pill">
              Détails <i class="bi bi-chevron-right ms-1"></i>
            </a>
          </div>
        </div>
      `;

      listFeed.appendChild(col);
    });
  }

  listFeed.innerHTML = `
    <div class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Chargement des opportunités...</p>
    </div>
  `;

  // ⚠️ Mets ici ton vrai lien GitHub Pages
  const jsonURL = "https://sakayo16.github.io/data/sample.json"; 
  // 👉 si ton projet s'appelle "opportunites-afrique", fais :
  // const jsonURL = "https://sakayo16.github.io/opportunites-afrique/data/sample.json";

  fetch(jsonURL, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Erreur HTTP " + res.status);
      return res.json();
    })
    .then((data) => {
      displayOpportunities(data);

      function applyFilters() {
        const search = (searchInput?.value || "").toLowerCase();
        const type = (typeFilter?.value || "").toLowerCase();
        const country = (countryFilter?.value || "").toLowerCase();

        const filtered = data.filter((item) => {
          const matchSearch =
            item.title.toLowerCase().includes(search) ||
            item.organization.toLowerCase().includes(search) ||
            item.description_short.toLowerCase().includes(search);
          const matchType = !type || item.type.toLowerCase().includes(type);
          const matchCountry =
            !country || item.country.toLowerCase().includes(country);
          return matchSearch && matchType && matchCountry;
        });

        displayOpportunities(filtered);
      }

      searchInput?.addEventListener("input", applyFilters);
      typeFilter?.addEventListener("change", applyFilters);
      countryFilter?.addEventListener("input", applyFilters);
    })
    .catch((err) => {
      console.error("Erreur lors du chargement du JSON :", err);
      listFeed.innerHTML = `<div class="text-center text-danger py-5">
        <i class="bi bi-exclamation-triangle-fill"></i><br>
        Erreur de chargement des opportunités. Veuillez réessayer plus tard.
      </div>`;
    });
});
