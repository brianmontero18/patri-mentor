# Frontend Spec — Patri Mentor: Manifestación Consciente

## Rol del ejecutor

Sos un ingeniero frontend senior con ojo de product designer. Tu trabajo es construir una web app que se sienta como tener a Patricia Robiano al lado tuyo, lista para sacudirte y guiarte. No es un chatbot genérico con skin bonito. Es una experiencia de mentoría digital que respira su marca, su energía y su filosofía.

Antes de escribir una sola línea de código, leé todo este documento. Mirá las imágenes de referencia en `docs/branding/`. Internalizá quién es Patri Robiano. Si la app no transmite su espíritu guerrero, directo y amoroso — fallaste.

---

## El producto

**Patri Mentor** es un AI Mentor basado en las enseñanzas de Patricia Robiano (@patrirobianook), especialista en Desarrollo Personal, Manifestación Consciente, Salud Autogestiva y Emprendimiento.

El usuario llega con una situación de vida (conflicto familiar, bloqueo emocional, meta que no avanza, duda sobre salud/nutrición, emprendimiento estancado) y recibe orientación basada en la metodología real de Patri: directa, confrontativa, sin edulcorar, pero profundamente amorosa.

**Esto NO es:**
- Un chatbot de soporte técnico
- Una app de meditación new age con colores pastel
- Un asistente genérico con respuestas tibias
- Una copia de ChatGPT con otro skin

**Esto SÍ es:**
- Tu mentora de bolsillo que te dice lo que necesitás escuchar, no lo que querés
- Una experiencia inmersiva que se siente como una sesión privada con Patri
- Una app que desafía al usuario desde el primer segundo

---

## Quién es Patricia Robiano

- **Marca:** Manifestación Consciente
- **Instagram:** @patrirobianook (12K+)
- **YouTube:** /patrirobianook
- **Tagline:** "¿Y si eso que tanto deseás... empezara a volverse realidad?"
- **Trayectoria:** +30 años, 4 carreras (Nutrición, Coaching, Psicología Social, Psicoanálisis)
- **Estilo:** "Fuego Frío" — directa, confrontativa, intelectualmente robusta, pero amorosa
- **Historia personal:** A los 20 años tomaba 8 fármacos diarios, enferma y con sobrepeso. Revirtió todo. Hoy a los 50+ está en su mejor versión. Esa es su credencial.
- **No es hippie.** No es new age blanda. Es una guerrera profesional que integra ciencia + psicología + metafísica.

---

## Branding & Design System

### Paleta de colores

```
--color-primary:        #2BBCB3    /* Teal principal — el color de Patri */
--color-primary-dark:   #1A8F88    /* Teal oscuro para fondos, gradientes */
--color-primary-deeper: #0D5E59    /* Para backgrounds profundos */
--color-bg:             #0A1A19    /* Background principal — negro con tint teal */
--color-bg-card:        #112524    /* Cards y paneles */
--color-text:           #FFFFFF    /* Texto principal */
--color-text-muted:     #8CBFBC    /* Texto secundario — teal desaturado */
--color-accent-gold:    #D4AF37    /* Sparkles, highlights, estrellas */
--color-accent-warm:    #E8B89D    /* Acentos cálidos sutiles */
--color-user-bubble:    #1A3D3B    /* Burbuja del usuario */
--color-patri-bubble:   transparent /* Patri no tiene burbuja — su texto fluye libre */
```

### Tipografía

```
--font-logo:    'Pacifico', cursive          /* "Patri" — script handwritten */
--font-brand:   'Raleway', sans-serif        /* "ROBIANO" — uppercase, tracking 0.3em */
--font-heading: 'Playfair Display', serif    /* Títulos — elegancia con carácter */
--font-body:    'Inter', sans-serif          /* Cuerpo — limpio, legible */
--font-quote:   'Cormorant Garamond', serif  /* Frases de Patri — itálica elegante */
```

### Principios de diseño

1. **Espiritual pero NO hippie.** Líneas limpias, espacios generosos, sin mandala ni loto. El teal transmite confianza profesional con toque trascendente.
2. **Inmersivo.** El fondo oscuro con teal crea un espacio de introspección. Como entrar a una sala de mentoría privada.
3. **Respirado.** Mucho whitespace (darkspace en este caso). Nada apretado. Cada elemento tiene su lugar.
4. **Sutilmente mágico.** Sparkles suaves (✨) como acento, no como circo. Transiciones suaves. Un brillo teal que late como energía viva.
5. **Mobile-first.** El 90% del público de Patri viene de Instagram → celular. Si no es perfecto en mobile, no sirve.

