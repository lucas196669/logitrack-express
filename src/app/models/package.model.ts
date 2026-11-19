/**
 * Modelo de dominio de LogiTrack Express.
 * Tipos literales (union types) en lugar de string libre: el compilador
 * impide asignar una prioridad o un estado que no exista.
 */

export type PackagePriority = 'CRITICAL' | 'STANDARD' | 'LOW';

export type PackageStatus = 'IN_TRANSIT' | 'INSPECTED' | 'REJECTED';

export interface WarehousePackage {
  /** Identificador único (UUID v4). */
  readonly id: string;
  /** Código de seguimiento con formato LTK-XXXX-ES (XXXX = 4 dígitos). */
  readonly trackingCode: string;
  /** Hub logístico de destino. */
  readonly destinationHub: string;
  /** Peso en kilogramos. */
  readonly weightKg: number;
  readonly priority: PackagePriority;
  readonly status: PackageStatus;
  /** Momento de entrada en la cinta transportadora. */
  readonly timestamp: Date;
}

/** Evento que emite el componente hijo al pulsar una acción rápida. */
export interface StatusChangeEvent {
  id: string;
  newStatus: PackageStatus;
}

/** Filtro de prioridad de la cabecera ('ALL' = sin filtro). */
export type PriorityFilter = PackagePriority | 'ALL';

/** Expresión regular del formato de código de seguimiento. */
export const TRACKING_CODE_PATTERN = /^LTK-\d{4}-ES$/;

/** Textos en español para mostrar en la interfaz. */
export const PRIORITY_LABELS: Readonly<Record<PackagePriority, string>> = {
  CRITICAL: 'Crítica',
  STANDARD: 'Estándar',
  LOW: 'Baja',
};

export const STATUS_LABELS: Readonly<Record<PackageStatus, string>> = {
  IN_TRANSIT: 'En tránsito',
  INSPECTED: 'Inspeccionado',
  REJECTED: 'Rechazado',
};
