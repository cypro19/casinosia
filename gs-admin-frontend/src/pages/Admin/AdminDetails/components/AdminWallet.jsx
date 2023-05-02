import { Form, Table } from '@themesberg/react-bootstrap'
import React from 'react'
import { walletTabHeaders } from '../constants'

const AdminWallet = ({ adminDetails }) => {
  return (
    <>
      {/* Table with Admin Wallets info */}
      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {walletTabHeaders.map(({ label }) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {adminDetails &&
              adminDetails?.superAdminWallets.map((ele, index) => (
                <tr key={index}>
                  {walletTabHeaders.map(({ value }, idx) => (
                    <td key={idx}>{ele[value]}</td>
                  ))}
                </tr>
              ))}
        </tbody>
      </Table>

      {adminDetails?.superAdminWallets < 1
        ? (
          // If no data found
          <Form.Label className='text-danger d-flex justify-content-center mt-2'>
            No data found.
          </Form.Label>
          )
        : (
            ''
          )}
    </>
  )
}

export default AdminWallet
