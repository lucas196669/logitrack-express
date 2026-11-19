import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowDownOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  flameOutline,
  locationOutline,
  removeOutline,
  scaleOutline,
  timeOutline,
} from 'ionicons/icons';

import {
  PackagePriority,
  PRIORITY_LABELS,
  STATUS_LABELS,
  PackageStatus,
  StatusChangeEvent,
  WarehousePackage,
} from '../../models/package.model';

/** Icono decorativo de cada prioridad (el texto del chip ya lo explica). */
const PRIORITY_ICONS: Readonly<Record<PackagePriority, string>> = {
  CRITICAL: 'flame-outline',
  STANDARD: 'remove-outline',
  LOW: 'arrow-down-outline',
};

/**
 * Componente de presentación ("dumb component").
 * - NO inyecta PackageService: solo recibe datos (input) y avisa (output).
 * - Así es reutilizable en cualquier pantalla (listado, detalle, histórico...).
 */
@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonIcon, DatePipe, DecimalPipe],
})
export class PackageCardComponent {
  /** Paquete a representar (Signal input, obligatorio y tipado). */
  readonly package = input.required<WarehousePackage>();

  /** Evento hacia el padre con el id y el nuevo estado. */
  @Output() readonly statusChange = new EventEmitter<StatusChangeEvent>();

  // Valores derivados para la plantilla (sin lógica en el HTML)
  readonly statusLabel = computed(() => STATUS_LABELS[this.package().status]);
  readonly priorityLabel = computed(() => PRIORITY_LABELS[this.package().priority]);
  readonly statusClass = computed(() => 'status-' + this.package().status.toLowerCase().replace('_', '-'));
  readonly priorityClass = computed(() => 'priority-' + this.package().priority.toLowerCase());
  readonly isInspected = computed(() => this.package().status === 'INSPECTED');
  readonly isRejected = computed(() => this.package().status === 'REJECTED');
  /** Solo presentación: icono del chip de prioridad. */
  readonly priorityIcon = computed(() => PRIORITY_ICONS[this.package().priority]);

  constructor() {
    addIcons({
      arrowDownOutline, checkmarkCircleOutline, closeCircleOutline, flameOutline,
      locationOutline, removeOutline, scaleOutline, timeOutline,
    });
  }

  markAs(newStatus: PackageStatus): void {
    if (this.package().status === newStatus) {
      return; // evita emitir eventos redundantes
    }
    this.statusChange.emit({ id: this.package().id, newStatus });
  }
}
