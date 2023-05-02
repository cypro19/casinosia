import React from 'react'
import { Button, Form, Row, Col, Table } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import useWithdrawRequestList from './hooks/useWithdrawRequestList'
import PaginationComponent from '../Pagination'
import Preloader from '../Preloader'
import DateRangePicker from '../DateRangePicker'
import Trigger from '../OverlayTrigger'
import { formatDateYMD } from '../../utils/dateFormatter'

export default ({ type }) => {
  const {
    limit,
    page,
    name,
    status,
    state,
    setState,
    paymentProvider,
    withdrawRequests,
    setLimit,
    setPage,
    setName,
    setStatus,
    setPaymentProvider,
    loading,
    totalPages,
    resetFilter,
    getStatus,
    isSAdmin
  } = useWithdrawRequestList()

  return (
    <>
      {loading
        ? (
          <Preloader />
          )
        : (
          <>
            <Row>
              <Col>
                <h3>Withdraw Requests</h3>
              </Col>
            </Row>

            <Row>
              <Col xs='auto' className='d-flex mb-3'>
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Search
                </Form.Label>

                <Form.Control
                  size='sm'
                  style={{ maxWidth: '230px' }}
                  type='search'
                  value={name}
                  placeholder='Search Name,Email'
                  onChange={(e) =>
                    setName(e.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))}
                />
              </Col>
              <Col xs='auto' className='d-flex mb-3'>
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Payment Provider
                </Form.Label>

                <Form.Control
                  size='sm'
                  style={{ maxWidth: '230px' }}
                  type='search'
                  value={paymentProvider}
                  placeholder='Search Payment Provider'
                  onChange={(e) =>
                    setPaymentProvider(
                      e.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
                    )}
                />
              </Col>

              <Col xs='auto' className='d-flex mb-3'>
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Status
                </Form.Label>

                <Form.Select
                  size='sm'
                  style={{ maxWidth: '230px' }}
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <option value=''>All</option>

                  <option key='pending' value='0'>
                    Pending
                  </option>
                  <option key='approved' value='5'>
                    Approved
                  </option>
                  <option key='cancelled' value='2'>
                    Cancelled
                  </option>
                </Form.Select>
              </Col>

              <Col
                style={{ maxHeight: '25px' }}
                xs='auto'
                className='d-flex mb-3'
              >
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Time Period
                </Form.Label>
                <DateRangePicker state={state} setState={setState} size='sm' />
              </Col>
              <Col xs='auto' className='d-flex mb-3'>
                <Trigger message='Reset Filters'>
                  <Button
                    variant='success'
                    className=''
                    size='sm'
                    onClick={() => {
                      resetFilter()
                    }}
                  >
                    <FontAwesomeIcon icon={faRedoAlt} />
                  </Button>
                </Trigger>
              </Col>
            </Row>

            <Table
              bordered
              striped
              responsive
              hover
              size='sm'
              className='text-center mt-4'
            >
              <thead className='thead-dark'>
                <tr>
                  {[
                    'Id',
                    'Email',
                    'Name',
                    'Amount',
                    'Account Number',
                    'Payment Provider',
                    'Transaction Id',
                    'Status',
                    'Actionable Type',
                    'Updated At'
                  ].map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Boolean(withdrawRequests) &&
                withdrawRequests?.rows?.map(
                  ({
                    withdrawRequestId,
                    userId,
                    status,
                    name,
                    accountNumber,
                    amount,
                    transactionId,
                    actionableType,
                    paymentProvider,
                    updatedAt,
                    email
                  }) => {
                    return (
                      <tr key={withdrawRequestId}>
                        <td>{userId}</td>
                        <td>{email}</td>
                        <td>{name}</td>
                        <td>{amount}</td>
                        <td>{accountNumber || 'NA'}</td>
                        <td>{paymentProvider || 'NA'}</td>
                        <td>{transactionId}</td>
                        <td>{getStatus(status)}</td>
                        <td>{actionableType || 'NA'}</td>
                        <td>{formatDateYMD(updatedAt) || 'NA'}</td>
                      </tr>
                    )
                  }
                )}

                {withdrawRequests?.count === 0 && (
                  <tr>
                    <td colSpan={9} className='text-danger text-center'>
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {withdrawRequests?.count !== 0 && (
              <PaginationComponent
                page={withdrawRequests?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </>
          )}
    </>
  )
}
