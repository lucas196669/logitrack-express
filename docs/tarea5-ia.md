# Tarea 5: IA, auditoría crítica y refactorización

## 1. Prompt exacto (cópialo tal cual en ChatGPT, Gemini o Claude)

> Tengo una app Ionic 8 + Angular 20 con componentes standalone. En HomePage tengo un `ion-searchbar` y un `PackageService` con un método `getPackages()`. Genérame un método de filtrado reactivo para la barra de búsqueda que filtre los paquetes por `trackingCode` usando RxJS con `debounceTime`, `distinctUntilChanged` y `switchMap`.

Haz captura del prompt **y de la respuesta completa** (la memoria pide la respuesta textual).

## 2. Qué revisar en la respuesta (checklist del análisis crítico)

Lo normal es que la IA devuelva algo parecido a esto:

```ts
searchSubject = new Subject<string>();
filteredPackages: any[] = [];

ngOnInit() {
  this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term: any) => this.packageService.getPackages().pipe(
      map((packages: any[]) => packages.filter(p => p.trackingCode.includes(term)))
    ))
  ).subscribe(result => this.filteredPackages = result);
}

onSearch(event: any) { this.searchSubject.next(event.target.value); }
```

Comprueba y anota en la memoria lo que encuentres:

| Problema | Cómo detectarlo | Por qué es grave |
|---|---|---|
| **Fuga de memoria** | `.subscribe()` sin `takeUntilDestroyed()`, `takeUntil(destroy$)` ni `ngOnDestroy` | Ionic cachea páginas: cada vez que se crea la página queda una suscripción viva que sigue ejecutándose |
| **Tipado `any`** | `any[]`, `event: any`, `term: any` | Rompe el `strict: true` de la Tarea 1; un error en `trackingCode` no lo detecta el compilador |
| **switchMap innecesario** | El servicio es síncrono (signal en memoria) | Se envuelven datos locales en un Observable sin necesidad |
| **Estado duplicado** | Copia la lista en `filteredPackages` | Si el componente hijo cambia un estado, la lista filtrada se queda desactualizada |
| **Distingue mayúsculas** | `includes(term)` sin normalizar | Buscar "ltk" no encuentra "LTK-1042-ES" |
| **Patrón antiguo** | `ngOnInit` + `Subject` + `subscribe` manual | Angular 17+ tiene Signals y `computed()` |

Si tu IA ya usa `takeUntilDestroyed`, dilo también: el análisis debe reflejar **lo que te devolvió de verdad**.

## 3. Código final integrado (`src/app/home/home.page.ts`)

```ts
readonly searchTerm = signal('');                       // [(ngModel)] en el searchbar

private readonly debouncedTerm = toSignal(
  toObservable(this.searchTerm).pipe(
    debounceTime(250),
    map((term) => term.trim().toUpperCase()),
    distinctUntilChanged(),
  ),
  { initialValue: '' },
);

readonly filteredPackages = computed<readonly WarehousePackage[]>(() => {
  const term = this.debouncedTerm();
  const priority = this.priorityFilter();
  return this.packageService.packages()
    .filter((p) => priority === 'ALL' || p.priority === priority)
    .filter((p) => term === '' || p.trackingCode.includes(term));
});
```

### Por qué es superior (justificación técnica)
1. **Sin fugas de memoria**: no hay ningún `subscribe()` manual. `toSignal()` se suscribe dentro del contexto de inyección y **se desuscribe solo** cuando se destruye el componente (usa `DestroyRef` por dentro, igual que `takeUntilDestroyed`).
2. **Tipado estricto al 100 %**: `signal<string>`, `computed<readonly WarehousePackage[]>`, sin un solo `any`.
3. **Se conserva lo bueno de RxJS**: `debounceTime` y `distinctUntilChanged` siguen ahí, porque son útiles para no filtrar en cada tecla. `switchMap` se elimina porque no hay petición asíncrona que cancelar. Si mañana hubiera una API HTTP, se añadiría en el pipe del `toObservable`.
4. **Una sola fuente de verdad**: `computed()` depende del signal del servicio, así que cuando el componente hijo marca un paquete como INSPECTED, la lista filtrada se recalcula sola.
5. **Combina filtros sin código extra**: prioridad y búsqueda son dos signals que lee el mismo `computed()`.
6. **Rendimiento**: `ChangeDetectionStrategy.OnPush` + signals = Angular solo vuelve a pintar lo que cambia.

Para el *diff*: pega el código de la IA a la izquierda y este a la derecha (VS Code: clic derecho → "Select for Compare" / "Compare with Selected") y haz captura.
