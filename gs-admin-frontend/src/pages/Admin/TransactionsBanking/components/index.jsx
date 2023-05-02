import {
  Button,
  Col,
  Row,
  Spinner,
  Form as BForm,
  Card
} from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import Preloader from '../../../../components/Preloader'
import useDeposit from '../hooks/useDeposit'
import { AdminRoutes } from '../../../../routes'
import AsyncSelect from 'react-select/async'
import { depostSchema } from '../schema'

export default () => {
  const {
    loading,
    navigate,
    allCurrencies,
    loadOptions,
    setTargetEmail,
    formSubmitHandler
  } = useDeposit()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <div>
            <Row className='mt-3'>
              <Col className='d-flex'>
                <h2>Deposit</h2>
              </Col>
            </Row>

            <Card body>
              <Formik
                initialValues={{
                  sourceCurrencyCode: '',
                  targetCurrencyCode: '',
                  toOwnerId: '',
                  addAmount: '',
                  toOwnerType: ''
                }}
                validationSchema={depostSchema}
                onSubmit={(formValues) => {
                  formSubmitHandler(formValues)
                }}
              >
                {({ values, handleChange, handleSubmit, handleBlur }) => (
                  <Form>
                    <Row className='mt-3'>
                      <Col>
                        <BForm.Label>
                          Target Type<span className='text-danger'> *</span>
                        </BForm.Label>

                        <BForm.Select
                          name='toOwnerType'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.toOwnerType}
                          arial-label='Select Target Type'
                        >
                          <option key='' value='' disabled>
                            Select Target Type
                          </option>
                          <option value='admin'>Admin</option>
                          <option value='user'>User</option>
                        </BForm.Select>

                        <ErrorMessage
                          component='div'
                          name='toOwnerType'
                          className='text-danger'
                        />
                      </Col>
                      <Col>
                        <BForm.Label>
                          Target Email<span className='text-danger'> *</span>
                        </BForm.Label>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          getOptionLabel={e => e.email}
                          getOptionValue={e => e.email}
                          loadOptions={loadOptions}
                          onChange={(e) => setTargetEmail(e)}
                        />
                      </Col>
                    </Row>
                    <Row className='mt-3'>
                      <Col>
                        <BForm.Label>
                          Amount<span className='text-danger'> *</span>
                        </BForm.Label>

                        <BForm.Control
                          type='text'
                          name='addAmount'
                          placeholder='Enter Amount'
                          value={values.addAmount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />

                        <ErrorMessage
                          component='div'
                          name='addAmount'
                          className='text-danger'
                        />
                      </Col>
                    </Row>

                    <Row className='mt-3'>
                      <Col>
                        <BForm.Label>
                          Source Currency<span className='text-danger'> *</span>
                        </BForm.Label>

                        <BForm.Select
                          onChange={handleChange}
                          value={values.sourceCurrencyCode}
                          onBlur={handleBlur}
                          name='sourceCurrencyCode'
                        >
                          <option value=''>Select a Currency</option>
                          {allCurrencies &&
                          allCurrencies?.rows?.map(
                            ({ name: currName, currencyId, code }) => (
                              <option key={currencyId} value={code}>
                                {currName}
                              </option>
                            )
                          )}
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
                          Target Currency<span className='text-danger'> *</span>
                        </BForm.Label>

                        <BForm.Select
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.targetCurrencyCode}
                          name='targetCurrencyCode'
                        >
                          <option value=''>Select a Currency</option>
                          {allCurrencies &&
                          allCurrencies?.rows?.map(
                            ({ name: currName, currencyId, code }) => (
                              <option key={currencyId} value={code}>
                                {currName}
                              </option>
                            )
                          )}
                        </BForm.Select>
                        <ErrorMessage
                          component='div'
                          name='targetCurrencyCode'
                          className='text-danger'
                        />
                      </Col>
                    </Row>

                    <div className='mt-4 d-flex justify-content-between align-items-center'>
                      <Button
                        variant='warning'
                        onClick={() =>
                          navigate(AdminRoutes.TransactionsBanking)}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant='success'
                        onClick={handleSubmit}
                        onBlur={handleBlur}
                        className='ml-2'
                      >
                        Submit
                        {loading && (
                          <Spinner
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          </div>
          )}
    </>
  )
}
