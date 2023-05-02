import React from 'react'
import {
  Card,
  Row,
  Col,
  ButtonGroup,
  Button
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDollarSign,
  faGift,
  faMoneyBill,
  faUsers
} from '@fortawesome/free-solid-svg-icons'

const BalanceCard = () => {
  const balanceCards = {
    'TOTAL OF DEPOSITS': faDollarSign,
    'TOTAL OF WITHDRAWALS': faDollarSign,
    'PLAYERS LOGGED IN': faUsers,
    'PLAYERS REGISTERED': faUsers,
    'PLAYERS BALANCE': faMoneyBill,
    'PLAYERS MAKING DEPOSIT': faUsers,
    'PLAYERS MAKING WITHDRAWALS': faUsers,
    'TOTAL BETTING BONUS': faGift
  }

  const buttonColors = {
    'TOTAL OF DEPOSITS': 'secondary',
    'TOTAL OF WITHDRAWALS': 'secondary',
    'PLAYERS LOGGED IN': 'danger',
    'PLAYERS REGISTERED': 'success',
    'PLAYERS BALANCE': 'secondary',
    'PLAYERS MAKING DEPOSIT': 'secondary',
    'PLAYERS MAKING WITHDRAWAL': 'danger',
    'TOTAL BETTING BONUS': 'secondary'
  }

  return (
    <>
      <Row className='justify-content-center'>
        {Object.keys(balanceCards).map((keyName, i) => (
          <Card className='mt-3 m-1' style={{ width: '17rem', height: '5rem' }} key={i}>
            <Row className='mt-2'>
              <Col xs lg='3'>
                <ButtonGroup>
                  <Button size='lg' variant={buttonColors[keyName]}>
                    <FontAwesomeIcon icon={balanceCards[keyName]} />
                  </Button>
                </ButtonGroup>
              </Col>
              <Col>
                <Col className='text-weight-bold'>{keyName}</Col>
                <Col>0</Col>
              </Col>
            </Row>
          </Card>
        ))}
      </Row>
    </>
  )
}

export default BalanceCard
