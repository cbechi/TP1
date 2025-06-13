import puppeteer from "puppeteer";
import fs from "fs";

(async function openWebPage() {
    const URL = "https://listado.mercadolibre.com.ar/mesa-boogie#D[A:mesa%20boogie]";

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 500,
    });
    const page = await browser.newPage();

    await page.goto(URL, {
        waitUntil: "networkidle2",
    });

    const title = await page.title();
    console.log(`Page title is: ${title}`);

    let products = [];
    let nextPage = true;

    while (nextPage) {
        try {
            await page.waitForSelector(".ui-search-layout__item", { timeout: 10000 });
        } catch (e) {
            console.error("❌ No se encontraron productos en esta página.");
            break;
        }

        const newProducts = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll(".ui-search-layout__item"));

            return cards.map(card => {
                const title = card.querySelector("h2.ui-search-item__title")?.innerText?.trim();
                const price = card.querySelector(".andes-money-amount__fraction")?.innerText?.trim();
                const link = card.querySelector("a")?.href;

                if (!title || !price || !link) return null;

                return { title, price, link };
            }).filter(item => item !== null);
        });

        products = [...products, ...newProducts];

        // Manejo de la paginación
        nextPage = await page.evaluate(() => {
            const nextButton = document.querySelector(".andes-pagination__button--next");
            if (nextButton && !nextButton.classList.contains("andes-pagination__button--disabled")) {
                nextButton.click();
                return true;
            }
            return false;
        });

        if (nextPage) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            // Esperar por si es SPA
        }
    }

    console.log(`Total products found: ${products.length}`);
    console.log(products);

    // Guardar en archivo JSON
    fs.writeFileSync("productos.json", JSON.stringify(products, null, 2), "utf-8");
    console.log("✅ Archivo 'productos.json' guardado correctamente.");

    await browser.close();
})();
