# ML Scraper - Trabajo Práctico 1

Este proyecto hace scraping en MercadoLibre y guarda resultados en archivos JSON.

# Requisitos

- Docker instalado
- Acceso a terminal

## Cómo ejecutar

Clonar el repositorio: https://github.com/cbechi/TP1

Construir imagen:
```bash
docker build -t ml-scraper .


## Ejecutar el contenedor:
```bash
docker run -it -v ${PWD}/json:/app/json ml-scraper

## Explicación:

Una vez ejecutado el contenedor escribir lo que se quiere buscar, esto va a hacer un scrap en mercado libre generando un archivo JSON en la carpeta json (siendo recursiva para que se pueda escribir sobre ella), con el titulo, precio y link.


## Notas técnicas:

Usa Puppeteer Extra + plugin Stealth para evitar bloqueos.

Espera 5 segundos a que cargue el DOM para mayor confiabilidad.

Chrome se instala automáticamente al construir la imagen.

Compatible con cualquier sistema operativo que tenga Docker.

