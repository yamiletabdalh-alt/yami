# Portfolio — Yamilet Abdalh

Sitio web personal: diseño y desarrollo web, con proyectos, precios,
opiniones y un asistente que responde solo a los clientes.

Hecho con HTML, CSS y JavaScript (sin framework). Se publica como sitio
estático; la carpeta `netlify/functions/` añade el asistente con IA opcional.

## Puesta en marcha

Todo se configura en tres archivos y está explicado paso a paso en
[`CONFIGURAR.md`](CONFIGURAR.md):

| Archivo | Para qué |
|---|---|
| `config.js` | Claves (formulario, asistente), contacto y redes |
| `proyectos.js` | Los proyectos que se muestran |
| `conocimiento.js` | Lo que el asistente sabe responder |

## Desarrollo local

No necesita compilar nada. Abre `index.html` en el navegador, o sírvelo
con cualquier servidor estático:

```bash
npx serve .
```

## Publicación

- **Rápida (sin asistente IA):** arrastra esta carpeta a
  <https://app.netlify.com/drop>.
- **Con asistente IA:** conecta este repositorio en Netlify (*Import from
  Git*) y añade la variable de entorno `ANTHROPIC_API_KEY`. Ver
  [`CONFIGURAR.md`](CONFIGURAR.md), punto 2.
