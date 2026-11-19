# Tarea 4: Auditoría de accesibilidad (WCAG 2.1 AA)

## 1. Captura INICIAL (versión con fallos)

Copia temporalmente los archivos de `docs/version-antes-a11y/src/` encima de `src/`:

```bash
# Haz copia de seguridad de los buenos
mkdir -p backup-a11y
cp src/index.html backup-a11y/
cp src/app/components/package-card/package-card.component.html src/app/components/package-card/package-card.component.scss backup-a11y/

# Pon la versión "antes"
cp -r docs/version-antes-a11y/src/* src/
```

Con `ionic serve` en marcha: F12 → pestaña **Lighthouse** → Mode: Navigation · Device: Mobile · solo **Accessibility** → *Analyze page load*.
Resultado esperado: **86/100** con 3 fallos → captura.

## 2. Restaurar la versión corregida

```bash
cp backup-a11y/index.html src/
cp backup-a11y/package-card.component.* src/app/components/package-card/
```

Vuelve a pasar Lighthouse → **100/100** → captura.

## 3. Tabla comparativa (para la memoria)

| # | Problema detectado (Lighthouse) | Criterio WCAG 2.1 | Solución aplicada |
|---|---|---|---|
| 1 | *Buttons do not have an accessible name*: los botones de acción rápida eran solo un icono | **4.1.2** Nombre, función, valor (A) | Texto visible ("Inspeccionar"/"Rechazar") + `[attr.aria-label]="'Inspeccionar paquete ' + trackingCode"`; iconos con `aria-hidden="true"` |
| 2 | *Background and foreground colors do not have a sufficient contrast ratio*: badges de prioridad y datos secundarios | **1.4.3** Contraste mínimo (AA) | Paleta propia en `variables.scss`: texto oscuro sobre fondo claro (ratio > 7:1); quitada la `opacity` del texto secundario |
| 3 | *`user-scalable="no"` is used in the meta viewport*: el zoom estaba bloqueado | **1.4.4** Cambio de tamaño del texto (AA) | `index.html`: viewport sin `user-scalable=no` ni `maximum-scale` |

Mejoras ergonómicas extra (no las detecta Lighthouse, pero cuentan para CE 4.a):
- Botones de 44 px de alto como mínimo (WCAG 2.5.5, para usar con guantes)
- Foco de teclado visible en amarillo de 3 px (WCAG 2.4.7)
- Tema oscuro fijo para almacén con poca luz
- `aria-live="polite"` en el contador de resultados y `role="status"` en el estado vacío
- `lang="es"` y un `h1` oculto para lectores de pantalla
