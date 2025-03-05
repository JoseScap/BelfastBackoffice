'use client';
import { FaUser } from 'react-icons/fa';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
  amount: string;
}

const recentReservations: Reservation[] = [
  {
    id: '#RES-2024-001',
    guestName: 'Carlos Rodríguez',
    roomNumber: '201',
    checkIn: '12 Jun 2024',
    checkOut: '15 Jun 2024',
    status: 'Confirmada',
    amount: '$450',
  },
  {
    id: '#RES-2024-002',
    guestName: 'María González',
    roomNumber: '305',
    checkIn: '14 Jun 2024',
    checkOut: '16 Jun 2024',
    status: 'Pendiente',
    amount: '$320',
  },
  {
    id: '#RES-2024-003',
    guestName: 'Juan Pérez',
    roomNumber: '118',
    checkIn: '15 Jun 2024',
    checkOut: '20 Jun 2024',
    status: 'Confirmada',
    amount: '$780',
  },
  {
    id: '#RES-2024-004',
    guestName: 'Ana Martínez',
    roomNumber: '402',
    checkIn: '16 Jun 2024',
    checkOut: '18 Jun 2024',
    status: 'Cancelada',
    amount: '$290',
  },
  {
    id: '#RES-2024-005',
    guestName: 'Roberto Sánchez',
    roomNumber: '210',
    checkIn: '18 Jun 2024',
    checkOut: '22 Jun 2024',
    status: 'Confirmada',
    amount: '$620',
  },
];

export default function RecentReservations() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-5 py-5 sm:px-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Reservaciones Recientes
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar px-5 sm:px-6 pb-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="pl-4">
                ID
              </TableCell>
              <TableCell isHeader>Huésped</TableCell>
              <TableCell isHeader>Habitación</TableCell>
              <TableCell isHeader>Check-in</TableCell>
              <TableCell isHeader>Check-out</TableCell>
              <TableCell isHeader>Estado</TableCell>
              <TableCell isHeader className="text-right pr-4">
                Monto
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentReservations.map(reservation => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium pl-4">{reservation.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <FaUser className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                    </div>
                    <span>{reservation.guestName}</span>
                  </div>
                </TableCell>
                <TableCell>{reservation.roomNumber}</TableCell>
                <TableCell>{reservation.checkIn}</TableCell>
                <TableCell>{reservation.checkOut}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      reservation.status === 'Confirmada'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-500'
                        : reservation.status === 'Pendiente'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-500'
                    }`}
                  >
                    {reservation.status}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-4">{reservation.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
