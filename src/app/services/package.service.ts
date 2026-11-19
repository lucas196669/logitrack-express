import { Injectable, computed, signal } from '@angular/core';
import {
  PackageStatus,
  TRACKING_CODE_PATTERN,
  WarehousePackage,
} from '../models/package.model';

/** Datos mock iniciales. `as const`-style readonly: nadie puede mutarlos. */
const INITIAL_PACKAGES: readonly WarehousePackage[] = [
  { id: '3f6c2a9e-1b4d-4c8a-9f21-7d5e0b8a1c01', trackingCode: 'LTK-1042-ES', destinationHub: 'Madrid - Coslada', weightKg: 12.4, priority: 'CRITICAL', status: 'IN_TRANSIT', timestamp: new Date('2026-11-19T07:42:00') },
  { id: '8a1d4e77-52c3-4f0b-b6a9-2e9c3d4f5a02', trackingCode: 'LTK-2381-ES', destinationHub: 'Barcelona - Zona Franca', weightKg: 3.2, priority: 'STANDARD', status: 'INSPECTED', timestamp: new Date('2026-11-19T07:55:00') },
  { id: 'c5b9f013-7e2a-4d61-8c3f-91a0b2c3d403', trackingCode: 'LTK-0917-ES', destinationHub: 'Valencia - Puerto', weightKg: 27.9, priority: 'LOW', status: 'REJECTED', timestamp: new Date('2026-11-19T08:03:00') },
  { id: '1e7a3c5d-9b0f-4a2e-8d6c-4b5a6c7d8e04', trackingCode: 'LTK-5520-ES', destinationHub: 'Sevilla - Majarabique', weightKg: 8.0, priority: 'CRITICAL', status: 'IN_TRANSIT', timestamp: new Date('2026-11-19T08:10:00') },
  { id: '6d2f8b4a-3c1e-4f7d-a9b0-5c6d7e8f9a05', trackingCode: 'LTK-7764-ES', destinationHub: 'Zaragoza - PLAZA', weightKg: 1.6, priority: 'LOW', status: 'IN_TRANSIT', timestamp: new Date('2026-11-19T08:21:00') },
  { id: 'a9c0e1f2-4b3d-4e5f-8a7b-6c5d4e3f2a06', trackingCode: 'LTK-3305-ES', destinationHub: 'Bilbao - Arasur', weightKg: 15.75, priority: 'STANDARD', status: 'IN_TRANSIT', timestamp: new Date('2026-11-19T08:34:00') },
  { id: 'f4e3d2c1-0b9a-4876-9543-21fedcba9807', trackingCode: 'LTK-8890-ES', destinationHub: 'Málaga - Centro de Transportes', weightKg: 5.3, priority: 'STANDARD', status: 'INSPECTED', timestamp: new Date('2026-11-19T08:47:00') },
  { id: '2b4d6f80-a1c3-4e5f-9071-83a5c7e9fb08', trackingCode: 'LTK-6123-ES', destinationHub: 'Madrid - Coslada', weightKg: 31.0, priority: 'CRITICAL', status: 'IN_TRANSIT', timestamp: new Date('2026-11-19T09:02:00') },
];

/**
 * Capa de datos (Model en MVVM). Única fuente de verdad del estado.
 * - El signal privado solo se modifica desde aquí.
 * - Hacia fuera se expone en modo solo lectura.
 * - Cada actualización crea un array nuevo (inmutabilidad), lo que
 *   permite a Angular detectar el cambio sin comparar en profundidad.
 */
@Injectable({ providedIn: 'root' })
export class PackageService {
  private readonly _packages = signal<readonly WarehousePackage[]>(INITIAL_PACKAGES);

  /** Lista de paquetes (solo lectura). */
  readonly packages = this._packages.asReadonly();

  /** Contadores derivados: se recalculan solos cuando cambia la lista. */
  readonly stats = computed(() => {
    const list = this._packages();
    return {
      total: list.length,
      inTransit: list.filter((p) => p.status === 'IN_TRANSIT').length,
      inspected: list.filter((p) => p.status === 'INSPECTED').length,
      rejected: list.filter((p) => p.status === 'REJECTED').length,
    };
  });

  constructor() {
    // Validación defensiva de los mocks en desarrollo.
    for (const p of INITIAL_PACKAGES) {
      if (!TRACKING_CODE_PATTERN.test(p.trackingCode)) {
        throw new Error(`Código de seguimiento inválido: ${p.trackingCode}`);
      }
    }
  }

  /** Cambia el estado de un paquete de forma inmutable. */
  updateStatus(id: string, newStatus: PackageStatus): void {
    this._packages.update((list) =>
      list.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
    );
  }
}
