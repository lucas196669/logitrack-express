import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  banOutline,
  checkmarkDoneOutline,
  cubeOutline,
  fileTrayOutline,
  navigateOutline,
  refreshOutline,
  searchOutline,
} from 'ionicons/icons';

import { PackageCardComponent } from '../components/package-card/package-card.component';
import { PriorityFilter, StatusChangeEvent, WarehousePackage } from '../models/package.model';
import { PackageService } from '../services/package.service';

/**
 * Página contenedora (ViewModel en MVVM).
 * Orquesta: lee el estado del servicio, aplica filtros con computed()
 * y traduce los eventos del componente hijo en llamadas al servicio.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSelect, IonSelectOption,
    IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonIcon,
    PackageCardComponent,
  ],
})
export class HomePage {
  private readonly packageService = inject(PackageService);

  /** Estado de la UI (enlazado con [(ngModel)] en la plantilla). */
  readonly searchTerm = signal('');
  readonly priorityFilter = signal<PriorityFilter>('ALL');

  /**
   * Término de búsqueda con debounce (Tarea 5).
   * toObservable + toSignal: Angular gestiona la suscripción y la
   * cancela al destruir el componente → sin fugas de memoria.
   */
  private readonly debouncedTerm = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(250),
      map((term) => term.trim().toUpperCase()),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  readonly stats = this.packageService.stats;

  /** Solo presentación: % de cada estado sobre el total (barras de progreso). */
  readonly statPercents = computed(() => {
    const s = this.stats();
    const pct = (n: number): number => (s.total === 0 ? 0 : Math.round((n / s.total) * 100));
    return { inTransit: pct(s.inTransit), inspected: pct(s.inspected), rejected: pct(s.rejected) };
  });

  /** Lista filtrada: se recalcula sola cuando cambia cualquier signal leído. */
  readonly filteredPackages = computed<readonly WarehousePackage[]>(() => {
    const term = this.debouncedTerm();
    const priority = this.priorityFilter();
    return this.packageService
      .packages()
      .filter((p) => priority === 'ALL' || p.priority === priority)
      .filter((p) => term === '' || p.trackingCode.includes(term));
  });

  constructor() {
    addIcons({ banOutline, checkmarkDoneOutline, cubeOutline, fileTrayOutline, navigateOutline, refreshOutline, searchOutline });
  }

  /** Captura el @Output del componente hijo. */
  onStatusChange(event: StatusChangeEvent): void {
    this.packageService.updateStatus(event.id, event.newStatus);
  }

  /** Acción del deslizable: devuelve el paquete a "En tránsito". */
  resetStatus(pkg: WarehousePackage, sliding: IonItemSliding): void {
    this.packageService.updateStatus(pkg.id, 'IN_TRANSIT');
    void sliding.close();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.priorityFilter.set('ALL');
  }
}
