# ML Scraper - Trabajo Práctico 1

Este proyecto hace scraping en MercadoLibre y guarda resultados en archivos JSON.

## Cómo ejecutar

1. Construir imagen:
```bash
docker build -t ml-scraper .


## Ejecutar la imagen:
```bash
docker run -it -v ${PWD}/json:/app/json ml-scraper


Una vez ejecutado el contenedor escribir lo que se quiere buscar, esto va a hacer un scrap en mercado libre generando un archivo JSON en la carpeta json (siendo recursiva para que se pueda escribir sobre ella), con el titulo, precio y link.

