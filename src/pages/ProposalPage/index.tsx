import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ChevronLeft, UploadCloud } from "lucide-react";
import { parseItemsCsv } from "../../lib/csv";
import { downloadFile } from "../../lib/download";
import { deleteProposal, listProposals, saveProposal } from "../../lib/storage";
import { newProposal, uid, type Item, type Proposal } from "../../lib/model";
import { DraftSidebar } from "../../components/UI/Draft/DraftSidebar";
import { TopBar } from "../../components/UI/TopBar";
import { ProposalEditor } from "../../components/UI/ProposalEditor";
import { PrintDocument } from "../../components/UI/PrintDocument";
import { ImportModal } from "../../components/UI/ImportModal";
import styles from "./style.module.css";

type View = "editor" | "preview";
type SaveState = "loading" | "saving" | "saved" | "error";

export function ProposalPage() {
  const [proposal, setProposal] = useState<Proposal>(() => newProposal());
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [view, setView] = useState<View>("editor");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [importResult, setImportResult] = useState<{
    items: Item[];
    errors: string[];
  } | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    listProposals()
      .then((saved) => {
        setProposals(saved);
        if (saved.length) setProposal(saved[0]);
        setSaveState("saved");
        loaded.current = true;
      })
      .catch(() => {
        setSaveState("error");
        loaded.current = true;
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    setSaveState("saving");
    const timer = setTimeout(() => {
      saveProposal(proposal)
        .then(async () => {
          setProposals(await listProposals());
          setSaveState("saved");
        })
        .catch(() => setSaveState("error"));
    }, 450);
    return () => clearTimeout(timer);
  }, [proposal]);

  function update<K extends keyof Proposal>(key: K, value: Proposal[K]) {
    setProposal((current) => ({
      ...current,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
  }
  function updateItem(id: string, patch: Partial<Item>) {
    update(
      "items",
      proposal.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    );
  }
  function addItem() {
    update("items", [
      ...proposal.items,
      { id: uid(), name: "", unit: "шт.", quantity: 1, price: 0, leadDays: "" },
    ]);
  }
  function createNew() {
    setProposal(newProposal());
    setView("editor");
    setDrawerOpen(false);
  }
  async function removeCurrent() {
    if (!window.confirm("Удалить этот черновик?")) return;
    await deleteProposal(proposal.id);
    const rest = await listProposals();
    setProposals(rest);
    setProposal(rest[0] ?? newProposal());
    setView("editor");
  }
  async function handleCsv(file: File) {
    const text = await file.text();
    setImportResult(parseItemsCsv(text));
    setImportOpen(true);
  }
  function exportDraft() {
    downloadFile(
      JSON.stringify({ format: "kp-na-begu", version: 1, proposal }, null, 2),
      `КП-${proposal.number || "черновик"}.json`,
      "application/json",
    );
  }
  async function importDraft(file: File) {
    try {
      const data = JSON.parse(await file.text());
      const item = data.proposal as Proposal;
      if (
        data.format !== "kp-na-begu" ||
        data.version !== 1 ||
        !item ||
        !Array.isArray(item.items) ||
        typeof item.date !== "string" ||
        typeof item.delivery !== "string" ||
        typeof item.payment !== "string" ||
        item.items.some(
          (row) =>
            typeof row.name !== "string" ||
            !Number.isFinite(row.quantity) ||
            !Number.isFinite(row.price),
        )
      )
        throw new Error("Неверный формат");
      setProposal({ ...item, id: uid(), updatedAt: new Date().toISOString() });
      setView("editor");
    } catch {
      window.alert("Не удалось открыть черновик. Проверьте JSON-файл.");
    }
  }

  return (
    <div className={`app-shell ${styles.root}`}>
      <DraftSidebar
        proposals={proposals}
        currentId={proposal.id}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreate={createNew}
        onSelect={(item) => {
          setProposal(item);
          setDrawerOpen(false);
          setView("editor");
        }}
      />
      {drawerOpen && (
        <button
          className="drawer-backdrop"
          aria-label="Закрыть меню"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <main className="main-area">
        <TopBar
          proposalNumber={proposal.number}
          saveState={saveState}
          view={view}
          onOpenMenu={() => setDrawerOpen(true)}
          onToggleView={() =>
            setView(view === "preview" ? "editor" : "preview")
          }
          onPrint={() => {
            setView("preview");
            setTimeout(() => window.print(), 120);
          }}
        />
        <div className="workspace">
          <div className="page-heading">
            <div>
              <div className="eyebrow">РЕДАКТОР ДОКУМЕНТА</div>
              <h1>Коммерческое предложение</h1>
              <p>
                Заполните данные, добавьте позиции и подготовьте КП на фирменном
                бланке.
              </p>
            </div>
            <div className="heading-actions">
              <button className="text-btn" onClick={exportDraft}>
                <ArrowDownToLine size={16} /> Экспорт черновика
              </button>
              <label className="text-btn import-json">
                <UploadCloud size={16} /> Открыть черновик
                <input
                  type="file"
                  accept="application/json,.json"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void importDraft(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>
          <div className="view-tabs">
            <button
              className={view === "editor" ? "selected" : ""}
              onClick={() => setView("editor")}
            >
              Редактор
            </button>
            <button
              className={view === "preview" ? "selected" : ""}
              onClick={() => setView("preview")}
            >
              Предпросмотр
            </button>
          </div>
          {view === "editor" ? (
            <ProposalEditor
              proposal={proposal}
              onUpdate={update}
              onUpdateItem={updateItem}
              onAddItem={addItem}
              onRemove={() => void removeCurrent()}
              onCsv={(file) => void handleCsv(file)}
              onPreview={() => setView("preview")}
            />
          ) : (
            <div className="preview-wrap">
              <div className="preview-toolbar">
                <span>Предпросмотр документа · формат Letter</span>
                <button
                  className="outline-btn"
                  onClick={() => setView("editor")}
                >
                  <ChevronLeft size={16} /> Вернуться к редактированию
                </button>
              </div>
              <PrintDocument proposal={proposal} />
            </div>
          )}
        </div>
      </main>
      {view === "editor" && (
        <div className="print-only">
          <PrintDocument proposal={proposal} />
        </div>
      )}
      {importOpen && (
        <ImportModal
          result={importResult}
          onClose={() => setImportOpen(false)}
          onAdd={(items) => update("items", [...proposal.items, ...items])}
        />
      )}
    </div>
  );
}
