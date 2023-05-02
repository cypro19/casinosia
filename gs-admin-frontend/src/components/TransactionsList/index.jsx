import { Table } from '@themesberg/react-bootstrap'
import React from 'react'
import PaginationComponent from '../Pagination'
import { statusType, tableHeaders, transactionType } from '../../pages/Admin/TransactionsBanking/constants'
import { getDateTime } from '../../utils/dateFormatter'

const TransactionsList = ({
  setPage,
  page,
  totalPages,
  limit,
  setLimit,
  transactions,
  onDeposit
}) => {
  const type = transactionType
  return (
    <>
      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {tableHeaders.map((h, idx) => (
              <th
                key={`T-table_heading ${idx}`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {transactions &&
            transactions?.rows?.map(
              ({
                transactionBankingId,
                paymentTransactionId,
                createdAt,
                actioneeEmail,
                paymentProvider,
                amount,
                transactionType,
                actioneeType,
                status,
                currencyCode
              }) => {
                return (
                  <tr key={`transaction-list ${transactionBankingId}`}>
                    <td>{transactionBankingId}</td>
                    <td>{paymentTransactionId || 'NA'}</td>
                    <td>{actioneeEmail || 'NA'}</td>
                    <td>{paymentProvider || 'NA'}</td>
                    <td>{amount}</td>
                    <td>{type?.find((type) => type.value === transactionType)?.label}</td>
                    <td>{actioneeType || 'NA'}</td>
                    <td>{currencyCode || 'NA'}</td>
                    <td>{statusType?.find((type) => type.value === status)?.label}</td>
                    <td>{getDateTime(createdAt)}</td>
                  </tr>
                )
              })}

          {transactions?.count === 0 && (
            <tr>
              <td colSpan={10} className='text-danger text-center'>
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
  )
}

export default TransactionsList