### Efectos visuales

- Gradiente sutil de fondo: `linear-gradient(170deg, #0A1A19 0%, #0D2E2C 50%, #0A1A19 100%)`
- Glow teal detrás del logo: `box-shadow: 0 0 60px rgba(43, 188, 179, 0.15)`
- Sparkles: usar SVG animado con opacidad pulsante (0.3 → 0.8 → 0.3), NO emojis
- Texto de Patri aparece con efecto typewriter (por el streaming SSE, esto es natural)
- Transiciones: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

---

## Screens & Flows

### Screen 1: Landing / Welcome

**Propósito:** El usuario siente que entró a un espacio especial. No es un chatbot. Es una experiencia.

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│        ✨                       │
│                                 │
│      Patri                      │  ← Logo script, glow teal
│      ROBIANO                    │  ← Uppercase, tracking amplio
│                                 │
│   MANIFESTACIÓN CONSCIENTE      │  ← Sub-marca
│                                 │
│  "¿Y si eso que tanto deseás   │
│   empezara a volverse           │  ← Tagline, Cormorant Garamond italic
│   realidad?"                    │
│                                 │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Empezá tu sesión  →    │    │  ← CTA principal, botón teal sólido
│  └─────────────────────────┘    │
│                                 │
│   Basado en +30 años de         │
│   metodología de Patricia       │  ← Credibilidad sutil
│   Robiano                       │
│                                 │
└─────────────────────────────────┘
```

**Detalles:**
- El logo "Patri" debe tener un glow teal pulsante sutil (como respiración)
- Sparkles decorativos (2-3, no más) con animación de aparición staggered
- El CTA debe tener hover con brillo dorado sutil
- Mobile: todo centrado, full-width, sin scroll necesario
- Animación de entrada: fade-in secuencial (logo → tagline → CTA), 200ms entre cada uno
- NO hay navbar en esta pantalla. Limpio total.

---

### Screen 2: Chat — La experiencia central

**Propósito:** Esto es la sesión con Patri. Se siente íntimo, enfocado. No hay distracciones.

**Layout:**
```
┌─────────────────────────────────┐
│  Patri ✨               [≡]    │  ← Header mínimo: nombre + menu
│  ROBIANO                        │
├─────────────────────────────────┤
│                                 │
│  Hola. Soy Patri.              │
│  Contame qué te está pasando   │  ← Mensaje inicial de Patri
│  y vamos a trabajar juntos.    │
│  Sin vueltas.                   │
│                                 │
│                                 │
│         ┌───────────────────┐   │
│         │ Burbuja usuario   │   │  ← Fondo --color-user-bubble
│         │ (alineada derecha)│   │
│         └───────────────────┘   │
│                                 │
│  Mirá, lo que me contás...     │
│  [respuesta de Patri fluye     │  ← SIN burbuja. Texto libre.
│   sin burbuja, como texto      │     Alineado a la izquierda.
│   de un libro]                  │     Color --color-text.
│                                 │
│                                 │
├─────────────────────────────────┤
│  ┌─────────────────────┐  [→]  │  ← Input + send button
│  │ Escribí lo que       │       │
│  │ necesitás trabajar...│       │
│  └─────────────────────┘       │
└─────────────────────────────────┘
```

**Detalles críticos de UX:**

1. **Patri NO tiene burbuja.** Su texto aparece libre, como si estuviera hablando en una sala. Solo el usuario tiene burbuja (oscura, sutil). Esto crea asimetría visual intencional: Patri domina el espacio.

2. **Streaming:** Las respuestas llegan por SSE, token a token. El texto aparece con efecto typewriter natural. NO simular typing dots (los tres puntitos). Que el texto simplemente fluya.

3. **Scroll:** Auto-scroll al fondo conforme llega texto nuevo. Pero si el usuario scrolleó manualmente hacia arriba, NO forzar scroll (respeto).

4. **Input:**
   - Placeholder interpelante: "¿Qué necesitás trabajar hoy?" o "Contame, ¿qué te está frenando?"
   - Textarea expandible (crece con el contenido, max 4 líneas)
   - Submit: Enter para enviar, Shift+Enter para nueva línea
   - Botón de envío: flecha o ícono teal, se ilumina cuando hay texto
   - Disabled mientras Patri responde (con indicador sutil de que está procesando)

5. **Indicador de que Patri está "pensando":**
   - NO usar los tres dots bouncing genéricos
   - Usar un glow teal pulsante al lado del nombre "Patri" en el header
   - O un sparkle sutil que aparece y desaparece
   - Mensaje sutil: "Patri está leyendo..." en texto muted

6. **Quick actions (opcional pero potente):**
   Debajo del primer mensaje de Patri, mostrar 2-3 chips sugeridos:
   ```
   [Tengo un bloqueo emocional]  [Quiero manifestar una meta]  [Emprender me da miedo]
   ```
   Desaparecen después del primer mensaje del usuario.

7. **Mensaje inicial de Patri** (hardcodeado, no viene del LLM):
   > "Hola. Soy Patri. Contame qué te está pasando y vamos a trabajar juntos. Sin vueltas. No estoy acá para endulzarte la realidad, estoy para ayudarte a ver lo que capaz no querés ver. Así que dale, ¿qué necesitás hoy?"

---

### Screen 3: Menu lateral (drawer)

**Propósito:** Acceso a info secundaria. Minimal.

```
┌──────────────────┐
│  ✨ Patri         │
│  ROBIANO          │
│                   │
│  Nueva sesión     │  ← Limpia el chat
│  Sobre Patri      │  ← Breve bio
│  Metodología VAF  │  ← Link externo o sección
│  ─────────────    │
│  @patrirobianook  │  ← Links a IG/YT
│  /patrirobianook  │
│                   │
│  v0.1.0 MVP       │
└──────────────────┘
```

---

## Comportamiento de la app

### Onboarding (MVP simple)

1. Usuario llega al landing → Click "Empezá tu sesión"
2. Va directo al chat. Sin registro. Sin pedir nombre. Sin fricción.
3. Opcionalmente en el futuro: pedir nombre para personalizar ("Hola, [nombre]")

### Flujo de chat

1. Se muestra el mensaje hardcodeado de bienvenida de Patri
2. Se muestran los quick actions (chips sugeridos)
3. Usuario escribe o clickea un chip
4. Se envía POST a `/api/chat/stream` con `{ messages: [...] }`
5. Se consume el SSE stream y se va renderizando token a token
6. Al recibir `{ done: true }`, se habilita el input de nuevo
7. Los mensajes se acumulan en un array local (no se persisten en DB para MVP anónimo)

### Manejo de errores

- Si el backend falla: mostrar un mensaje inline (no un modal) con estilo de Patri: "Algo falló, pero no te preocupes. Volvé a intentar." + botón retry.
- Si no hay conexión: "Sin conexión. Reconectando..." con el sparkle pulsante.

---

## API Reference

**Base URL en dev:** `http://localhost:3001/api`
(Vite proxy: `/api/*` → `localhost:3001`)

