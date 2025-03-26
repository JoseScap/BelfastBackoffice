import React from 'react';
import type { ReservationFormData, Passenger } from '@/types/reservation';
import { PassengerAccordion } from './PassengerAccordion';

interface PassengersStepProps {
  formData: ReservationFormData;
  expandedPassenger: number;
  onTogglePassenger: (index: number) => void;
  onUpdatePassenger: (index: number, field: keyof Passenger, value: string | number) => void;
  onRemovePassenger: (index: number) => void;
}

export const PassengersStep: React.FC<PassengersStepProps> = ({
  formData,
  expandedPassenger,
  onTogglePassenger,
  onUpdatePassenger,
  onRemovePassenger,
}) => {
  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      {formData.passengers.map((passenger, index) => (
        <PassengerAccordion
          key={index}
          passenger={passenger}
          index={index}
          isExpanded={expandedPassenger === index}
          onToggle={() => onTogglePassenger(index)}
          onUpdate={(field, value) => onUpdatePassenger(index, field, value)}
          onRemove={() => onRemovePassenger(index)}
          canRemove={formData.passengers.length > 1}
        />
      ))}
    </div>
  );
};
