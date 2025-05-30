
let products = [
  {
    name: "Recovery Shake",
    unit: "Dose 1200g",
    price: 54.00,
    variants: ["Vanille", "Schoko", "Neutral"],
    image: ""
  },
  {
    name: "Whey Isolate",
    unit: "Portion 30g",
    price: 3.20,
    variants: ["Vanille", "Schoko", "Neutral"],
    image: ""
  },
  {
    name: "Protein Bar",
    unit: "Riegel 60g",
    price: 3.50,
    variants: ["Coconut", "Cranberry", "Vanilla"],
    image: ""
  }
];

const cart = [];

function loadProducts() {
  const saved = localStorage.getItem("ehcb_products");
  if (saved) products = JSON.parse(saved);

  const container = document.getElementById("products");
  container.innerHTML = "";
  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <div><img src="${p.image || 'https://via.placeholder.com/100'}" alt=""></div>
      <div>
        <strong>${p.name} (${p.unit}) – CHF ${p.price.toFixed(2)}</strong>
        ${p.variants.map(v =>
          `<div class="variant-line">${v}:
            <input type="number" min="0" id="qty-${i}-${v}" value="0">
          </div>`).join("")}
      </div>
    `;
    container.appendChild(div);
  });
}

function saveOrder() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const note = document.getElementById("note").value;

  const summary = [];
  products.forEach((p, i) => {
    p.variants.forEach(v => {
      const qty = parseInt(document.getElementById(`qty-${i}-${v}`).value || "0");
      if (qty > 0) {
        summary.push({ name: p.name, unit: p.unit, variant: v, qty });
      }
    });
  });

  cart.length = 0;
  cart.push(...summary);

  const list = document.getElementById("cartList");
  list.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.qty} × ${item.name} (${item.unit}) – ${item.variant}`;
    list.appendChild(li);
  });

  // Save to localStorage
  const orders = JSON.parse(localStorage.getItem("ehcb_orders") || "[]");
  orders.push({
    timestamp: new Date().toISOString(),
    name,
    email,
    note,
    items: cart
  });
  localStorage.setItem("ehcb_orders", JSON.stringify(orders));
  alert("Bestellung gespeichert!");
}

function toggleAdmin() {
  const admin = document.getElementById("adminArea");
  admin.style.display = admin.style.display === "none" ? "block" : "none";
}

function checkPw() {
  const pw = document.getElementById("pwInput").value;
  if (pw !== "ehcbadmin") return alert("Falsches Passwort");
  document.getElementById("editorSection").style.display = "block";
  document.getElementById("productJson").value = JSON.stringify(products, null, 2);
  loadOrders();
}

function saveProducts() {
  try {
    const newData = JSON.parse(document.getElementById("productJson").value);
    localStorage.setItem("ehcb_products", JSON.stringify(newData));
    alert("Produkte gespeichert. Seite neu laden!");
  } catch {
    alert("Ungültiges JSON");
  }
}

function resetProducts() {
  localStorage.removeItem("ehcb_products");
  alert("Zurückgesetzt. Seite neu laden!");
}

function loadOrders() {
  const data = JSON.parse(localStorage.getItem("ehcb_orders") || "[]");
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = data.filter(o => new Date(o.timestamp).getTime() > cutoff);
  const list = document.getElementById("orderList");
  list.innerHTML = "";
  recent.forEach(o => {
    const li = document.createElement("li");
    li.textContent = `${o.name}: ${o.items.map(i => i.qty + "× " + i.name + " (" + i.unit + ") – " + i.variant).join(", ")}`;
    list.appendChild(li);
  });
}

function exportCSV() {
  const data = JSON.parse(localStorage.getItem("ehcb_orders") || "[]");
  let csv = "Datum,Name,E-Mail,Produkt,Einheit,Geschmack,Menge\n";
  data.forEach(o => {
    o.items.forEach(i => {
      csv += `${o.timestamp},${o.name},${o.email},${i.name},${i.unit},${i.variant},${i.qty}\n`;
    });
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bestellungen.csv";
  a.click();
}

loadProducts();
