import { ChevronLeft } from "lucide-react";
import { proposalTotal, rub, type Proposal } from "../../../lib/model";
import styles from "./style.module.css";

type Props = { proposal: Proposal; onPreview: () => void };

export function ProposalSummary({ proposal, onPreview }: Props) {
  const total = proposalTotal(proposal.items);
  return (
              <aside className={`summary-column ${styles.root}`}>
                <div className="summary-card">
                  <div className="summary-title">ИТОГО ПО ПРЕДЛОЖЕНИЮ</div>
                  <div className="summary-total">
                    {rub(total)} <span>₽</span>
                  </div>
                  <div className="summary-hint">Стоимость без НДС</div>
                  <div className="summary-divider" />
                  <div className="summary-row">
                    <span>Позиций</span>
                    <strong>{proposal.items.length}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Количество, всего</span>
                    <strong>
                      {rub(
                        proposal.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        ),
                      )}
                    </strong>
                  </div>
                  <button
                    className="summary-preview"
                    onClick={() => onPreview()}
                  >
                    Посмотреть документ <ChevronLeft size={16} />
                  </button>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">✦</div>
                  <strong>Всё сохраняется автоматически</strong>
                  <p>
                    Черновик останется в этом браузере. Для переноса на другое
                    устройство экспортируйте JSON-файл.
                  </p>
                </div>
              </aside>

  );
}
