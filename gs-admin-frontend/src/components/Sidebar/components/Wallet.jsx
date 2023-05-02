import { Col, Row, Table } from '@themesberg/react-bootstrap'
import React from 'react'
import { useSelector } from 'react-redux'

const Wallet = () => {
  const { wallets } = useSelector((state) => state.login)

  return (
    <>
      <Row>
        <Col sm={8}>
          <h3>Wallets</h3>
        </Col>
      </Row>

      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            <th>Currency</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {wallets &&
            wallets?.rows.map(({ amount, currencyCode }) => (
              <tr key={currencyCode}>
                <td>{currencyCode}</td>
                <td>{amount}</td>
              </tr>
            ))}
        </tbody>
      </Table>

    </>
  )
}

export default Wallet
