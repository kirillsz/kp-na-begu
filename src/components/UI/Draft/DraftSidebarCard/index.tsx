import { type Proposal, formatDate } from "../../../../lib/model";

type SidebarCardProps = {
  item: Proposal;
  currentId: string;
  onSelect: (proposal: Proposal) => void;
};

const DraftSidebarCard = ({ item, currentId, onSelect }: SidebarCardProps) => {
  const itemNamesListInString = item.items.map((item) => item.name).join(", ");
  return (
    <button
      key={item.id}
      className={`draft ${item.id === currentId ? "active" : ""}`}
      onClick={() => {
        onSelect(item);
      }}
    >
      <div className="draft-info">
        <span>
          {item.number ? `КП № ${item.number}` : "Без номера"}
          {", "}
          {item.client || "без клиента"}
        </span>
        <div className="line-clamp-2">{itemNamesListInString}</div>
        <span></span>
        <span className="">{formatDate(item.date)}</span>
      </div>
    </button>
  );
};

export default DraftSidebarCard;
