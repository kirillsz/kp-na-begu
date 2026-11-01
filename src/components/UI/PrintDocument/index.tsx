import {
  formatDate,
  lineTotal,
  proposalTotal,
  rub,
  type Proposal,
} from "../../../lib/model";
import { Heading } from "../../common/Heading";
import styles from "./style.module.css";

export function PrintDocument({ proposal }: { proposal: Proposal }) {
  const total = proposalTotal(proposal.items);
  return (
    <article className={`print-document ${styles.root}`} id="print-document">
      <header className="letterhead">
        <div className="letterhead-address">
          <div>г. Пенза, ул. Суворова, 145а, офис 200а</div>
          <div>Тел. 8-902-341-32-62</div>
          <div>8 (8412) 71-32-62</div>
          <div>
            E-mail: <a href="mailto:teh-ohot@yandex.ru">teh-ohot@yandex.ru</a>
          </div>
          <div>Web: teh-ohot.ru</div>
        </div>
        <img
          src="/assets/reference-1.jpg"
          alt="Технологии охоты"
          height={120}
        />
      </header>
      <div className="letterhead-rule" />
      <div className="print-date">
        от {formatDate(proposal.date)} г.
        {proposal.number && <span> № {proposal.number}</span>}
      </div>
      <Heading as="h1" className="font-bold">
        Коммерческое предложение
      </Heading>
      {proposal.client && (
        <p className="print-client">Для: {proposal.client}</p>
      )}
      <p className="print-intro">
        {proposal.requestReference
          ? `В ответ на Ваш запрос ${proposal.requestReference} предоставляем ценовую информацию и направляем коммерческое предложение на поставку:`
          : "Предоставляем ценовую информацию и направляем коммерческое предложение на поставку:"}
      </p>
      <table className="proposal-table">
        <colgroup>
          <col style={{ width: "6%" }} />
          <col style={{ width: "31%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "17%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              №<br />
              п/п
            </th>
            <th>
              Наименование товара
              <br />
              /работ/услуг
            </th>
            <th>
              Ед.
              <br />
              изм.
            </th>
            <th>
              Кол-
              <br />
              во
            </th>
            <th>
              Цена за единицу,
              <br />
              руб., без НДС
            </th>
            <th>
              Стоимость,
              <br />
              руб., без НДС
            </th>
            <th>
              Срок поставки,
              <br />
              дней
            </th>
          </tr>
        </thead>
        <tbody>
          {proposal.items.length ? (
            proposal.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="item-name">{item.name}</td>
                <td>{item.unit}</td>
                <td>{rub(item.quantity)}</td>
                <td className="numeric">{rub(item.price)}</td>
                <td className="numeric">{rub(lineTotal(item))}</td>
                <td>{item.leadDays}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="empty-print">
                Добавьте позиции в редакторе
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} className="total-label">
              Итого, руб., без НДС
            </td>
            <td className="numeric">{rub(total)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
      <div className="print-ending">
        <div className="print-terms">
          <div>Условия доставки: {proposal.delivery || "—"}.</div>
          <div>Условия оплаты: {proposal.payment || "—"}.</div>
        </div>
        <div className="bank-details">
          <strong>Реквизиты для оплаты товара:</strong>
          <br />
          Индивидуальный предприниматель Акстын Александр Владимирович
          <br />
          ИНН 583508628885
          <br />
          ОГРНИП 317583500015492
          <br />
          р/с 40802810329840002449
          <br />
          ФИЛИАЛ "НИЖЕГОРОДСКИЙ" АО «АЛЬФА-БАНК»
          <br />
          БИК 042202824
          <br />
          к/с 30101810200000000824
        </div>
        <div className="signature">
          Руководитель компании «Технологии Охоты»{" "}
          <span>_____________ / Акстын А.В./</span>
          <img src="/assets/reference-2.jpg" alt="Печать и подпись" />
        </div>
      </div>
    </article>
  );
}
