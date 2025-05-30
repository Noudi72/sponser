
const products = [
  {
    name: "Recovery Shake",
    price: 45.00,
    desc: "Regenerationsgetränk mit Protein und Kohlenhydraten (Dose 1200g)",
    img: "https://www.sponser.ch/media/image/7f/91/90/Recovery-Drink-1020x1020.png",
    flavors: ["Vanille", "Schokolade", "Neutral"]
  },
  {
    name: "Protein Bar",
    price: 2.50,
    desc: "Proteinriegel mit 27% Eiweiss, 60g",
    img: "https://www.sponser.ch/media/image/4b/e6/b3/protein-bar-vanilla-1020x1020.png",
    flavors: ["Vanille", "Schokolade", "Cranberry"]
  }
];

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";
  products.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    let flavorHTML = p.flavors.map(f => `
      <div class="variant-line">
        <label>${f}:</label>
        <input type="number" min="0" name="product_${i}_${f}" value="0" onchange="updateCart()"/>
      </div>
    `).join("");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div>
        <strong>${p.name} – CHF ${p.price.toFixed(2)}</strong><br>
        <small>${p.desc}</small>
        ${flavorHTML}
      </div>
    `;
    container.appendChild(card);
  });
}

function updateCart() {
  const list = document.getElementById("cartList");
  list.innerHTML = "";
  const items = [];
  products.forEach((p, i) => {
    p.flavors.forEach(f => {
      const qty = parseInt(document.querySelector(`[name='product_${i}_${f}']`).value);
      if (qty > 0) {
        const text = `${qty} × ${p.name} (${f})`;
        items.push(text);
        const li = document.createElement("li");
        li.textContent = text;
        list.appendChild(li);
      }
    });
  });
  document.getElementById("orderItemsInput").value = items.join(", ");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCart();
});
