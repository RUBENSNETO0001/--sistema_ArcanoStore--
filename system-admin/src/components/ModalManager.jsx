import React from 'react';
import CreateProductModal from './modals/CreateProductModal';
import ManageProductsModal from './modals/ManageProductsModal';
import ViewOrdersModal from './modals/ViewOrdersModal';
import AnalyzeOrdersModal from './modals/AnalyzeOrdersModal';
import ViewCustomersModal from './modals/ViewCustomersModal';
import ManageCategoriesModal from './modals/ManageCategoriesModal'; // Novo modal
import '../style/ModalManager.css';

const ModalManager = ({ activeModal, onClose, onAction }) => {
  const renderModal = () => {
    switch (activeModal) {
      case 'new-product':
        return <CreateProductModal onClose={onClose} onAction={onAction} />;
      case 'manage-products':
        return <ManageProductsModal onClose={onClose} onAction={onAction} />;
      case 'view-orders':
        return <ViewOrdersModal onClose={onClose} onAction={onAction} />;
      case 'analyze-orders':
        return <AnalyzeOrdersModal onClose={onClose} onAction={onAction} />;
      case 'view-customers':
        return <ViewCustomersModal onClose={onClose} onAction={onAction} />;
      case 'manage-categories': // Novo caso
        return <ManageCategoriesModal onClose={onClose} onAction={onAction} />;
      default:
        return null;
    }
  };

  if (!activeModal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {renderModal()}
      </div>
    </div>
  );
};

export default ModalManager;