import { Button } from '@themesberg/react-bootstrap'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoyaltyPoint from '../../../../../components/LoyaltyPoints/LoyaltyPoint'
import { getloyaltyLevelStart } from '../../../../../store/redux-slices/superAdminSettings'

const LoyaltySettings = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  setSelectedTab,
  setFieldValue,
  touched,
  selectedTab,
  isEdit,
  loyaltyCount,
  setLoyaltyCount
}) => {
  const { loyaltyLevel } = useSelector(state => state.superAdminSettings)
  const { bonusDetail } = useSelector(state => state.bonus)

  const dispatch = useDispatch()
  useEffect(() => {
    (!loyaltyLevel?.length || isEdit) && dispatch(getloyaltyLevelStart())
  }, [])

  useEffect(() => {
    const newLoyaltyLevel = []
    if ((!values?.loyaltyLevel || values?.loyaltyLevel.length < 1) && (values?.bonusType === 'deposit') && selectedTab === 'loyalty') {
      for (const level in loyaltyLevel) {
        const obj = loyaltyLevel[level]
        newLoyaltyLevel.push({ level: obj.level, startPoint: obj.startPoint, endPoint: obj.endPoint, bonusPercentage: obj.cashback_multiplier, cashback_multiplier: values?.wageringMultiplier })
      }
      setFieldValue('loyaltyLevel', newLoyaltyLevel)
    }
  }, [])

  useEffect(() => {
    if (values?.other && bonusDetail?.wageringMultiplier === values?.wageringMultiplier && loyaltyCount < 3) {
      const newLoyaltyLevel = []
      for (const level in loyaltyLevel) {
        const obj = loyaltyLevel[level]
        newLoyaltyLevel.push({ level: obj.level, startPoint: obj.startPoint, endPoint: obj.endPoint, bonusPercentage: values?.other?.[level]?.bonusPercentage, cashback_multiplier: values?.other?.[level]?.cashback_multiplier })
      }
      setFieldValue('loyaltyLevel', newLoyaltyLevel)
      setLoyaltyCount(loyaltyCount + 1)
    }
  }, [loyaltyLevel])

  return (
    <> <LoyaltyPoint
      values={values}
      handleBlur={handleBlur}
      handleChange={handleChange}
      touched={touched}
      bonus
       />
      <div className='mt-4 d-flex justify-content-between align-items-center'>
        <Button
          variant='warning'
          onClick={() => {
            setSelectedTab('currency')
          }}
          className='ml-2'
        >
          Previous
        </Button>
        <Button
          variant='success'
          onClick={handleSubmit}
          className='ml-2'
        >
          Submit
        </Button>
      </div>
    </>
  )
}

export default LoyaltySettings
