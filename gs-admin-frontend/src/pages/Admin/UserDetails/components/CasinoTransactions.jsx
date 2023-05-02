import React from 'react'
import useCasinoTransactionsList from '../hooks/useCasinoTransactionsList'
import Preloader from '../../../../components/Preloader'
import { Button, Col, Row, Form } from '@themesberg/react-bootstrap'
import DateRangePicker from '../../../../components/DateRangePicker'
import { getDateDaysAgo } from '../../../../utils/dateFormatter'
import { transactionType, statusType } from '../../CasinoTransactions/constants'
import CasinoTransactionsList from '../../../../components/CasinoTransactionList'
import { toast } from '../../../../components/Toast'
import Trigger from '../../../../components/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload, faRedoAlt } from '@fortawesome/free-solid-svg-icons'

const CasinoTransactions = () => {
  const {
    allCurrencies,
    setSelectedCurrency,
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
    casinoTransactions,
    loading,
    status,
    setStatus,
    getCsvDownloadUrl
  } = useCasinoTransactionsList()

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
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                  size='sm'
                  style={{ maxWidth: '230px' }}
                >
                  {statusType && statusType?.map(
                    ({ label, value }) => (
                      <option key={label} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </Form.Select>

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
                    size='sm'
                    onClick={() => {
                      setSelectedAction('all')
                      setSelectedCurrency('')
                      setLimit(10)
                      setPage(1)
                      setState([
                        {
                          startDate: getDateDaysAgo(10),
                          endDate: new Date(),
                          key: 'selection'
                        }
                      ])
                      setStatus('all')
                    }}
                  >
                    <FontAwesomeIcon icon={faRedoAlt} />
                  </Button>
                </Trigger>
              </Col>

              <Col xs='auto' className='d-flex mb-3'>
                <Trigger message='Download as CSV'>
                  <Button
                    variant='success'
                    size='sm'
                    disabled={casinoTransactions?.count === 0}
                    onClick={() => {
                      const newWindow = window.open(
                        getCsvDownloadUrl(),
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
            <CasinoTransactionsList
              page={page}
              setLimit={setLimit}
              limit={limit}
              setPage={setPage}
              totalPages={totalPages}
              transactions={casinoTransactions}
            />
          </>
          )}
    </>
  )
}

export default CasinoTransactions
