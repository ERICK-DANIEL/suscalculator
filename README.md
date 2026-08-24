# SUS · System Usability Scale

Aplicación web para aplicar y puntuar el **System Usability Scale** (Brooke, 1996): el cuestionario de 10 ítems más utilizado en la industria para medir la usabilidad percibida de un producto.

## ¿Qué hace?

- **Panel de proyectos** — agrupa las evaluaciones SUS por producto o versión.
- **Cuestionario SUS guiado** — los 10 ítems estándar con escala Likert de 5 puntos, avance automático entre preguntas y pantalla de revisión antes de guardar. Ítems positivos y negativos etiquetados.
- **Puntuación automática** — conversión clásica de respuestas a un rango de 0–100 (ítems impares ×−1, pares invertidos, suma × 2,5).
- **Interpretación según Bangor, Kortum & Miller** — grado escolar (A+ … F), adjetivo ("La mejor imaginable" … "La peor imaginable") y umbral de aceptabilidad (≥ 68 aceptable / ≥ 50 marginal).
- **Historial de evaluaciones** por proyecto con edición y eliminación individual, vista detallada de cada respuesta y **exportación a CSV** lista para Excel.
- **Multilenguaje** — detección automática del idioma del navegador con soporte para español, inglés, portugués, francés y alemán; cuestionario traducido en cada idioma.

## Privacidad

Todos los datos se guardan **únicamente en el almacenamiento local de tu navegador**: no hay servidor ni base de datos, y nada sale de tu dispositivo.

## Recursos

- [SUS: A 'Quick and Dirty' Usability Scale](https://www.researchgate.net/publication/228803843_SUS_A_quick_and_dirty_usability_scale) — John Brooke (1996)
- [Determining What Individual SUS Scores Mean](https://uxpajournal.org/determining-what-individual-sus-scores-mean/) — Bangor, Kortum & Miller
- [Guía interactiva incluida](https://erick-daniel.github.io/suscalculator/guia) — qué es el SUS, cómo se calcula y cómo interpretarlo

---

Construida con [Next.js](https://nextjs.org) (App Router), React 19, Tailwind CSS v4 y un sistema de diseño propio basado en Material 3.
