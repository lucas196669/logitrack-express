# LogiTrack Express · DI 0488 · Actividad 2

Interfaz Ionic 8 + Angular 20 (standalone, Signals, TypeScript estricto) para la recepción e inspección de paquetes en almacén.

## Arrancar

```bash
npm install
ionic serve        # o: npm start  →  http://localhost:8100
```

Si no tienes Ionic CLI: `npm i -g @ionic/cli`

## Estructura

```
src/app/
├── models/package.model.ts          ← Tarea 1: interfaz WarehousePackage + tipos
├── services/package.service.ts      ← Tarea 1: estado con signal() inmutable
├── home/home.page.{ts,html,scss}    ← Tarea 2 (vista) + Tarea 5 (búsqueda reactiva)
└── components/package-card/         ← Tarea 3: componente reutilizable (input + @Output)
docs/
├── GUIA-ENTREGA.md                  ← qué captura hacer en cada tarea
├── tarea4-accesibilidad.md          ← tabla WCAG + cómo sacar el Lighthouse "antes"
├── tarea5-ia.md                     ← prompt para la IA + qué buscar en su respuesta
└── version-antes-a11y/              ← archivos con los fallos de accesibilidad (para la captura inicial)
```

## Arquitectura (MVVM)

| Capa | Archivo | Responsabilidad |
|---|---|---|
| Model | `package.model.ts` + `package.service.ts` | Tipos y única fuente de verdad (signal privado, expuesto readonly) |
| ViewModel | `home.page.ts` | Filtros con `computed()`, recibe eventos del hijo y llama al servicio |
| View | `home.page.html`, `package-card` | Solo pinta y emite eventos. El card **no** inyecta el servicio |
