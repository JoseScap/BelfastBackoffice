import React from 'react';
import { IconWrapper } from '@/components/common/icons';
import { getAppointmentStatusConfig, getRoomStatusConfig } from '@/utils/statusColors';
import { AppointmentStatusValue, RoomStatusValue } from '@/types/hotel';
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';

// Tipos base
type BaseCellProps = {
  className?: string;
  children: React.ReactNode;
};

type GuestCellProps = {
  firstName: string;
  lastName: string;
  email: string;
};

type RoomCellProps = {
  number: number;
  categoryName: string;
};

type DateCellProps = {
  date: string;
};

type PriceCellProps = {
  amount: number;
};

type ActionsCellProps = {
  onView: () => void;
  onEdit?: () => void;
  onDelete: () => void;
};

// Componente base de celda
export const TableCell = React.memo(({ className, children }: BaseCellProps) => (
  <td className={`border-b border-[#eee] py-5 px-4 ${className || ''}`}>{children}</td>
));
TableCell.displayName = 'TableCell';

// Componente de celda para huéspedes
export const GuestCell = React.memo(({ firstName, lastName, email }: GuestCellProps) => (
  <TableCell>
    <h5 className="font-medium text-black dark:text-white">
      {firstName} {lastName}
    </h5>
    <p className="text-sm">{email}</p>
  </TableCell>
));
GuestCell.displayName = 'GuestCell';

// Componente de celda para habitaciones
export const RoomCell = React.memo(({ number, categoryName }: RoomCellProps) => (
  <TableCell>
    <p className="text-black dark:text-white">#{number}</p>
    <p className="text-sm">{categoryName}</p>
  </TableCell>
));
RoomCell.displayName = 'RoomCell';

// Componente de celda para fechas
export const DateCell = React.memo(({ date }: DateCellProps) => (
  <TableCell>
    <p className="text-black dark:text-white">
      {new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </p>
  </TableCell>
));
DateCell.displayName = 'DateCell';

// Celda de número
export const NumberCell = React.memo(({ number }: { number: number }) => (
  <TableCell>
    <h5 className="font-medium text-black dark:text-white">#{number}</h5>
  </TableCell>
));
NumberCell.displayName = 'NumberCell';

// Celda de categoría
export const CategoryCell = React.memo(
  ({ name, description }: { name: string; description: string }) => (
    <TableCell>
      <h5 className="font-medium text-black dark:text-white">{name}</h5>
      <p className="text-sm">{description}</p>
    </TableCell>
  )
);
CategoryCell.displayName = 'CategoryCell';

// Celda de piso
export const FloorCell = React.memo(({ floor }: { floor: number }) => (
  <TableCell>
    <p className="text-black dark:text-white">{floor}º Piso</p>
  </TableCell>
));
FloorCell.displayName = 'FloorCell';

// Celda de capacidad
export const CapacityCell = React.memo(({ capacity }: { capacity: number }) => (
  <TableCell>
    <p className="text-black dark:text-white">
      {capacity} {capacity === 1 ? 'persona' : 'personas'}
    </p>
  </TableCell>
));
CapacityCell.displayName = 'CapacityCell';

// Celda de precio
export const PriceCell = React.memo(({ amount }: PriceCellProps) => (
  <TableCell>
    <p className="text-black dark:text-white">${amount.toFixed(2)}</p>
  </TableCell>
));
PriceCell.displayName = 'PriceCell';

// Celda de estado de habitación
export const RoomStatusCell = React.memo(({ status }: { status: RoomStatusValue }) => {
  const { background, text } = getRoomStatusConfig(status);
  return (
    <TableCell>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${background} ${text}`}
        >
          {status}
        </span>
      </div>
    </TableCell>
  );
});
RoomStatusCell.displayName = 'RoomStatusCell';

// Celda de estado de cita
export const AppointmentStatusCell = React.memo(
  ({ status }: { status: AppointmentStatusValue }) => {
    const { background, text } = getAppointmentStatusConfig(status);
    return (
      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${background} ${text}`}
          >
            {status}
          </span>
        </div>
      </TableCell>
    );
  }
);
AppointmentStatusCell.displayName = 'AppointmentStatusCell';

// Celda de fuente
export const SourceCell = React.memo(({ label }: { label: string }) => (
  <TableCell>
    <p className="text-black dark:text-white capitalize">{label}</p>
  </TableCell>
));
SourceCell.displayName = 'SourceCell';

// Celda de acciones
export const ActionsCell = React.memo(({ onView, onEdit, onDelete }: ActionsCellProps) => (
  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
    <div className="flex items-center space-x-3.5">
      <button className="hover:text-primary" onClick={onView} title="Ver detalles">
        <IconWrapper className="fill-current flex items-center justify-center hover:bg-gray-300 rounded-full p-1">
          <BsEye size={20} />
        </IconWrapper>
      </button>
      <button className="hover:text-primary" onClick={onEdit} title="Editar">
        <IconWrapper className="fill-current flex items-center justify-center hover:bg-gray-300 rounded-full p-1">
          <BsPencil size={20} />
        </IconWrapper>
      </button>
      <button className="hover:text-primary" onClick={onDelete} title="Eliminar">
        <IconWrapper className="fill-current flex items-center justify-center hover:bg-gray-300 rounded-full p-1">
          <BsTrash size={20} />
        </IconWrapper>
      </button>
    </div>
  </td>
));
ActionsCell.displayName = 'ActionsCell';
