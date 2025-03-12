import React, { useState } from 'react';
import { RoomResponse } from '@/types/api/room';
import Modal from '@/components/common/Modal';
import Button from '@/components/ui/button/Button';
import { toast } from 'react-hot-toast';
import { trpcClient } from '@/api/trpc';

interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomResponse | null;
  onSuccess?: () => void;
}

const CONFIRMATION_WORD = 'ELIMINAR';

const DeleteRoomModal: React.FC<DeleteRoomModalProps> = ({ isOpen, onClose, room, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const isConfirmed = confirmationText === CONFIRMATION_WORD;

  const handleDelete = async () => {
    if (!room || !isConfirmed) return;

    try {
      setIsDeleting(true);
      await trpcClient.rooms.delete.mutate({ id: room.id });
      toast.success('Habitación eliminada exitosamente');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Error al eliminar la habitación');
      console.error('Error deleting room:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationText(e.target.value.toUpperCase());
  };

  const renderFooter = () => (
    <>
      <Button variant="outline" onClick={onClose} disabled={isDeleting} size="sm">
        Cancelar
      </Button>
      <Button
        variant="warning"
        onClick={handleDelete}
        disabled={isDeleting || !isConfirmed}
        size="sm"
      >
        {isDeleting ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Eliminando...
          </>
        ) : (
          'Eliminar'
        )}
      </Button>
    </>
  );

  if (!room) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Habitación"
      footer={renderFooter()}
      size="sm"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-base text-gray-600 dark:text-gray-300">
            ¿Estás seguro que deseas eliminar la habitación{' '}
            <span className="font-mono font-semibold">#{room.number}</span>?
          </p>
          <div className="rounded-lg bg-danger/10 p-4 text-sm text-danger">
            <p>Esta acción no se puede deshacer. La habitación será eliminada permanentemente.</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Para confirmar, escribe <span className="font-medium">{CONFIRMATION_WORD}</span> en el
            campo de abajo:
          </p>
          <input
            type="text"
            value={confirmationText}
            onChange={handleInputChange}
            placeholder={`Escribe ${CONFIRMATION_WORD} para confirmar`}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-danger focus:outline-none focus:ring-1 focus:ring-danger dark:border-gray-600 dark:bg-boxdark dark:placeholder-gray-500"
            disabled={isDeleting}
          />
          {confirmationText && !isConfirmed && (
            <p className="text-sm text-danger">
              Por favor, escribe exactamente {CONFIRMATION_WORD} para continuar
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteRoomModal;
