import { Button, Col, Row, Form } from '@themesberg/react-bootstrap'
import React from 'react'
import { statusType, transactionType } from './../../TransactionsBanking/constants'
import useTransactionBList from './../../TransactionsBanking/hooks/useTransactionBList'
import DateRangePicker from '../../../../components/DateRangePicker'
import { getDateDaysAgo } from '../../../../utils/dateFormatter'
import TransactionsList from '../../../../components/TransactionsList'
import Preloader from '../../../../components/Preloader'
import Trigger from '../../../../components/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload, faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from '../../../../components/Toast'

const TransactionBanking = () => {
  const {
    allCurrencies,
    setSelectedCurrency,
    setSearch,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    setSelectedAction,
    selectedCurrency,
    selectedAction,
    state,
    setState,
    transactions,
    loading,
    onDeposit,
    setSelectedPaymentProvider,
    selectedPaymentProvider,
    getCsvDownloadUrl,
    status,
    setStatus
  } = useTransactionBList({ isUserDetail: true })

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col xs='auto' className='d-flex mb-3'>
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Currency
                </Form.Label>

                <Form.Select
                  size='sm'
                  style={{ maxWidth: '230px' }}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  value={selectedCurrency}
                >
                  <option value=''>Select a Currency</option>
                  {allCurrencies && allCurrencies?.rows?.map(
                    ({ name: currName, currencyId, code }) => (
                      <option key={currencyId} value={code}>
                        {currName}
                      </option>
                    )
                  )}
                </Form.Select>
              </Col>

              <Col xs='auto' className='d-flex mb-3'>
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Action Type
                </Form.Label>

                <Form.Select
                  size='sm'
                  style={{ maxWidth: '230px' }}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  value={selectedAction}
                >
                  <option value=''>Choose Type</option>
                  {transactionType && transactionType?.map(
                    ({ label, value }) => (
                      <option key={label} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </Form.Select>
              </Col>

              <Col xs='auto' className='d-flex mb-3'>
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Status
                </Form.Label>

                <Form.Select
                  size='sm'
                  style={{ maxWidth: '230px' }}
                  value={status}
                  onChange={e =>
                    setStatus(e.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))}
                >
                  {statusType.map(({ label, value }) => {
                    return <option key={label} value={value}>{label}</option>
                  })}
                </Form.Select>
              </Col>

              <Col style={{ maxHeight: '25px' }} xs='auto' className='d-flex mb-3'>
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Payment Provider
                </Form.Label>
                <Form.Control
                  type='search'
                  size='sm'
                  value={selectedPaymentProvider}
                  style={{ maxWidth: '200px' }}
                  placeholder='Search Payment Provider'
                  onChange={e => setSelectedPaymentProvider(e.target.value)}
                />
              </Col>
              <Col style={{ maxHeight: '25px' }} xs='auto' className='d-flex mb-3'>
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Time Period
                </Form.Label>
                <DateRangePicker
                  state={state} setState={setState}
                />
              </Col>
              <Col xs='auto' className='d-flex mb-3'>
                <Trigger message='Reset Filters'>
                  <Button
                    variant='success'
                    className=''
                    size='sm'
                    onClick={() => {
                      setSearch('')
                      setSelectedAction('')
                      setSelectedCurrency('')
                      setLimit(10)
                      setPage(1)
                      setSelectedPaymentProvider('')
                      setState([
                        {
                          startDate: getDateDaysAgo(10),
                          endDate: new Date(),
                          key: 'selection'
                        }
                      ])
                    }}
                  >
                    <FontAwesomeIcon icon={faRedoAlt} />
                  </Button>
                </Trigger>
                <Trigger message='Download as CSV'>
                  <Button
                    variant='success'
                    size='sm'
                    style={{ marginLeft: '10px' }}
                    disabled={transactions?.count === 0}
                    onClick={() => {
                      const newWindow = window.open(
                        getCsvDownloadUrl('player'),
                        'csv_window',
                        'width=700,height=700'
                      )

                      setTimeout(() => {
                        newWindow.close()
                        toast('CSV downloaded', 'success')
                      }, 1000)
                    }}
                  >
                    <FontAwesomeIcon icon={faFileDownload} />
                  </Button>
                </Trigger>
              </Col>

            </Row>
            <TransactionsList
              page={page}
              setLimit={setLimit}
              limit={limit}
              setPage={setPage}
              totalPages={totalPages}
              transactions={transactions}
              onDeposit={onDeposit}
            />
          </>)}
    </>
  )
}

export default TransactionBanking
