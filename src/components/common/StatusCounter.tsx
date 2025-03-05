'use client';

import React, { useEffect, useRef, useState } from 'react';

interface StatusCounterProps {
  count: number;
}

/**
 * Componente que muestra un contador de operaciones pendientes en una columna de estado
 * con animación cuando el contador disminuye.
 *
 * @param count - Número de operaciones pendientes
 */
const StatusCounter: React.FC<StatusCounterProps> = ({ count }) => {
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

  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs text-white transition-all duration-300 ${
        isAnimating ? 'bg-green-500 scale-110' : 'bg-warning'
      }`}
    >
      {count}
    </span>
  );
};

export default StatusCounter;
