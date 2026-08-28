# Poner el portfolio a funcionar

El sitio ya está desarrollado. Solo faltan tus datos. Lo que se edita:

| Archivo | Para qué |
|---|---|
| `config.js` | Claves, contacto, redes, activar el asistente con IA |
| `proyectos.js` | Tus proyectos |
| `conocimiento.js` | Lo que el asistente sabe responder |

---

## 1. Que el formulario envíe emails de verdad (5 min)

Uso **Web3Forms**: gratis, sin instalar nada.

1. Entra en <https://web3forms.com>.
2. Escribe el correo donde quieres **recibir** los mensajes y pulsa
   *Create Access Key*. Te llega una clave por email.
3. En `config.js`, pega la clave:
   ```js
   web3formsKey: "aquí-tu-clave-real",
   ```
4. Guarda y recarga. Envía una prueba: debe llegarte al correo.

Mientras la clave no esté puesta, los formularios funcionan en **modo demo**
(validan pero no envían). El mismo servicio recoge las altas del **boletín**.

---

## 2. El asistente que responde solo a los clientes

Hay un asistente flotante (botón 💬 abajo a la derecha) que responde
preguntas de clientes sobre servicios, precios, plazos y proceso.

### Nivel 1 — ya funciona, no toques nada

Responde emparejando lo que pregunta el cliente con las respuestas de
**`conocimiento.js`**. Edita ese archivo para que hable como tú:

- `contexto`: descripción general de lo que haces (en lenguaje natural).
- `faqs`: pares de *palabras clave → respuesta*. Añade los que quieras.
- `saludo`, `sugerencias`, `sinRespuesta`: los textos de la interfaz.

Sin coste, sin servidor, funciona también sin conexión.

### Nivel 2 — respuestas con IA (opcional)

Para que también conteste **preguntas abiertas** (redactadas de cualquier
forma), el asistente puede consultar a Claude. Como eso necesita una clave
de API que **no puede ir en el navegador**, se ejecuta en una función del
servidor que ya está incluida (`netlify/functions/asistente.js`).

Pasos:

1. **Sube el proyecto a GitHub** (repositorio nuevo con la carpeta `1-portfolio`).
2. En <https://app.netlify.com> → *Add new site* → *Import from Git* → elige el repo.
   Netlify detecta `netlify.toml` y `package.json` y hace `npm install` solo.
   > Nota: para esto **no** sirve arrastrar el ZIP a Netlify Drop; hace falta
   > el import desde Git (o la CLI `netlify deploy`), porque hay que instalar
   > la dependencia y publicar la función.
3. Consigue una clave de API en <https://console.anthropic.com> → *API Keys*.
   (Es de pago por uso; una FAQ con el modelo Haiku cuesta céntimos al mes en
   tráfico normal. Puedes ponerle un límite de gasto en la consola.)
4. En Netlify: *Site configuration → Environment variables* → añade
   `ANTHROPIC_API_KEY` con tu clave. Vuelve a desplegar.
5. En `config.js` cambia:
   ```js
   asistente: { ia: true, endpoint: "/.netlify/functions/asistente" }
   ```

Si la IA falla o está desactivada, el asistente sigue respondiendo con el
Nivel 1 automáticamente. El modelo se cambia en una línea al principio de
`netlify/functions/asistente.js` (`claude-haiku-4-5` → `claude-sonnet-5`
para respuestas más elaboradas).

---

## 3. Tus proyectos

En `proyectos.js`, cada bloque `{ ... }` es una ficha:

| Campo | Qué poner |
|-------|-----------|
| `titulo` | Nombre del proyecto |
| `cliente` | Cliente o "Proyecto propio" (puedes anonimizar) |
| `sector` | Salud, Educación, Comercio… |
| `anio` | Año de entrega |
| `categoria` | `web`, `tienda`, `app` u `opt` (el filtro donde aparece) |
| `desc` | 1–2 frases de qué es |
| `problema` / `solucion` / `rol` | El caso (sale al pulsar "Ver el caso") |
| `stack` | Tecnologías: `["Astro", "Stripe"]` |
| `resultado` | El dato de impacto |

Los actuales son ejemplos realistas: **cámbialos por los tuyos** o bórralos.

---

## 4. Tus datos de contacto y redes

En `config.js`:
- `email` y `whatsapp` (formato `34600112233`, sin `+`; vacío `""` oculta el botón).
- Bloque `redes`: URL de cada perfil o `""` para ocultarlo.

---

## 5. Publicarlo

- **Solo la web (sin asistente IA):** <https://app.netlify.com/drop> y arrastra
  la carpeta `1-portfolio`. URL al momento.
- **Con asistente IA:** import desde Git (ver punto 2, Nivel 2).
- **Dominio propio:** cómpralo (~$12/año) y conéctalo desde el panel de Netlify.

---

## Ya funciona sin tocar nada

Tema claro/oscuro, filtros de proyectos, contadores, barra de progreso, FAQ,
botón de subir, animaciones, barra promocional y el asistente Nivel 1.
