import { Transfer } from '../types';
import './TransferList.css';

interface TransferListProps {
  transfers: Transfer[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onEdit?: (transfer: Transfer) => void;
  onDelete?: (transferId: number) => void;
}

export const TransferList = ({ transfers, isLoading = false, onRefresh, onEdit, onDelete }: TransferListProps) => {
  if (isLoading) {
    return <div className="transfer-list-loading">Loading transfer history...</div>;
  }

  if (!transfers || transfers.length === 0) {
    return (
      <div className="transfer-list-empty">
        <div className="empty-icon">💸</div>
        <p>No transfers yet</p>
        <small>Transfers between your banks will appear here</small>
      </div>
    );
  }

  return (
    <div className="transfer-list-container">
      <div className="transfer-list-header">
        <h3>📋 Recent Transfers</h3>
      </div>

      <div className="transfer-list-content">
        {transfers.map((transfer, index) => (
          <div key={transfer.id} className="transfer-card">
            <div className="transfer-card-header">
              <div className="transfer-route">
                <span className="bank-badge from-badge">{transfer.fromBankName}</span>
                <span className="transfer-arrow">→</span>
                <span className="bank-badge to-badge">{transfer.toBankName}</span>
              </div>
              <div className="transfer-amount">₹{transfer.amount.toLocaleString()}</div>
            </div>

            <div className="transfer-card-body">
              <p className="transfer-description">{transfer.description}</p>
              <div className="transfer-meta">
                <span className="transfer-date">
                  {new Date(transfer.date).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {(onEdit || onDelete) && (
              <div className="transfer-actions">
                {onEdit && (
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(transfer)}
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button 
                    className="btn-delete"
                    onClick={() => onDelete(transfer.id)}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}

            {index !== transfers.length - 1 && <div className="transfer-divider" />}
          </div>
        ))}
      </div>

      {onRefresh && (
        <button onClick={onRefresh} className="refresh-btn-hidden" disabled={isLoading}>
          Refresh
        </button>
      )}
    </div>
  );
};
