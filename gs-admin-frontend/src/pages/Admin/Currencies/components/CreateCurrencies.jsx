import React from 'react'
import {
  Button,
  Form as BForm,
  InputGroup,
  Spinner
} from '@themesberg/react-bootstrap'
import { Formik, Form, ErrorMessage } from 'formik'

import { AdminRoutes } from '../../../../routes'
import { createCurrencySchema } from '../schema'
import useCreateCurrencies from '../hooks/useCreateCurriences'

export default ({
  name: editName,
  code: editCode,
  exchangeRate: editExchangeRate,
  symbol: editSymbol,
  type: editType,
  currencyId,
  isPrimary: editIsPrimary,
  loyaltyPoint: editLoyaltyPoint
}) => {
  const { navigate, editCurrency, createCurrencies, loading } =
    useCreateCurrencies()

  return (
    <>
      <h3>
        {currencyId ? 'Edit Currency' : 'Create Currency'}
      </h3>

      <Formik
        initialValues={{
          name: editName || '',
          code: editCode || '',
          symbol: editSymbol || '',
          exchangeRate: editExchangeRate || '',
          type: editType || 0,
          loyaltyPoint: editLoyaltyPoint ? String(editLoyaltyPoint) : '0'
        }}
        validationSchema={createCurrencySchema(editName)}
        onSubmit={({ name, code, exchangeRate, symbol, type, dailyLimit, loyaltyPoint }) => {
          currencyId
            ? editCurrency({
              currencyId,
              name,
              code,
              exchangeRate,
              symbol,
              type: Number(type),
              isPrimary: editIsPrimary,
              loyaltyPoint,
              navigate
            })
            : createCurrencies({
              name,
              code,
              exchangeRate,
              symbol,
              type: Number(type),
              isPrimary: false,
              loyaltyPoint,
              navigate
            })
        }}
      >
        {({
          touched,
          errors,
          values,
          handleChange,
          handleSubmit,
          handleBlur
        }) => (
          <div className='m-4'>
            <Form>
              {/* Div for name */}
              <div className='form-group mb-2'>
                <label
                  htmlFor='name'
                  className={touched.name && errors.name ? 'text-danger' : ''}
                >
                  <b>Name</b>
                  <span className='text-danger'> *</span>
                </label>

                <InputGroup
                  className={
                      touched.name && errors.name ? 'border border-danger' : ''
                    }
                >
                  <BForm.Control
                    name='name'
                    required
                    type='text'
                    placeholder='Enter name of Currency'
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </InputGroup>

                <ErrorMessage
                  component='div'
                  name='name'
                  className='text-danger'
                />
              </div>

              {/* Div for code */}
              <div className='form-group pt-2 mb-2'>
                <label
                  htmlFor='code'
                  className={touched.code && errors.code ? 'text-danger' : ''}
                >
                  <b>Code</b>
                  <span className='text-danger'> *</span>
                </label>

                <InputGroup
                  className={
                      touched.code && errors.code ? 'border border-danger' : ''
                    }
                >
                  <BForm.Control
                    name='code'
                    required
                    type='text'
                    placeholder='Enter currency Code'
                    value={values.code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!!editName}
                  />
                </InputGroup>

                <ErrorMessage
                  component='div'
                  name='code'
                  className='text-danger'
                />
              </div>

              {/* Div for Symbol */}
              <div className='form-group pt-2 mb-2'>
                <label
                  htmlFor='symbol'
                  className={
                      touched.symbol && errors.symbol ? 'text-danger' : ''
                    }
                >
                  <b>Symbol</b>
                  <span className='text-danger'> * </span>
                </label>

                <InputGroup
                  className={
                      touched.symbol && errors.symbol
                        ? 'border border-danger'
                        : ''
                    }
                >
                  <BForm.Control
                    name='symbol'
                    required
                    type='text'
                    placeholder='Enter currency symbol'
                    value={values.symbol}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </InputGroup>

                <ErrorMessage
                  component='div'
                  name='symbol'
                  className='text-danger'
                />
              </div>

              {/* Div for exchangeRate */}
              <div className='form-group pt-2 mb-3'>
                <label
                  htmlFor='exchangeRate'
                  className={
                      touched.exchangeRate && errors.exchangeRate
                        ? 'text-danger'
                        : ''
                    }
                >
                  <b>Exchange Rate</b>
                  <span className='text-danger'> *</span>
                  (with base currency Euro)
                </label>

                <InputGroup
                  className={
                      touched.exchangeRate && errors.exchangeRate
                        ? 'border border-danger'
                        : ''
                    }
                >
                  <BForm.Control
                    name='exchangeRate'
                    required
                    type='text'
                    placeholder='Enter currency Exchange Rate'
                    value={values.exchangeRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </InputGroup>

                <ErrorMessage
                  component='div'
                  name='exchangeRate'
                  className='text-danger'
                />
              </div>

              {/* Div for loyaltyPoint */}
              <div className='form-group pt-2 mb-3'>
                <label
                  htmlFor='loyaltyPoint'
                  className={
                      touched.loyaltyPoint && errors.loyaltyPoint
                        ? 'text-danger'
                        : ''
                    }
                >
                  <b>Loyalty Point</b>
                  <span className='text-danger'> *</span>
                </label>

                <InputGroup
                  className={
                      touched.loyaltyPoint && errors.loyaltyPoint
                        ? 'border border-danger'
                        : ''
                    }
                >
                  <BForm.Control
                    name='loyaltyPoint'
                    required
                    type='text'
                    min={0}
                    placeholder='Enter Loyalty Point'
                    value={values.loyaltyPoint}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </InputGroup>

                <ErrorMessage
                  component='div'
                  name='loyaltyPoint'
                  className='text-danger'
                />
              </div>

              {/* Div for type */}
              <div className='form-group mb-2'>
                <label
                  htmlFor='type'
                  className={touched.type && errors.type ? 'text-danger' : ''}
                >
                  <b>Type</b>
                  <span className='text-danger'> *</span>
                </label>

                <InputGroup
                  className={
                      touched.type && errors.type ? 'border border-danger' : ''
                    }
                >
                  <BForm.Select
                    name='type'
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value='' disabled>
                      ---Select Type---
                    </option>
                    <option value={0}>Crypto</option>
                    <option value={1}>Fiat</option>
                  </BForm.Select>
                </InputGroup>

                <ErrorMessage
                  component='div'
                  name='type'
                  className='text-danger'
                />
              </div>

              <div className='mt-4 d-flex justify-content-between align-items-center'>
                <Button
                  variant='warning'
                  onClick={() => navigate(AdminRoutes.Currencies)}
                >
                  Cancel
                </Button>
                <Button
                  variant='success'
                  onClick={handleSubmit}
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
          </div>
        )}
      </Formik>
    </>
  )
}
