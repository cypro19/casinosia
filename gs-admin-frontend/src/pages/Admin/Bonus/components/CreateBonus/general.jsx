import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import {
  Row,
  Col,
  Form as BForm,
  Button,
  InputGroup
} from '@themesberg/react-bootstrap'
import { ErrorMessage } from 'formik'
import DateRangePicker from '../../../../../components/DateRangePicker'
import { bonusType, checkLabels, daysLabels } from './constants'
import Trigger from '../../../../../components/OverlayTrigger'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Parser from 'html-react-parser'
import { useSelector, useDispatch } from 'react-redux'
import { getloyaltyLevel } from '../../../../../utils/apiCalls'

const GeneralForm = ({
  isEdit,
  isClone,
  touched,
  errors,
  values,
  setSubmitting,
  handleChange,
  handleSubmit,
  handleBlur,
  setFieldValue,
  setSelectedTab,
  state,
  setState,
  preview,
  handleImagePreview,
  bonusDetail,
  clone = false,
  navigate,
  setGameIds,
  setEnableSubmit,
  appliedBonusOptions,
  data,
  setData
}) => {
  const { loyaltyLevel } = useSelector(state => state.superAdminSettings)
  const dispatch = useDispatch()

  async function getLoyalty (option) {
    await getloyaltyLevel()
      .then(response => {
        const data = response.data.data.loyaltyLevel
        const newLoyaltyLevel = []
        for (const level in data) {
          const obj = data[level]
          newLoyaltyLevel.push({ level: obj.level, startPoint: obj.startPoint, endPoint: obj.endPoint, bonusPercentage: obj.cashback_multiplier, cashback_multiplier: values?.wageringMultiplier })
        }
        setFieldValue('loyaltyLevel', newLoyaltyLevel)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    if ((isEdit) && appliedBonusOptions?.[0] && appliedBonusOptions?.[0]?.label?.EN !== '') {
      setFieldValue('appliedBonusId', appliedBonusOptions.filter(
        (opt) => JSON.parse(opt.value) === JSON.parse(bonusDetail?.appliedBonusId)
      ))
    }
  }, [appliedBonusOptions])

  useEffect(() => {
    if (bonusDetail?.gameIds && setGameIds) {
      setGameIds(bonusDetail?.gameIds)
    }
  }, [bonusDetail])

  const [err, setErr] = useState('')

  return (
    <>
      <Row className=' mt-3 mb-3'>
        <Col sm={4} className='mb-3'>
          <label
            htmlFor='bonusType'
            className={
              touched.bonusType && errors.bonusType ? 'text-danger' : ''
            }
          >
            Bonus Type<span className='text-danger'> *</span>
          </label>
          <InputGroup
            className={
              touched.bonusType && errors.bonusType
                ? 'border border-danger'
                : ''
            }
          >
            <BForm.Select
              name='bonusType'
              disabled={isEdit || isClone}
              onInput={handleChange}
              onBlur={handleBlur}
              onChange={(e) => {
                handleChange(e)
                setGameIds([])
                if (e.target.value === 'freespins' || e.target.value === 'cashfreespins') {
                  setFieldValue('depositBonusPercent', 1)
                }
                if (e.target.value === 'freespins') {
                  setFieldValue('isSticky', true)
                } else {
                  setFieldValue('isSticky', false)
                }
                setFieldValue('currency', {
                  EUR: {
                    maxBonusThreshold: '',
                    minDeposit: '',
                    maxWinAmount: '',
                    zeroOutThreshold: '',
                    minBalance: ''
                  }
                })
                setEnableSubmit(false)
                setFieldValue('visibleInPromotions', false)
              }}
              value={values.bonusType}
            >
              <option value='' disabled key=''>
                Select Bonus Type
              </option>
              {bonusDetail
                ? <option>{(bonusDetail?.bonusType === 'freespins' && !bonusDetail?.isSticky) ? 'CASH FREESPINS' : bonusType.find(val => val.value === bonusDetail?.bonusType)?.label}</option>
                : bonusType.map((item) => {
                  return (
                    <option key={`bonusType ${item.id}`} value={item.value}>
                      {item.label}
                    </option>
                  )
                })}
            </BForm.Select>
          </InputGroup>
          <ErrorMessage
            component='div'
            name='bonusType'
            className='text-danger'
          />
        </Col>
        <Col sm={4} className='mb-3'>
          <label
            htmlFor='promotionTitle'
            className={
              touched.promotionTitle && errors.promotionTitle
                ? 'text-danger'
                : ''
            }
          >
            Promotion Title<span className='text-danger'> *</span>
          </label>
          <InputGroup
            className={
              touched.promotionTitle && errors.promotionTitle
                ? 'border border-danger'
                : ''
            }
          >
            <BForm.Control
              name='promotionTitle'
              placeholder='Enter Promotion Title'
              defaultValue={values.promotionTitle}
              onInput={handleChange}
              onBlur={handleBlur}
              onChange={(e) => {
                setData({
                  ...data,
                  promoTitle: {
                    ...data?.promoTitle,
                    EN: e.target.value
                  }
                })
                handleChange(e)
              }}
            />
          </InputGroup>
          <ErrorMessage
            component='div'
            name='promotionTitle'
            className='text-danger'
          />
        </Col>
       
        {(values.bonusType === 'deposit') && (
          <Col sm={4} className='mb-3'>
            <label
              htmlFor='depositBonusPercent'
              className={
                touched.depositBonusPercent && errors.depositBonusPercent
                  ? 'text-danger'
                  : ''
              }
            >
              {'Bonus Percentage'}
              <span className='text-danger'> *</span>
            </label>
            <InputGroup
              className={
                touched.depositBonusPercent && errors.depositBonusPercent
                  ? 'border border-danger'
                  : ''
              }
            >
              <BForm.Control
                name='depositBonusPercent'
                type='number'
                min={1}
                placeholder={'Enter Bonus Percentage'}
                defaultValue={values.depositBonusPercent}
                onInput={handleChange}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </InputGroup>
            <ErrorMessage
              component='div'
              name='depositBonusPercent'
              className='text-danger'
            />
          </Col>
        )}

        

        {values.bonusType !== 'joining'
          ? (
              (
                <>
                  {(values.bonusType === 'freespins' || values?.bonusType === 'cashfreespins') && (
                    <Col sm={4} className='mb-3'>
                      <label
                        htmlFor='quantity'
                        className={
                  touched.quantity && errors.quantity ? 'text-danger' : ''
                }
                      >
                        Quantity<span className='text-danger'> *</span>
                      </label>
                      <InputGroup
                        className={
                  touched.quantity && errors.quantity
                    ? 'border border-danger'
                    : ''
                }
                      >
                        <BForm.Control
                          name='quantity'
                          type='number'
                          min={1}
                          placeholder='Enter Quantity'
                          defaultValue={values.quantity}
                          onInput={handleChange}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      <ErrorMessage
                        component='div'
                        name='quantity'
                        className='text-danger'
                      />
                    </Col>)}
                  {(values?.bonusType !== 'freespins')
                    ? (
                      <Col sm={4} className='mb-3'>
                        <label
                          htmlFor='wageringMultiplier'
                          className={
                  touched.wageringMultiplier && errors.wageringMultiplier
                    ? 'text-danger'
                    : ''
                }
                        >
                          Wagering Multiplier<span className='text-danger'> *</span>
                        </label>
                        <InputGroup
                          className={
                  touched.wageringMultiplier && errors.wageringMultiplier
                    ? 'border border-danger'
                    : ''
                }
                        >
                          <BForm.Control
                            name='wageringMultiplier'
                            type='number'
                            min={1}
                            placeholder='Enter Wagering Multiplier'
                            value={values.wageringMultiplier}
                            onInput={handleChange}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              handleChange(e)
                              if (values?.bonusType === 'deposit') {
                                const newLoyaltyLevel = []
                                for (const level in loyaltyLevel) {
                                  const obj = loyaltyLevel[level]
                                  newLoyaltyLevel.push({ level: obj.level, startPoint: obj.startPoint, endPoint: obj.endPoint, bonusPercentage: obj.cashback_multiplier, cashback_multiplier: e.target.value })
                                }
                                setFieldValue('loyaltyLevel', newLoyaltyLevel)
                              }
                            }}
                          />
                        </InputGroup>
                        <ErrorMessage
                          component='div'
                          name='wageringMultiplier'
                          className='text-danger'
                        />
                      </Col>)
                    : (values?.isSticky && values.bonusType !== 'freespins' &&
                      <Col sm={4} className='mb-3'>
                        <label
                          htmlFor='wageringMultiplier'
                          className={
                  touched.wageringMultiplier && errors.wageringMultiplier
                    ? 'text-danger'
                    : ''
                }
                        >
                          Wagering Multiplier<span className='text-danger'> *</span>
                        </label>
                        <InputGroup
                          className={
                  touched.wageringMultiplier && errors.wageringMultiplier
                    ? 'border border-danger'
                    : ''
                }
                        >
                          <BForm.Control
                            name='wageringMultiplier'
                            type='number'
                            min={1}
                            placeholder='Enter Wagering Multiplier'
                            value={values.wageringMultiplier}
                            onInput={handleChange}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        </InputGroup>
                        <ErrorMessage
                          component='div'
                          name='wageringMultiplier'
                          className='text-danger'
                        />
                      </Col>)}
                </>
              )
            )
          : null}
        
{(values?.bonusType === 'freespins' || values?.bonusType === 'cashfreespins') &&
          <Col sm={4} className='mb-3'>
            <label
              htmlFor='betLevel'
              className={
              touched.betLevel && errors.betLevel ? 'text-danger' : ''
            }
            >
              Bet Level<span className='text-danger'> *</span>
            </label>
            <InputGroup
              className={
              touched.betLevel && errors.betLevel
                ? 'border border-danger'
                : ''
            }
            >
              <BForm.Control
                name='betLevel'
                type='number'
                min={1}
                placeholder='Enter Bet Level'
                value={values.betLevel}
                onInput={handleChange}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </InputGroup>
            <ErrorMessage
              component='div'
              name='betLevel'
              className='text-danger'
            />
          </Col>}
          {values?.bonusType === 'deposit' &&
        <Col sm={4} className='mb-3'>
          <label
            htmlFor='daysToClear'
            className={
              touched.daysToClear && errors.daysToClear ? 'text-danger' : ''
            }
          >
            Days To Clear<span className='text-danger'> *</span>
          </label>
          <InputGroup
            className={
              touched.daysToClear && errors.daysToClear
                ? 'border border-danger'
                : ''
            }
          >
            <BForm.Control
              name='daysToClear'
              type='number'
              min={1}
              placeholder='Enter Days To Clear'
              value={values.daysToClear}
              onInput={handleChange}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </InputGroup>
          <ErrorMessage
            component='div'
            name='daysToClear'
            className='text-danger'
          />
        </Col>
        }
        {(values?.bonusType !== 'deposit') &&
          <Col sm={4} className='mb-3'>
            <label
              className={
              touched.bonusType && errors.bonusType ? 'text-danger' : ''
            }
            >
              Bonus Validity<span className='text-danger'> *</span>
            </label>
            <InputGroup
              className={
              touched.bonusType && errors.bonusType
                ? 'border border-danger'
                : ''
            }
            >
              <DateRangePicker
                width='auto'
                state={state}
                setState={setState}
                size='md'
              />
            </InputGroup>
          </Col>}

        {/* <Col>
          <label
            htmlFor="providers"
            className={
              touched.providers && errors.providers ? "text-danger" : ""
            }
          >
            Providers<span className="text-danger"> *</span>
          </label>
          <Select
            isMulti
            isClearable={false}
            name="providers"
            value={values.providers}
            options={providerOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(option, e) => {
              setFieldValue("providers", option);
            }}
          />
        </Col>
        <Col sm={12}>
          <label
            htmlFor="games"
            className={touched.games && errors.games ? "text-danger" : ""}
          >
            Games<span className="text-danger"> *</span>
          </label>
          <Select
            isMulti
            isClearable={false}
            name="games"
            value={values.games}
            options={gameOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(option, e) => {
              setFieldValue("games", option);
            }}
          />
        </Col> */}
        
      </Row>

      <Row className='mb-3'>
        <Col>
          <label
            htmlFor='termCondition'
            className={
              touched.termCondition && errors.termCondition
                ? 'text-danger'
                : ''
            }
          >
            Terms & Conditions<span className='text-danger'> *</span>
          </label>
          <ReactQuill
            name='termCondition'
            placeholder='Enter Terms and Conditions'
            value={values.termCondition}
            onChange={(e) => {
              setFieldValue('termCondition', e.replace(/\s/g, '&nbsp;'))
              setData({
                ...data,
                terms: {
                  ...data?.terms,
                  EN: e.replace(/\s/g, '&nbsp;')
                }
              })
            }}
            onKeyDown={() => setErr('')}
          />

          {err &&
            <div className='text-danger'>{err}</div>}

          {!err &&
            <ErrorMessage
              component='div'
              name='termCondition'
              className='text-danger'
            />}
        </Col>
      </Row>
      
      <Row className='mb-3'>
        {checkLabels(values.bonusType).map(({ label, value, message }) => {
          return (
            <Col
              key={`Checked ${label}`}
              sm={3}
              className='d-flex justify-content-start mb-3'
            >
              <Trigger message={message}>
                <Col xs='auto'>
                  <label htmlFor={value}>
                    {label}
                  </label>
                </Col>
              </Trigger>
              <Col sm={4} className='mb-3' style={{marginLeft: '7px'}}>
                <BForm.Check
                  name={value}
                  type='switch'
                  checked={values[value]}
                  onChange={(e) => {
                    handleChange(e)
                    if (label === 'Visible In Promotions') {
                      setFieldValue('validOnDays', [])
                    }
                  }}
                />
              </Col>
            </Col>
          )
        })}
      </Row>

      
      {values?.visibleInPromotions &&
        <Row className='mb-3'>
          <label
            htmlFor='days'
            className={
            'mb-2' && touched.validOnDays && errors.validOnDays
              ? 'text-danger'
              : ''
          }
          >
            Valid on Days
            <span className='text-danger'> *</span>
          </label>
          <ErrorMessage
            component='div'
            name='validOnDays'
            className='text-danger'
          />
          {daysLabels.map((days) => {
            return (
              <Col className='d-flex  mb-3' key={days}>
                <Col className='d-flex'>
                  <BForm.Check
                    name={days}
                    type='checkbox'
                    defaultChecked={
                    values?.validOnDays && values?.validOnDays.includes(days)
                  }
                    onChange={(e) => {
                      if (e.target.checked) {
                        values?.validOnDays?.length
                          ? setFieldValue('validOnDays', [
                            ...values.validOnDays,
                            e.target.name
                          ])
                          : setFieldValue('validOnDays', [
                            e.target.name
                          ])
                      } else {
                        setFieldValue(
                          'validOnDays',
                          values.validOnDays.filter(
                            (days) => days !== e.target.name
                          )
                        )
                      }
                    }}
                  />
                  <label className='mx-2' htmlFor={days}>
                    {days}
                  </label>
                </Col>
              </Col>
            )
          })}
        </Row>}
     

      <Row className='mb-3'>
        <Col>
          <label
            htmlFor='description'
            className={
              touched.description && errors.description ? 'text-danger' : ''
            }
          >
            Description<span className='text-danger'> *</span>
          </label>
          <InputGroup
            className={
              touched.description && errors.description
                ? 'border border-danger'
                : ''
            }
          >
            <BForm.Control
              as='textarea'
              name='description'
              placeholder='Enter Description'
              defaultValue={values.description}
              onInput={handleChange}
              onBlur={handleBlur}
              onChange={(e) => {
                setData({
                  ...data,
                  desc: {
                    ...data?.desc,
                    EN: e.target.value
                  }
                })
                handleChange(e)
              }}
            />
          </InputGroup>
          <ErrorMessage
            component='div'
            name='description'
            className='text-danger'
          />
        </Col>

        <Col>
          <label
            htmlFor='bonusImage'
            className={
              touched.bonusImage && errors.bonusImage ? 'text-danger' : ''
            }
          >
            Bonus Image<span className='text-danger'> *</span>
          </label>
          <InputGroup
            className={
              touched.bonusImage && errors.bonusImage
                ? 'border border-danger'
                : ''
            }
          >
            <BForm.Control
              name='bonusImage'
              type='file'
              placeholder='Image'
              // value={values.bonusImage}
              onInput={handleChange}
              onBlur={handleBlur}
              onChange={(event) => {
                setFieldValue('bonusImage', event.currentTarget.files[0])
                handleImagePreview(event)
              }}
            />
          </InputGroup>
          <ErrorMessage
            component='div'
            name='bonusImage'
            className='text-danger'
          />
        </Col>
        <Col>
          {!clone &&
            !errors.bonusImage &&
            (preview?.image_preview
              ? (
                <img
                  src={preview?.image_preview}
                  width='150'
                  height='150'
                  className='mt-2 border-0'
                />
                )
              : (
                  bonusDetail &&
              bonusDetail?.imageUrl && !isClone && (
                <img
                  src={bonusDetail?.imageUrl}
                  width='150'
                  height='150'
                  className='mt-2 border-0'
                />
                  )
                ))}
        </Col>
      </Row>
      <div className='mt-4 d-flex justify-content-between'>
        <Button
          variant='warning'
          onClick={() => navigate(-1)}
          className='ml-2'
        >
          Cancel
        </Button>
        <Button
          className='ml-2'
          variant='success'
          onClick={() => {
            if (!errors.termCondition) {
              if (!Parser(values.termCondition).length && (Parser(values.termCondition)?.props?.children?.length < 1 || Parser(values.termCondition)?.props?.children?.props?.children === null)) {
                setErr('Terms and Conditions Required')
              } else {
                setErr('')
                handleSubmit()
              }
            } else {
              setErr('Terms and Conditions Required')
            }
          }}

        >
          Next
        </Button>
      </div>
    </>
  )
}
export default GeneralForm
