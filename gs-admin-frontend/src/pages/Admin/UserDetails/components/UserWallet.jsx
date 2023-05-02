import { Table } from '@themesberg/react-bootstrap'
import React from 'react'
import { formatDate } from '../../../../utils/dateFormatter'

const UserWallet = ({ myUserData }) => {
  return (
    <>
      {/* Table with UserWallet info */}
      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <tbody>
          <tr key={`walletId-${myUserData?.userWallet?.walletId}`}>
            <td>Wallet ID</td>
            <td>{myUserData?.userWallet?.walletId}</td>
          </tr>
          <tr key={`owner-${myUserData?.userWallet?.ownerId}`}>
            <td>Owner ID</td>
            <td>{myUserData?.userWallet?.ownerId}</td>
          </tr>
          <tr key={`ownerType-${myUserData?.userWallet?.ownerType}`}>
            <td>User Type</td>
            <td>{myUserData?.userWallet?.ownerType}</td>
          </tr>
          <tr key={`currencyCode-${myUserData?.userWallet?.currencyCode}`}>
            <td>Currency Code</td>
            <td>{myUserData?.userWallet?.currencyCode}</td>
          </tr>
          <tr key={`amount-${myUserData?.userWallet?.amount}`}>
            <td>Amount</td>
            <td>{myUserData?.userWallet?.amount}</td>
          </tr>
          <tr key={`nonCashAmount-${myUserData?.userWallet?.nonCashAmount}`}>
            <td>Non Cash Amount</td>
            <td>{myUserData?.userWallet?.nonCashAmount}</td>
          </tr>
          <tr key={`createdAt-${myUserData?.userWallet?.createdAt}`}>
            <td>Created At </td>
            <td>
              {myUserData?.userWallet?.createdAt &&
                    formatDate(myUserData?.userWallet?.createdAt)}
            </td>
          </tr>
          <tr key={`updatedAt-${myUserData?.userWallet?.updatedAt}`}>
            <td>Updated At</td>
            <td>
              {myUserData?.userWallet?.updatedAt &&
                    formatDate(myUserData?.userWallet?.updatedAt)}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

export default UserWallet
