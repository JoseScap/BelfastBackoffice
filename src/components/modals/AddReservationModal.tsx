import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/ui/button/Button';
import { useCategories } from '@/hooks/useCategories';
import { useRooms } from '@/hooks/useRooms';
import { ReservationDatesStep } from './reservation/ReservationDatesStep';
import { PassengersStep } from './reservation/PassengersStep';
import { ReservationDetailsStep } from './reservation/ReservationDetailsStep';
import type { ReservationFormData, Passenger } from '@/types/reservation';

type Step = 1 | 2 | 3;

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReservationFormData) => Promise<void>;
}

const INITIAL_PASSENGER: Passenger = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  documentType: '',
  documentNumber: '',
  age: 18,
};

const INITIAL_FORM_DATA: ReservationFormData = {
  checkInDate: new Date().toISOString().split('T')[0],
  checkInTime: '14:00', // Hora estándar de check-in
  checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Día siguiente
  checkOutTime: '12:00', // Hora estándar de check-out
  categoryId: '',
  roomId: '',
  passengers: [INITIAL_PASSENGER],
  source: 'BACKOFFICE',
  status: 'PENDING',
  notes: '',
  appliedDiscount: 0,
};

export const AddReservationModal: React.FC<AddReservationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<ReservationFormData>(INITIAL_FORM_DATA);
  const [expandedPassenger, setExpandedPassenger] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories, fetchCategories, isLoading: isCategoriesLoading } = useCategories();
  const { rooms, fetchRooms, isLoading: isRoomsLoading } = useRooms();

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchRooms();
    }
  }, [isOpen, fetchCategories, fetchRooms]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
      setExpandedPassenger(0);
    }
  }, [isOpen]);

  // Filter available rooms by selected category
  const availableRooms = useMemo(() => {
    if (!rooms.length || !formData.categoryId) return [];
    return rooms.filter(
      room => room.category.id === formData.categoryId && room.status.value === 'AVAILABLE'
    );
  }, [rooms, formData.categoryId]);

  const handleStepOne = () => {
    setCurrentStep(2);
  };

  const handleStepTwo = () => {
    setCurrentStep(3);
  };

  const handleStepBack = () => {
    setCurrentStep(prev => (prev - 1) as Step);
  };

  const updateFormData = (data: Partial<ReservationFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string | number) => {
    const newPassengers = [...formData.passengers];
    if (field === 'age') {
      newPassengers[index] = { ...newPassengers[index], [field]: Number(value) };
    } else {
      newPassengers[index] = { ...newPassengers[index], [field]: value as string };
    }
    setFormData({ ...formData, passengers: newPassengers });
  };

  const addPassenger = () => {
    setFormData({
      ...formData,
      passengers: [...formData.passengers, { ...INITIAL_PASSENGER }],
    });
    setExpandedPassenger(formData.passengers.length);
  };

  const removePassenger = (index: number) => {
    if (formData.passengers.length > 1) {
      const newPassengers = formData.passengers.filter((_, i) => i !== index);
      setFormData({ ...formData, passengers: newPassengers });
      if (expandedPassenger === index) {
        setExpandedPassenger(Math.max(0, index - 1));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
      setExpandedPassenger(0);
      onClose();
    } catch (error) {
      console.error('Error al crear la reservación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPassengerDataValid = () => {
    return formData.passengers.every(
      passenger =>
        passenger.firstName &&
        passenger.lastName &&
        passenger.email &&
        passenger.documentType &&
        passenger.documentNumber
    );
  };

  const canSubmit = () => {
    return formData.roomId && !isSubmitting;
  };

  const renderFooter = () => (
    <div className="flex justify-between gap-3">
      <div>
        {currentStep === 2 && (
          <Button variant="outline" onClick={addPassenger} size="sm">
            + Agregar Pasajero
          </Button>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} size="sm" disabled={isSubmitting}>
          Cancelar
        </Button>
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleStepBack} size="sm" disabled={isSubmitting}>
            Atrás
          </Button>
        )}
        {currentStep === 1 && (
          <Button
            variant="primary"
            onClick={handleStepOne}
            size="sm"
            disabled={!formData.categoryId || !formData.checkInDate || !formData.checkOutDate}
          >
            Siguiente
          </Button>
        )}
        {currentStep === 2 && (
          <Button
            variant="primary"
            onClick={handleStepTwo}
            size="sm"
            disabled={!isPassengerDataValid()}
          >
            Siguiente
          </Button>
        )}
        {currentStep === 3 && (
          <Button variant="primary" onClick={handleSubmit} size="sm" disabled={!canSubmit()}>
            {isSubmitting ? 'Creando...' : 'Crear Reserva'}
          </Button>
        )}
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Seleccionar Fechas y Categoría';
      case 2:
        return 'Datos del Pasajero';
      case 3:
        return 'Detalles Adicionales';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getStepTitle()} footer={renderFooter()}>
      {currentStep === 1 && (
        <ReservationDatesStep
          formData={formData}
          onUpdateForm={updateFormData}
          categories={categories}
          isCategoriesLoading={isCategoriesLoading}
        />
      )}
      {currentStep === 2 && (
        <PassengersStep
          formData={formData}
          expandedPassenger={expandedPassenger}
          onTogglePassenger={index =>
            setExpandedPassenger(expandedPassenger === index ? -1 : index)
          }
          onUpdatePassenger={updatePassenger}
          onRemovePassenger={removePassenger}
        />
      )}
      {currentStep === 3 && (
        <ReservationDetailsStep
          formData={formData}
          onUpdateForm={updateFormData}
          categories={categories}
          availableRooms={availableRooms}
          isRoomsLoading={isRoomsLoading}
        />
      )}
    </Modal>
  );
};
