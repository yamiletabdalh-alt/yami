/* =====================================================================
   AGENTE DE PAGOS  (Stripe -> esta función)
   ---------------------------------------------------------------------
   Stripe avisa aquí de cada cobro, pago fallido, cancelación, reembolso
   o disputa, y el agente lo anota en el registro de clientes (almacén
   "crm"): pagos, estado del cliente y tickets automáticos.

   Necesita en Netlify la variable STRIPE_WEBHOOK_SECRET (empieza por
   "whsec_"), que da Stripe al crear el webhook. Sin ella no hace nada.
   URL para Stripe:
     https://yamilet-abdalh-web.netlify.app/.netlify/functions/stripe-webhook
   Eventos: checkout.session.completed, invoice.paid,
   invoice.payment_failed, customer.subscription.deleted,
   charge.refunded, charge.dispute.created
   ===================================================================== */
import { getStore } from "@netlify/blobs";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const PLANES = { 1500: "Esencial", 3500: "Negocio", 6500: "Pro" };
const RANGO = { lead: 0, nuevo: 1, "pago-fallido": 2, activo: 3, cancelado: 1 };

const limpio = (v) => (v || "").trim().replace(/^["']|["']$/g, "");
const claveEmail = (email) => createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 24);
const dinero = (centimos, moneda = "usd") => `${(centimos / 100).toFixed(2)} ${moneda.toUpperCase()}`;

function firmaValida(cuerpo, cabecera, secreto) {
  if (!cabecera) return false;
  let t = null;
  const firmas = [];
  for (const parte of cabecera.split(",")) {
    const [k, v] = parte.split("=");
    if (k === "t") t = v;
    if (k === "v1") firmas.push(v);
  }
  if (!t || !firmas.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false; // más de 5 min: se rechaza
  const esperada = Buffer.from(createHmac("sha256", secreto).update(`${t}.${cuerpo}`, "utf8").digest("hex"), "hex");
  return firmas.some((f) => {
    const b = Buffer.from(f, "hex");
    return b.length === esperada.length && timingSafeEqual(b, esperada);
  });
}

async function actualizarCliente(store, email, cambios, nota) {
  if (!email) return null;
  const id = claveEmail(email);
  const clave = `clientes/${id}`;
  const ahora = new Date().toISOString();
  const c = (await store.get(clave, { type: "json" })) || {
    id, email: email.toLowerCase(), estado: "lead", creado: ahora, historial: [], notas: "", origen: "pago online",
  };
  for (const k of ["nombre", "telefono", "plan", "stripeCliente"]) if (cambios[k]) c[k] = cambios[k];
  if (cambios.estado) {
    // "cancelado" y "pago-fallido" siempre se aplican; el resto solo si sube
    const forzar = cambios.estado === "cancelado" || cambios.estado === "pago-fallido";
    if (forzar || (RANGO[cambios.estado] ?? 0) >= (RANGO[c.estado] ?? 0)) c.estado = cambios.estado;
  }
  c.historial = [...(c.historial || []), { fecha: ahora, texto: nota }].slice(-50);
  c.actualizado = ahora;
  await store.setJSON(clave, c);
  return c;
}

async function anotarPago(store, id, datos) {
  await store.setJSON(`pagos/${id}`, { id, fecha: new Date().toISOString(), ...datos });
}

async function crearTicket(store, tipo, urgencia, email, nombre, mensaje) {
  const n = Number((await store.get("contador/tickets", { type: "text" })) || "0") + 1;
  await store.set("contador/tickets", String(n));
  const numero = "T-" + String(n).padStart(4, "0");
  const ahora = new Date().toISOString();
  await store.setJSON(`tickets/${numero}`, {
    id: numero, numero, tipo, urgencia, estado: "abierto", nombre: nombre || "", email: email || "",
    mensaje, creado: ahora, actualizado: ahora, respuesta: "", automatico: true,
  });
  return numero;
}

async function emailDeClienteStripe(store, clienteStripe) {
  if (!clienteStripe) return null;
  const m = await store.get(`mapa/${clienteStripe}`, { type: "json" });
  return m ? m.email : null;
}

export default async (req) => {
  const secreto = limpio(process.env.STRIPE_WEBHOOK_SECRET);
  if (!secreto) return new Response("Falta STRIPE_WEBHOOK_SECRET en Netlify.", { status: 503 });
  if (req.method !== "POST") return new Response("Solo POST", { status: 405 });

  const cuerpo = await req.text();
  if (!firmaValida(cuerpo, req.headers.get("stripe-signature"), secreto)) {
    return new Response("Firma no válida", { status: 400 });
  }

  let evento;
  try { evento = JSON.parse(cuerpo); } catch (_) { return new Response("JSON no válido", { status: 400 }); }

  const store = getStore({ name: "crm", consistency: "strong" });
  // Stripe puede repetir un aviso: cada evento se procesa una sola vez
  if (await store.get(`eventos/${evento.id}`)) return new Response("Ya procesado", { status: 200 });

  const o = evento.data && evento.data.object ? evento.data.object : {};
  try {
    switch (evento.type) {
      case "checkout.session.completed": {
        const d = o.customer_details || {};
        const plan = PLANES[o.amount_total] || "";
        if (o.customer && d.email) await store.setJSON(`mapa/${o.customer}`, { email: d.email.toLowerCase() });
        await actualizarCliente(store, d.email, {
          nombre: d.name, telefono: d.phone, plan, estado: "activo", stripeCliente: o.customer,
        }, `Alta pagada en Stripe: plan ${plan || "?"} (${dinero(o.amount_total || 0, o.currency)}).`);
        break;
      }
      case "invoice.paid": {
        const email = o.customer_email || (await emailDeClienteStripe(store, o.customer));
        const plan = PLANES[o.amount_paid] || "";
        await anotarPago(store, o.id, {
          tipo: "pago", email, nombre: o.customer_name || "", importe: o.amount_paid, moneda: o.currency, plan,
          motivo: o.billing_reason === "subscription_create" ? "Primer pago" : "Renovación mensual",
        });
        await actualizarCliente(store, email, { estado: "activo", plan },
          `Pago recibido: ${dinero(o.amount_paid || 0, o.currency)}.`);
        break;
      }
      case "invoice.payment_failed": {
        const email = o.customer_email || (await emailDeClienteStripe(store, o.customer));
        await anotarPago(store, o.id + "-fallo-" + (o.attempt_count || 1), {
          tipo: "fallido", email, nombre: o.customer_name || "", importe: o.amount_due, moneda: o.currency,
          plan: PLANES[o.amount_due] || "", motivo: `Intento ${o.attempt_count || 1} fallido`,
        });
        const c = await actualizarCliente(store, email, { estado: "pago-fallido" },
          `Pago fallido (intento ${o.attempt_count || 1}). Stripe lo reintentará y avisará al cliente.`);
        if ((o.attempt_count || 1) === 1) {
          await crearTicket(store, "Facturación o pagos", "Normal", email, c && c.nombre,
            "Aviso automático del agente de pagos: falló el cobro de la cuota. Stripe reintenta el pago y envía un email al cliente para actualizar su tarjeta. Revisa si se resuelve en unos días.");
        }
        break;
      }
      case "customer.subscription.deleted": {
        const email = await emailDeClienteStripe(store, o.customer);
        await anotarPago(store, o.id + "-baja", { tipo: "cancelacion", email, importe: 0, moneda: "usd", motivo: "Suscripción cancelada" });
        await actualizarCliente(store, email, { estado: "cancelado" }, "Suscripción cancelada en Stripe.");
        break;
      }
      case "charge.refunded": {
        const email = (o.billing_details && o.billing_details.email) || o.receipt_email || (await emailDeClienteStripe(store, o.customer));
        await anotarPago(store, o.id + "-reembolso", {
          tipo: "reembolso", email, importe: o.amount_refunded, moneda: o.currency, motivo: "Reembolso",
        });
        await actualizarCliente(store, email, {}, `Reembolso hecho: ${dinero(o.amount_refunded || 0, o.currency)}.`);
        break;
      }
      case "charge.dispute.created": {
        const email = await emailDeClienteStripe(store, o.customer);
        await crearTicket(store, "Facturación o pagos", "Urgente", email, "",
          `⚠️ Disputa abierta en Stripe por ${dinero(o.amount || 0, o.currency)} (motivo: ${o.reason || "?"}). Responde en el panel de Stripe antes de la fecha límite.`);
        break;
      }
      default:
        break; // otros avisos se ignoran
    }
    await store.set(`eventos/${evento.id}`, new Date().toISOString());
    return new Response("OK", { status: 200 });
  } catch (e) {
    return new Response("Error: " + e.message, { status: 500 }); // Stripe lo reintentará
  }
};
