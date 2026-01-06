import React from 'react';
import { Modal } from '../../ui/Modal';
import { ReviewForm } from './ReviewForm';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
  onSubmit: () => void;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  itemId,
  onSubmit,
}) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="レビューを書く">
      <ReviewForm itemId={itemId} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
};
