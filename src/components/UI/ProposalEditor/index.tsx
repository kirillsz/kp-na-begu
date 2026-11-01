import { useRef } from "react";
import {
  ArrowDownToLine,
  Clock3,
  FilePlus2,
  FileText,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Field } from "../../common/Field";
import { NumericField } from "../../common/NumericField";
import { ProposalSummary } from "../ProposalSummary";
import { csvTemplate } from "../../../lib/csv";
import { downloadFile } from "../../../lib/download";
import { lineTotal, rub, type Item, type Proposal } from "../../../lib/model";
import styles from "./style.module.css";

type Props = {
  proposal: Proposal;
  onUpdate: <K extends keyof Proposal>(key: K, value: Proposal[K]) => void;
  onUpdateItem: (id: string, patch: Partial<Item>) => void;
  onAddItem: () => void;
  onRemove: () => void;
  onCsv: (file: File) => void;
  onPreview: () => void;
};

export function ProposalEditor({
  proposal,
  onUpdate,
  onUpdateItem,
  onAddItem,
  onRemove,
  onCsv,
  onPreview,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  return (
    <div className={`editor-layout ${styles.root}`}>
      <div className="editor-main">
        <section className="panel">
          <div className="section-heading">
            <div className="section-icon blue">
              <FileText size={19} />
            </div>
            <div>
              <h2>Основная информация</h2>
              <p>Данные для шапки предложения</p>
            </div>
          </div>
          <div className="form-grid">
            <Field
              label="Номер КП"
              value={proposal.number}
              onChange={(value) => onUpdate("number", value)}
              placeholder="Например, 2010-26-1"
            />
            <Field
              label="Дата"
              type="date"
              value={proposal.date}
              onChange={(value) => onUpdate("date", value)}
            />
            <Field
              label="Клиент / организация"
              value={proposal.client}
              onChange={(value) => onUpdate("client", value)}
              placeholder="Название клиента"
            />
            <Field
              label="Ссылка на запрос"
              value={proposal.requestReference}
              onChange={(value) => onUpdate("requestReference", value)}
              placeholder="Например, № 2.1-08-367 от 19 октября 2026 г."
            />
          </div>
        </section>
        <section className="panel items-panel">
          <div className="section-heading items-heading">
            <div className="section-icon green">
              <FilePlus2 size={19} />
            </div>
            <div>
              <h2>
                Позиции предложения{" "}
                <span className="count-badge">{proposal.items.length}</span>
              </h2>
              <p>Добавьте вручную или загрузите CSV</p>
            </div>
            <div>
              <div>
                <button
                  className="outline-btn import-btn"
                  onClick={() => fileInput.current?.click()}
                >
                  <UploadCloud size={17} /> Загрузить CSV
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".csv,text/csv"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onCsv(file);
                    e.target.value = "";
                  }}
                />
              </div>

              <button
                className="text-btn"
                onClick={() =>
                  downloadFile(
                    "\uFEFF" + csvTemplate,
                    "образец-позиций.csv",
                    "text/csv;charset=utf-8",
                  )
                }
              >
                <ArrowDownToLine size={14} /> Скачать образец CSV
              </button>
            </div>
          </div>
          {proposal.items.length ? (
            <div className="items-list">
              {proposal.items.map((item, index) => (
                <div className="item-card" key={item.id}>
                  <div className="item-card-top">
                    <span>ПОЗИЦИЯ {String(index + 1).padStart(2, "0")}</span>
                    <button
                      className="icon-btn delete-item"
                      onClick={() =>
                        onUpdate(
                          "items",
                          proposal.items.filter((row) => row.id !== item.id),
                        )
                      }
                      aria-label="Удалить позицию"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <div className="item-fields">
                    <div className="item-name">
                      <Field
                        label="Наименование"
                        value={item.name}
                        onChange={(value) =>
                          onUpdateItem(item.id, { name: value })
                        }
                        placeholder="Наименование товара или услуги"
                      />
                    </div>
                    <Field
                      label="Ед. изм."
                      value={item.unit}
                      onChange={(value) =>
                        onUpdateItem(item.id, { unit: value })
                      }
                    />
                    <NumericField
                      label="Количество"
                      value={item.quantity}
                      min={0.001}
                      onChange={(value) =>
                        onUpdateItem(item.id, { quantity: value })
                      }
                    />
                    <NumericField
                      label="Цена, ₽"
                      value={item.price}
                      onChange={(value) =>
                        onUpdateItem(item.id, { price: value })
                      }
                    />
                    <Field
                      label="Срок, дней"
                      value={item.leadDays}
                      onChange={(value) =>
                        onUpdateItem(item.id, { leadDays: value })
                      }
                    />
                  </div>
                  <div className="item-subtotal">
                    Сумма позиции <strong>{rub(lineTotal(item))} ₽</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-items">
              <div className="empty-icon">
                <FilePlus2 size={24} />
              </div>
              <strong>Позиции пока не добавлены</strong>
              <span>
                Начните с новой позиции или загрузите готовую таблицу CSV
              </span>
            </div>
          )}
          <div className="item-actions">
            <button className="add-item-btn" onClick={onAddItem}>
              <Plus size={18} /> Добавить позицию
            </button>
          </div>
        </section>
        <section className="panel">
          <div className="section-heading">
            <div className="section-icon amber">
              <Clock3 size={19} />
            </div>
            <div>
              <h2>Условия предложения</h2>
              <p>Отобразятся после таблицы в документе</p>
            </div>
          </div>
          <div className="form-grid">
            <Field
              label="Условия доставки"
              value={proposal.delivery}
              onChange={(value) => onUpdate("delivery", value)}
            />
            <Field
              label="Условия оплаты"
              value={proposal.payment}
              onChange={(value) => onUpdate("payment", value)}
            />
          </div>
        </section>
        <button className="delete-proposal" onClick={() => void onRemove()}>
          <Trash2 size={16} /> Удалить черновик
        </button>
      </div>
      <ProposalSummary proposal={proposal} onPreview={onPreview} />
    </div>
  );
}
