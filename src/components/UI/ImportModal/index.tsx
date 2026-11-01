import { X } from "lucide-react";
import { lineTotal, rub, type Item } from "../../../lib/model";
import styles from "./style.module.css";

type Props = { result: { items: Item[]; errors: string[] } | null; onClose: () => void; onAdd: (items: Item[]) => void };

export function ImportModal({ result, onClose, onAdd }: Props) {
  return (
        <div
          className={`modal-backdrop ${styles.root}`}
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-title"
          >
            <div className="modal-head">
              <div>
                <h2 id="import-title">Импорт позиций</h2>
                <p>Проверьте результат перед добавлением</p>
              </div>
              <button
                className="icon-btn"
                aria-label="Закрыть"
                onClick={() => onClose()}
              >
                <X size={20} />
              </button>
            </div>
            <div className="import-summary">
              <strong>{result?.items.length ?? 0}</strong> позиций готовы
              к добавлению
            </div>
            {Boolean(result?.errors.length) && (
              <div className="import-errors">
                <strong>Замечания по файлу</strong>
                {result?.errors.map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </div>
            )}
            {Boolean(result?.items.length) && (
              <div className="import-preview">
                {result?.items.slice(0, 5).map((item) => (
                  <div key={item.id}>
                    <span>{item.name}</span>
                    <strong>{rub(lineTotal(item))} ₽</strong>
                  </div>
                ))}
                {(result?.items.length ?? 0) > 5 && (
                  <small>
                    И ещё {(result?.items.length ?? 0) - 5} позиций
                  </small>
                )}
              </div>
            )}
            <div className="modal-actions">
              <button
                className="outline-btn"
                onClick={() => onClose()}
              >
                Отмена
              </button>
              <button
                className="primary-btn"
                disabled={!result?.items.length}
                onClick={() => {
                  onAdd(result?.items ?? []);
                  onClose();
                }}
              >
                Добавить позиции
              </button>
            </div>
          </div>
        </div>

  );
}
