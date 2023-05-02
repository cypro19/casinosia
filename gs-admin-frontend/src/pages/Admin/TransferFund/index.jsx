import React from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Modal
} from '@themesberg/react-bootstrap'
import useTransferFund from './useTransferFund'
import { fundTransferSchema } from './schema'
import { toast } from '../../../components/Toast'

export default ({ handleClose, show, adminId, allowedCurrencies }) => {
  const {
    wallets,
    deposit,
    loading,
    sourceCurr,
    setSourceCurr,
    getAmount
  } = useTransferFund()

  return (
    <Formik
      initialValues={{
        addAmount: 0,
        targetCurrencyCode: '',
        sourceCurrencyCode: ''
      }}
      validationSchema={fundTransferSchema}
      onSubmit={(formValues) => {
        deposit({
          data: {
            ...formValues,
            toOwnerId: adminId,
            sourceCurrencyCode: sourceCurr
          }
        })
        handleClose()
      }}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        handleBlur,
        setFieldValue,
        handleReset
      }) => (
        <Form>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop='static'
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Deposit</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Row className='mt-3'>
                <Col>
                  <BForm.Label className='d-flex'>
                    <h5>Source Currency<span className='text-danger'> * </span>
                      {sourceCurr !== '' && getAmount() > 0 &&
                        <span className='text-success'>
                          (Deposit from {getAmount()})
                        </span>}
                    </h5>
                  </BForm.Label>

                  <BForm.Select
                    name='sourceCurrencyCode'
                    onChange={(e) => {
                      setSourceCurr(e.target.value)
                      handleChange(e)
                    }}
                    onBlur={handleBlur}
                    value={values.sourceCurrencyCode || ''}
                  >
                    <option value='' disabled>---Select Source Currency---</option>
                    {wallets && wallets?.rows.map(({ currencyCode, amount }) => {
                      return (
                        amount > 0 &&
                          <option key={currencyCode} value={currencyCode}>
                            {currencyCode}
                          </option>
                      )
                    })}
                  </BForm.Select>

                  <ErrorMessage
                    component='div'
                    name='sourceCurrencyCode'
                    className='text-danger'
                  />
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                    <h5>Target Currency<span className='text-danger'> *</span></h5>
                  </BForm.Label>

                  <BForm.Select
                    name='targetCurrencyCode'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.targetCurrencyCode || ''}
                  >
                    <option value='' disabled>---Select Target Currency---</option>
                    {allowedCurrencies && allowedCurrencies?.map((currCode) => {
                      return (
                        <option key={currCode} value={currCode}>
                          {currCode}
                        </option>
                      )
                    })}
                  </BForm.Select>

                  <ErrorMessage
                    component='div'
                    name='targetCurrencyCode'
                    className='text-danger'
                  />
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                    <h5>Amount<span className='text-danger'> *</span></h5>
                  </BForm.Label>

                  <BForm.Control
                    type='number'
                    name='addAmount'
                    placeholder='Enter Amount'
                    value={values.addAmount}
                    onChange={(e) => {
                      if (e.target.value > getAmount()) {
                        toast('Insufficient Balance.Enter Lesser Value', 'error')
                      } else {
                        if (!isNaN(Number(e.target.value))) {
                          handleChange(e)
                        }
                      }
                    }}
                    onBlur={handleBlur}
                    disabled={sourceCurr === ''}
                  />

                  <ErrorMessage
                    component='div'
                    name='addAmount'
                    className='text-danger'
                  />
                </Col>
              </Row>
            </Modal.Body>

            <div className='mt-4 '>
              <Modal.Footer className='d-flex justify-content-between align-items-center'>
                <Button
                  variant='warning'
                  onClick={() => {
                    handleReset()
                    setSourceCurr('')
                    handleClose()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant='success'
                  onClick={handleSubmit}
                  className='ml-2'
                >
                  {loading && (
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                  )}
                  Submit
                </Button>
              </Modal.Footer>
            </div>

          </Modal>
        </Form>
      )}
    </Formik>
  )
}
