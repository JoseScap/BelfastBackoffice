'use client';

import { useEffect } from 'react';
import ReactModal from 'react-modal';

export function ModalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ReactModal.setAppElement('body');
    }
  }, []);

  return <>{children}</>;
}