### POST /api/chat/stream (principal)

```typescript
// Request
{
  messages: Array<{ role: "user" | "assistant"; content: string }>
}

// Response: SSE stream
data: {"content":"Mirá"}\n\n
data: {"content":", lo que"}\n\n
data: {"content":" me contás..."}\n\n
data: {"done":true}\n\n
```

### POST /api/chat (fallback non-streaming)

```typescript
// Request
{ messages: Array<{ role: "user" | "assistant"; content: string }> }

// Response
{ reply: "Mirá, lo que me contás..." }
```

### GET /api/health

```typescript
// Response
{ status: "ok", service: "patri-mentor", timestamp: "..." }
```

---

## Stack técnico

```
React 18 + TypeScript + Vite 5
```

- **Sin librerías de UI externas.** No Material UI, no Chakra, no Tailwind. CSS puro (variables + clases utility). Igual que Astral.
- **Sin estado global complejo.** useState + useRef es suficiente. No Redux, no Zustand.
- **Google Fonts:** Pacifico, Raleway, Playfair Display, Inter, Cormorant Garamond.
- **Inline styles + CSS variables** en `index.css`. Clases utility para glassmorphism, animaciones, etc.

### Estructura de archivos

```
frontend/
├── index.html
├── vite.config.ts          ← Proxy /api → localhost:3001
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx              ← Router por estado: landing | chat
    ├── api.ts               ← Funciones de llamada HTTP + SSE
    ├── types.ts             ← ChatMessage, AppState
    ├── index.css            ← Variables CSS, animaciones, base styles
    └── components/
        ├── Landing.tsx       ← Screen 1: welcome + CTA
        ├── ChatView.tsx      ← Screen 2: la experiencia central
        ├── ChatInput.tsx     ← Input expandible + send
        ├── MessageBubble.tsx ← Render de mensajes (user vs patri)
        ├── QuickActions.tsx  ← Chips sugeridos
        ├── MenuDrawer.tsx    ← Drawer lateral
        └── PatriLogo.tsx     ← Logo animado reutilizable
```

---

## Vite config

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

---

