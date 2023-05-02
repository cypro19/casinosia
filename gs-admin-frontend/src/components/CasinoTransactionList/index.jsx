import { Table } from "@themesberg/react-bootstrap";
import React from "react";
import PaginationComponent from "../Pagination";
import {
  statusType,
  tableHeaders,
} from "../../pages/Admin/CasinoTransactions/constants";
import { getDateTime } from "../../utils/dateFormatter";
import Trigger from "../OverlayTrigger";

const CasinoTransactionsList = ({
  setPage,
  page,
  totalPages,
  limit,
  setLimit,
  transactions,
}) => {
  return (
    <>
      {/* Table with Casino Transactions Info */}
      <Table
        bordered
        striped
        responsive
        hover
        size="sm"
        className="text-center mt-4"
      >
        <thead className="thead-dark">
          <tr>
            {tableHeaders.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {transactions &&
            transactions?.rows?.map(
              ({
                casinoTransactionId,
                User,
                createdAt,
                gameIdentifier,
                actionType,
                amount,
                status,
                nonCashAmount,
              }) => {
                return (
                  <tr key={`casino-transaction-list ${casinoTransactionId}`}>
                    <td>{casinoTransactionId}</td>

                    <td>
                      <Trigger message={User?.email}>
                        <span
                          style={{
                            width: "130px",
                            cursor: "pointer",
                          }}
                          className="d-inline-block text-truncate"
                        >
                          {User?.email}
                        </span>
                      </Trigger>
                    </td>

                    <td>
                      <Trigger message={gameIdentifier}>
                        <span
                          style={{
                            width: "120px",
                            cursor: "pointer",
                          }}
                          className="d-inline-block text-truncate"
                        >
                          {gameIdentifier}
                        </span>
                      </Trigger>
                    </td>

                    <td>{actionType}</td>
                    <td>{amount}</td>
                    <td>{nonCashAmount}</td>
                    <td>{User?.currencyCode}</td>
                    <td>{statusType?.[parseInt(status) + 1].label}</td>
                    <td>{getDateTime(createdAt)}</td>
                  </tr>
                );
              }
            )}
          {transactions?.count === 0 && (
            <tr>
              <td colSpan={8} className="text-danger text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {transactions?.count > 0 && (
        <PaginationComponent
          page={transactions?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  );
};

export default CasinoTransactionsList;
