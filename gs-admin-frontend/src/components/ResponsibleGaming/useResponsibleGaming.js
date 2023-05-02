import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { disableUserStart, updateLimitsStart } from '../../store/redux-slices/adminTUsers'

const useResponsibleGaming = ({ userLimits }) => {
  const { userId } = useParams()
  const dispatch = useDispatch()

  const [limit, setLimit] = useState({})
  const [data, setData] = useState('')
  const [limitModal, setLimitModal] = useState(false)
  const [resetModal, setResetModal] = useState(false)
  const [exclusionModal, setExclusionModal] = useState(false)

  const limitLabels = [
    { label: 'Daily Wager Limit', value: userLimits?.dailyBetLimit, minimum: 0 },
    { label: 'Weekly Wager Limit', value: userLimits?.weeklyBetLimit, minimum: userLimits?.dailyBetLimit },
    { label: 'Monthly Wager Limit', value: userLimits?.monthlyBetLimit, minimum: userLimits?.weeklyBetLimit },
    { label: 'Daily Deposit Limit', value: userLimits?.dailyDepositLimit, minimum: 0 },
    { label: 'Weekly Deposit Limit', value: userLimits?.weeklyDepositLimit, minimum: userLimits?.dailyDepositLimit },
    { label: 'Monthly Deposit Limit', value: userLimits?.monthlyDepositLimit, minimum: userLimits?.weeklyDepositLimit },
    { label: 'Daily Loss Limit', value: userLimits?.dailyLossLimit, minimum: 0 },
    { label: 'Weekly Loss Limit', value: userLimits?.weeklyLossLimit, minimum: userLimits?.dailyLossLimit },
    { label: 'Monthly Loss Limit', value: userLimits?.monthlyLossLimit, minimum: userLimits?.weeklyLossLimit }
  ]

  const getData = ({ limit, reset, label }) => {
    const timePeriod = label?.split(' ')?.[0]?.toLowerCase()
    const type = label?.split(' ')?.[1]?.toLowerCase()
    let data = {}
    if (type === 'wager') {
      data = {
        userId,
        dailyLimit: limit,
        timePeriod,
        reset,
        type
      }
    } else if (type === 'deposit') {
      data = {
        userId,
        depositLimit: limit,
        timePeriod,
        reset,
        type
      }
    } else {
      data = {
        userId,
        lossLimit: limit,
        timePeriod,
        reset,
        type
      }
    }
    return data
  }

  const resetLimit = (label) => {
    const data = getData({ limit: '1', reset: true, label })
    dispatch(updateLimitsStart({
      data
    }))
  }

  const updateLimit = ({ formValues, label }) => {
    const data = getData({ limit: formValues?.limit, reset: false, label })
    dispatch(updateLimitsStart({
      data
    }))
  }

  const setDisableUser = ({ formValues, reset, type }) => {
    let data = {}
    if (type === 'SELF_EXCLUSION') {
      data = {
        type,
        userId,
        reset,
        days: formValues?.permanent === 'true' ? -1 : formValues?.days * 30
      }
    } else if (type === 'TAKE_A_BREAK') {
      data = {
        type: 'TAKE_A_BREAK',
        userId,
        reset: false,
        days: formValues?.limit
      }
    } else {
      data = {
        userId,
        timeLimit: formValues?.limit,
        reset: false
      }
    }
    dispatch(disableUserStart({ data }))
  }

  const resetDisableUser = (type) => {
    let data = {}
    if (type === 'Self Exclusion') {
      data = {
        userId,
        type: 'SELF_EXCLUSION',
        days: 0,
        reset: true
      }
    } else if (type === 'Take A Break') {
      data = {
        userId,
        type: 'TAKE_A_BREAK',
        days: 0,
        reset: true
      }
    } else {
      data = {
        userId,
        timeLimit: 1,
        reset: true
      }
    }
    dispatch(disableUserStart({ data }))
  }

  const handleYes = (label) => {
    (label != 'Take A Break' && label != 'Self Exclusion' && label != 'Session Limit')
      ? resetLimit(label)
      : resetDisableUser(label)
  }

  return {
    limitLabels,
    setLimit,
    resetLimit,
    setLimitModal,
    limitModal,
    limit,
    updateLimit,
    resetDisableUser,
    exclusionModal,
    setExclusionModal,
    setDisableUser,
    resetModal,
    setResetModal,
    handleYes,
    data,
    setData
  }
}

export default useResponsibleGaming
