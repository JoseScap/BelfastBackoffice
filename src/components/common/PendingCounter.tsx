'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PendingCounterProps {
  count: number;
  singularText?: string;
  pluralText?: string;
}

/**
 * Componente que muestra un contador de elementos pendientes con animación
 * cuando el contador disminuye.
 *
 * @param count - Número de elementos pendientes
 * @param singularText - Texto a mostrar cuando hay un solo elemento (por defecto: 'cambio pendiente')
 * @param pluralText - Texto a mostrar cuando hay múltiples elementos (por defecto: 'cambios pendientes')
 */
const PendingCounter: React.FC<PendingCounterProps> = ({
  count,
  singularText = 'cambio pendiente',
  pluralText = 'cambios pendientes',
}) => {
  // Usar useRef para mantener el valor anterior
  const prevCountRef = useRef(count);
  const [isAnimating, setIsAnimating] = useState(false);

  // Detectar cambios en el contador
  useEffect(() => {
    // Si el contador disminuye, animar
    if (count < prevCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = count;
  }, [count]);

  if (count === 0) return null;

  const text = count === 1 ? singularText : pluralText;

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
      <span
        className={`transition-all duration-500 ${isAnimating ? 'text-green-500 scale-110' : ''}`}
      >
        {count} {text}
      </span>
    </div>
  );
};

export default PendingCounter;