## Layout (reglas de hierro)

```
div (height: 100vh, flex column, overflow: hidden)    ← App root
  div (position: absolute, pointer-events: none)       ← Efectos decorativos (glow)
  div (flex: 1, flex column, minHeight: 0, zIndex: 10) ← Content wrapper
    header (flexShrink: 0)                              ← Solo en chat
    div (flex: 1, overflow-y: auto, minHeight: 0)       ← Messages scroll area
    div (flexShrink: 0)                                 ← Input (siempre visible abajo)
```

- NUNCA `minHeight: 100vh` en root
- NUNCA `scrollIntoView()` — usar `el.scrollTop = el.scrollHeight`
- `minHeight: 0` en flex children es ESENCIAL para overflow
- maxWidth: 760px + margin: 0 auto para el área de mensajes
- Mobile: padding lateral 16px, desktop: auto-centrado

---

## Animaciones

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes sparkle {
  0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
  100% { opacity: 0; transform: scale(0.5) rotate(360deg); }
}

@keyframes breathe {
  0%, 100% { box-shadow: 0 0 30px rgba(43, 188, 179, 0.1); }
  50% { box-shadow: 0 0 60px rgba(43, 188, 179, 0.25); }
}
```

---

## Copy de la app (textos exactos)

### Landing
- Título: "Patri ROBIANO" (logo)
- Sub: "MANIFESTACIÓN CONSCIENTE"
- Tagline: "¿Y si eso que tanto deseás... empezara a volverse realidad?"
- CTA: "Empezá tu sesión"
- Footer: "Basado en +30 años de metodología de Patricia Robiano"

### Chat
- Mensaje de bienvenida (hardcodeado):
  > "Hola. Soy Patri. Contame qué te está pasando y vamos a trabajar juntos. Sin vueltas. No estoy acá para endulzarte la realidad, estoy para ayudarte a ver lo que capaz no querés ver. Así que dale, ¿qué necesitás hoy?"
- Placeholder del input: "¿Qué necesitás trabajar hoy?"
- Quick actions:
  - "Tengo un bloqueo emocional"
  - "Quiero manifestar una meta"
  - "Necesito claridad en mis vínculos"
- Loading: "Patri está leyendo..."
- Error: "Algo falló, pero no te preocupes. Volvé a intentar."

### Menu
- "Nueva sesión"
- "Sobre Patri"
- "Metodología VAF"

---

## Criterios de aceptación

1. **Branding:** La app se siente como una extensión natural de @patrirobianook. El teal domina. El logo se ve como en su banner. Si le mostrás la app a alguien que sigue a Patri en Instagram, debe reconocer la marca inmediatamente.

2. **Experiencia:** El usuario siente intimidad y confrontación al mismo tiempo. No se siente como un chatbot. Se siente como una sesión.

3. **Streaming:** El texto de Patri fluye token a token sin saltos, sin flickering, sin layout shifts. Natural como alguien escribiendo.

4. **Mobile perfecto:** Todo funciona impecable en un iPhone SE (pantalla chica). No hay scroll horizontal. No hay elementos cortados. El input no se tapa con el teclado.

5. **Performance:** La app carga en < 2 segundos. No hay dependencias pesadas. No hay lazy loading innecesario para un MVP.

6. **Zero friction:** Del landing al chat en 1 click. Sin registro, sin modales, sin pasos intermedios.

7. **El test de Patri:** Si Patricia Robiano ve esta app y dice "esto soy yo, me representa", ganaste.

---

## Imágenes de referencia

Ver `docs/branding/`:
- `banner-header.png` — Su banner oficial (logo + tagline + teal)
- `ig-post-clases.png` — Estilo visual de sus posts
- `ig-post-presentacion.png` — Ella, su estilo personal

Estas imágenes son tu norte visual. La app debe sentirse como si ella la hubiera diseñado.

---

## Lo que NO hacer

- NO usar fondo blanco. Nunca. El universo de Patri es profundo, oscuro con luz teal.
- NO usar bordes redondeados exagerados (border-radius: 24px). Moderados (8-12px).
- NO usar sombras drop-shadow genéricas. Usar glows teal.
- NO poner un avatar genérico de robot o IA. Si hay avatar, es Patri (su foto real) o simplemente el sparkle ✨.
- NO usar los tres dots bouncing para loading. Eso es de chatbot genérico.
- NO poner "Powered by GPT" ni mencionar IA en la UI. Esto es Patri, no un bot.
- NO usar Comic Sans, Lobster, ni tipografías "espirituales" kitsch.
- NO meter animaciones en cada elemento. Sutil y con propósito.
