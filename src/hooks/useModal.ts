'use client';
import { useState, useCallback } from 'react';
import { AppModalType, ModalMetadata, ModalState } from '@/types/modal';

interface UseModalReturn {
  isOpen: boolean;
  modalType: AppModalType;
  metadata?: ModalMetadata;
  open: (type: AppModalType, metadata?: ModalMetadata) => void;
  close: () => void;
  isModalType: (type: AppModalType) => boolean;
}

export const useModal = (): UseModalReturn => {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    isOpen: false,
  });

  const open = useCallback((type: AppModalType, metadata?: ModalMetadata) => {
    setModalState({
      type,
      isOpen: true,
      metadata,
    });
  }, []);

  const close = useCallback(() => {
    setModalState({
      type: null,
      isOpen: false,
      metadata: undefined,
    });
  }, []);

  const isModalType = useCallback(
    (type: AppModalType) => modalState.isOpen && modalState.type === type,
    [modalState]
  );

  return {
    isOpen: modalState.isOpen,
    modalType: modalState.type,
    metadata: modalState.metadata,
    open,
    close,
    isModalType,
  };
};
