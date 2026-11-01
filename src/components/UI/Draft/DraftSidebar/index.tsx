import { useState } from "react";
import { FileText, Plus, Search, X } from "lucide-react";
import { Button } from "../../../common/Button";
import { formatDate, type Proposal } from "../../../../lib/model";
import styles from "./style.module.css";
import DraftSidebarCard from "../DraftSidebarCard";

type Props = {
  proposals: Proposal[];
  currentId: string;
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  onSelect: (proposal: Proposal) => void;
};

export function DraftSidebar({
  proposals,
  currentId,
  open,
  onClose,
  onCreate,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase();
  const filtered = proposals.filter((proposal) =>
    [
      proposal.number,
      proposal.client,
      ...proposal.items.map((item) => item.name),
    ].some((value) => value.toLocaleLowerCase().includes(query)),
  );
  return (
    <aside className={`sidebar ${styles.root} ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <FileText size={20} strokeWidth={2.3} />
        </div>
        <div>
          <strong>КП на бегу</strong>
          <small>Рабочее пространство</small>
        </div>
        <button
          className="icon-btn sidebar-close"
          onClick={() => onClose()}
          aria-label="Закрыть меню"
        >
          <X size={20} />
        </button>
      </div>
      <Button className="new-btn" onClick={onCreate}>
        <Plus size={18} /> Новое предложение
      </Button>
      <div className="sidebar-label">
        МОИ ЧЕРНОВИКИ <span>{proposals.length}</span>
      </div>
      <label className="search-box">
        <Search size={17} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Номер, клиент или позиция"
          aria-label="Поиск по номеру КП, клиенту или наименованию позиции"
        />
      </label>
      <div className="draft-list">
        {filtered.map((item) => (
          <DraftSidebarCard
            item={item}
            currentId={currentId}
            onSelect={onSelect}
          />
        ))}
        {filtered.length === 0 && (
          <p className="sidebar-empty">Черновиков пока нет</p>
        )}
      </div>
    </aside>
  );
}
