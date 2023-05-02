import React from 'react'

import {
  Row,
  Col,
  Form as BForm,
  Button,
  InputGroup
} from '@themesberg/react-bootstrap'
import { ErrorMessage } from 'formik'
import { convertAmountOptions } from './constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getSAConvertAmount } from '../../../../../utils/apiCalls'
import Trigger from '../../../../../components/OverlayTrigger'
import { toast } from '../../../../../components/Toast'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

const CurrenciesForm = ({
  touched,
  errors,
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  setFieldValue,
  setCurr,
  bonusDetail,
  setSelectedTab,
  setActiveTab,
  isEdit,
  enableSubmit,
  setEnableSubmit,
  languages
}) => {
  // const { enableSubmit, setEnableSubmit } = useCreateBonus()
  async function fetchData () {
    const code = Object?.keys(values?.currency)?.[0]
    const maxBonusThreshold = values?.currency?.[code]?.maxBonusThreshold
    const minDeposit = values?.currency?.[code]?.minDeposit
    const maxWinAmount = values?.currency?.[code]?.maxWinAmount
    const zeroOutThreshold = values?.currency?.[code]?.zeroOutThreshold
    const minBalance = values?.currency?.[code]?.minBalance
    if (values?.bonusType !== 'freespins' && values?.bonusType !== 'cashfreespins' && values?.bonusType !== 'joining') {
      if (maxBonusThreshold === '') {
        toast('Enter Max Bonus Claimed', 'error')
      } else if (minDeposit === '') {
        toast('Enter Min Deposit', 'error')
      } else if (maxWinAmount === '') {
        toast('Enter Max Win Amount', 'error')
      } else if (zeroOutThreshold === '') {
        toast('Enter Zero Out Threshold', 'error')
      } else {
        await getSAConvertAmount({
            currencyFields: {
              maxBonusThreshold: maxBonusThreshold || 0,
              minDeposit: minDeposit || 0,
              maxWinAmount: maxWinAmount || 0,
              zeroOutThreshold: zeroOutThreshold || 0,
              minBalance: minBalance || 0
            },
            currencyCode: code
          }).then((res) => {
            setFieldValue('currency', res?.data?.data?.currenciesAmount)
            setCurr(res?.data?.data?.currenciesAmount)
            setEnableSubmit(true)
          })
      }
    } else {
      if (maxWinAmount === '') {
        toast('Enter Max Win Amount', 'error')
      // } else if (zeroOutThreshold === '' && (values?.isSticky === 'true' || values?.isSticky)) {
      //   toast('Enter Zero Out Threshold', 'error')
      } else {
        await getSAConvertAmount({
            currencyFields: {
              maxBonusThreshold: maxBonusThreshold || 0,
              minDeposit: minDeposit || 0,
              maxWinAmount: maxWinAmount || 0,
              zeroOutThreshold: zeroOutThreshold || 0,
              minBalance: minBalance || 0
            },
            currencyCode: code
          }).then((res) => {
            setFieldValue('currency', res?.data?.data?.currenciesAmount)
            setCurr(res?.data?.data?.currenciesAmount)
            setEnableSubmit(true)
          })
      }
    }

  }

  return (
    <>
      {bonusDetail && !enableSubmit && setEnableSubmit(true)}
      <Col className='d-flex justify-content-end'>
        <Trigger message='Fetch according to primary currency'>
          <Button onClick={fetchData}>
            <FontAwesomeIcon icon={faExchangeAlt} />
          </Button>
        </Trigger>
      </Col>
      {values.currency &&
        Object.keys(values.currency).length > 0 &&
        Object.keys(values.currency).map((key, index) => (
          <Row key={index} className='g-2 mb-2'>
            <Col sm='auto' className='d-flex'>
              <Col className='px-1 text-center'>
                {index < 1 && <label style={{ fontSize: '14px' }} htmlFor='currency'>Currency</label>}
                <InputGroup>
                  <BForm.Control
                    name={`currency[${key}]`}
                    value={key}
                    onInput={handleChange}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled
                  />
                </InputGroup>
              </Col>
              {Object.keys(values.currency[key]).map((currKey, currIndex) => {
                let newCurrKey = currKey;
                let hide = ((values?.bonusType === 'deposit')
                  ? (currKey === 'minBalance')
                  : ((values?.bonusType === 'freespins' || values?.bonusType === 'cashfreespins'))
                      ? ((values?.isSticky === 'true' || false) ? (currKey !== 'maxWinAmount' && currKey !== 'zeroOutThreshold') : currKey !== 'maxWinAmount')
                      : currKey === 'minBalance')
                if(values?.bonusType === 'joining') {
                  if(values?.bonusType === 'joining' && currKey === 'maxWinAmount') hide = false
                  else hide = true
                  if(values?.bonusType === 'joining') newCurrKey = 'amount'
                }
                return (
                  currKey !== 'minBonusThreshold' && <Col className='px-1 text-center' key={currIndex} hidden={hide}>
                    {index < 1 && !hide && (
                      <label htmlFor={currKey} style={{ fontSize: '14px' }}>
                        {
                          convertAmountOptions?.find(
                            (val) => val.value === newCurrKey
                          )?.label
                        }
                        <span className='text-danger'> *</span>
                      </label>
                    )}
                    <InputGroup>
                      <BForm.Control
                        name={`currency[${key}][${currKey}]`}
                        value={values.currency[key][currKey]}
                        onInput={handleChange}
                        hidden={hide}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <ErrorMessage
                      component='div'
                      hidden={hide}
                      name={`currency[${key}][${currKey}]`}
                      className='text-danger'
                    />
                  </Col>
                )
              })}
            </Col>
          </Row>
        ))}

      <div className='mt-4 d-flex justify-content-between align-items-center'>
        <Button
          variant='warning'
          onClick={() => {
            setSelectedTab(selectedTab => selectedTab === 'currency' ? (languages?.rows?.length > 1) ? 'languages' : 'general' : 'general')
          }}
          className='ml-2'
        >
          Previous
        </Button>
        {(enableSubmit || isEdit) && (
          <Button
            variant='success'
            onClick={handleSubmit}
            className='ml-2'
          >
            {(values?.bonusType === 'freespins') ? 'Next' : 'Submit'}
          </Button>
        )}
      </div>
    </>
  )
}
export default CurrenciesForm
