import React from 'react';
import Button from '@/components/ui/button/Button';
import type { Passenger } from '@/types/reservation';

const DOCUMENT_TYPES = [
  { value: 'DNI', label: 'DNI' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'FOREIGN_ID', label: 'Documento Extranjero' },
] as const;

interface PassengerAccordionProps {
  passenger: Passenger;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (field: keyof Passenger, value: string | number) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const PassengerAccordion: React.FC<PassengerAccordionProps> = ({
  passenger,
  index,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
  canRemove,
}) => {
  const handleRemoveClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onRemove();
    },
    [onRemove]
  );

  return (
    <div className="border border-stroke rounded-lg dark:border-strokedark overflow-hidden">
      {/* Cabecera del acordeón */}
      <div
        className="flex justify-between items-center p-4 bg-gray-50 dark:bg-meta-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-3"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {index === 0 ? (
              <span className="flex items-center gap-2">
                <span>Pasajero {index + 1}</span>
                <span className="text-xs text-primary">(Huésped Principal)</span>
              </span>
            ) : (
              `Pasajero ${index + 1}`
            )}
            {(passenger.firstName || passenger.lastName) && (
              <span className="ml-2">
                - {passenger.firstName} {passenger.lastName}
              </span>
            )}
          </span>
          {passenger.documentNumber && (
            <span className="text-xs text-gray-500">
              {passenger.documentType}: {passenger.documentNumber}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <Button variant="warning" size="sm" onClick={() => onRemove()}>
              Eliminar
            </Button>
          )}
        </div>
      </div>

      {/* Contenido del acordeón */}
      <div className={`p-4 transition-all duration-200 ${isExpanded ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Nombre
            </label>
            <input
              type="text"
              value={passenger.firstName}
              onChange={e => onUpdate('firstName', e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
              placeholder="Nombre"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Apellido
            </label>
            <input
              type="text"
              value={passenger.lastName}
              onChange={e => onUpdate('lastName', e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
              placeholder="Apellido"
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Email
            </label>
            <input
              type="email"
              value={passenger.email}
              onChange={e => onUpdate('email', e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
              placeholder="email@ejemplo.com"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Edad
            </label>
            <input
              type="number"
              value={passenger.age}
              onChange={e => onUpdate('age', e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
              min="0"
              max="120"
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Tipo de Documento
            </label>
            <select
              value={passenger.documentType}
              onChange={e => onUpdate('documentType', e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
              required
              autoComplete="off"
            >
              <option value="">Seleccionar tipo</option>
              {DOCUMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Número de Documento
            </label>
            <input
              type="text"
              value={passenger.documentNumber}
              onChange={e => onUpdate('documentNumber', e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
              placeholder="Número de documento"
              required
              autoComplete="off"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Teléfono
            </label>
            <input
              type="tel"
              value={passenger.phone}
              onChange={e => onUpdate('phone', e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
              placeholder="+54 9 11 1234-5678"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
