import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import readline from "readline";

// Activar modo stealth
puppeteer.use(StealthPlugin());

// Crear función que espera input desde consola
const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, answer => {
    rl.close();
    resolve(answer);
  }));
};

(async () => {
  // Preguntar término de búsqueda
  const searchTerm = await askQuestion("🔎 ¿Qué querés buscar en MercadoLibre?: ");
  const query = encodeURIComponent(searchTerm.trim());
  const URL = `https://listado.mercadolibre.com.ar/${query}`;

  console.log(`🔗 Buscando: ${URL}`);

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle2" });

  await new Promise(resolve => setTimeout(resolve, 5000));

  const cantidad = await page.evaluate(() => {
    return document.querySelectorAll("ol.ui-search-layout li").length;
  });
  console.log("🧪 Productos encontrados en el DOM:", cantidad);

  const products = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll("ol.ui-search-layout li"));

    return items.map(item => {
      const title = item.querySelector(".poly-component__title")?.innerText?.trim() || "Sin título";
      const price = item.querySelector(".andes-money-amount__fraction")?.innerText?.trim() || "Sin precio";
      const link = item.querySelector("a")?.href || "Sin link";

      return { title, price, link };
    }).filter(p => p.title !== "Sin título");
  });

  console.log(`✅ Productos encontrados: ${products.length}`);
  console.log(products);

  const dir = "./json";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeTerm = searchTerm.replace(/\s+/g, "_");
  const filename = `${dir}/productos-${safeTerm}-${timestamp}.json`;

  fs.writeFileSync(filename, JSON.stringify(products, null, 2), "utf-8");
  console.log(`📄 Archivo guardado en: ${filename}`);

  await browser.close();
})();
