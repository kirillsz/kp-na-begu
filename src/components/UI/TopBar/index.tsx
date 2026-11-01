import { Check, CircleAlert, Clock3, Menu, Printer } from "lucide-react";
import styles from "./style.module.css";

type View = "editor" | "preview";
type SaveState = "loading" | "saving" | "saved" | "error";
type Props = { proposalNumber: string; saveState: SaveState; view: View; onOpenMenu: () => void; onToggleView: () => void; onPrint: () => void };

export function TopBar({ proposalNumber, saveState, view, onOpenMenu, onToggleView, onPrint }: Props) {
  return (
        <header className={`topbar ${styles.root}`}>
          <div className="topbar-left">
            <button
              className="icon-btn mobile-menu"
              onClick={() => onOpenMenu()}
              aria-label="Открыть меню"
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb">Документы</span>
            <span className="breadcrumb-separator">/</span>
            <strong>
              {proposalNumber
                ? `КП № ${proposalNumber}`
                : "Новое предложение"}
            </strong>
          </div>
          <div className="topbar-actions">
            <span
              className={`save-status ${saveState === "error" ? "save-error" : ""}`}
            >
              {saveState === "saved" ? (
                <Check size={15} />
              ) : saveState === "error" ? (
                <CircleAlert size={15} />
              ) : (
                <Clock3 size={15} />
              )}
              {saveState === "saved"
                ? "Сохранено"
                : saveState === "error"
                  ? "Ошибка сохранения"
                  : "Сохранение..."}
            </span>
            <button
              className="outline-btn desktop-only"
              onClick={() => onToggleView()}
            >
              {view === "preview" ? "К редактору" : "Предпросмотр"}
            </button>
            <button
              className="primary-btn print-button"
              onClick={() => {
                onPrint();
              }}
            >
              <Printer size={17} />
              <span>Сохранить PDF</span>
            </button>
          </div>
        </header>

  );
}
