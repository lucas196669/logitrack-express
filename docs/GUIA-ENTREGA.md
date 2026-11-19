# Guía de entrega: capturas y evidencias

Renombra el PDF: **DI_P1_HernandezRomeroLucas.pdf**

## Tarea 1: Andamiaje y modelo
- [ ] Captura de la terminal creando un proyecto: `ionic start logitrack-express blank --type=angular-standalone`
      (si quieres que sea "real", créalo y copia dentro la carpeta `src/` de este zip)
- [ ] Captura de `src/app/models/package.model.ts`
- [ ] Captura de `src/app/services/package.service.ts`
- [ ] Captura de `tsconfig.json` con `"strict": true` (y `strictTemplates`)
- [ ] Captura de `ionic serve` en la terminal + navegador abierto en localhost:8100

## Tarea 2: Vista declarativa
- [ ] Captura de `home.page.html` (se ven `@for`, `@if`, `@empty`, `[(ngModel)]`, `[class]`)
- [ ] F12 → icono de móvil (Ctrl+Shift+M) → **Pixel 7** o **iPhone 14 Pro** → captura de la lista con los 3 estados
- [ ] Captura de la pestaña Consola **sin warnings**
- [ ] Extra: busca `9999` → captura del estado vacío (`@empty`)
- [ ] Extra: desliza un paquete a la izquierda → opción "Deshacer" (`ion-item-sliding`)

## Tarea 3: Componente reutilizable
- [ ] Captura de `package-card.component.ts` (`input.required`, `@Output() statusChange`)
- [ ] Captura de `package-card.component.html` (botones checkmark / close)
- [ ] Captura de la integración en `home.page.html`: `(statusChange)="onStatusChange($event)"`
- [ ] Captura **ANTES**: LTK-1042-ES "En tránsito", contadores 5 / 2 / 1
- [ ] Captura **DESPUÉS** de pulsar Inspeccionar: "Inspeccionado", borde verde, contadores 4 / 3 / 1

## Tarea 4: Accesibilidad → ver `tarea4-accesibilidad.md`

## Tarea 5: IA → ver `tarea5-ia.md`

## Vídeo (3-4 min): orden sugerido
1. Arrancar `ionic serve` (15 s)
2. Recorrido por la estructura de carpetas: modelo → servicio → página → componente (60 s)
3. Demo: filtro de prioridad, búsqueda, inspeccionar / rechazar, deslizar para deshacer, estado vacío (60 s)
4. Lighthouse antes (86) → después (100) (40 s)
5. Tarea 5: código de la IA vs tu versión con signals (40 s)

## Podcast (3-4 min): puntos a tratar (con tus palabras)
- Qué problema resuelve (operarios, cinta, poca luz)
- Por qué Ionic + Angular standalone + Signals
- Componente reutilizable: input y output, por qué no inyecta el servicio
- Accesibilidad: los 3 fallos que encontraste y cómo los arreglaste
- Qué aprendiste revisando el código de la IA
- Qué mejorarías (líneas futuras: backend real, escáner de código de barras con Capacitor, modo offline)
