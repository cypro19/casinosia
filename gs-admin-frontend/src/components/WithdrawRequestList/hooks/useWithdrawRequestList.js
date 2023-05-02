import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getAllWithdrawRequestStart } from '../../../store/redux-slices/adminUser'
import { getDateDaysAgo, formatDateYMD } from '../../../utils/dateFormatter'
import useDidMountEffect from '../../../utils/useDidMountEffect'

const useWithdrawRequestList = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(10),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const [paymentProvider, setPaymentProvider] = useState('')
  const { withdrawRequests, loading } = useSelector((state) => state.adminUser)
  const isInitialRender = useDidMountEffect()
  const totalPages = Math.ceil(withdrawRequests?.count / limit)
  const isSAdmin = location.pathname.includes('admin')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (page === 1) {
          dispatch(getAllWithdrawRequestStart({
            limit,
            page,
            name,
            status,
            startDate: formatDateYMD(state.map(a => a.startDate)),
            endDate: formatDateYMD(state.map(a => a.endDate)),
            paymentProvider,
          }))
        } else {
          setPage(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [name, paymentProvider])

  useEffect(() => {
    setPage(1)
    dispatch(getAllWithdrawRequestStart({
      limit,
      page,
      name,
      status,
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      paymentProvider,
    }))
  }, [limit, status, state])

  useEffect(() => {
    !isInitialRender && dispatch(getAllWithdrawRequestStart({
      limit,
      page,
      name,
      status,
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      paymentProvider
    }))
  }, [page])

  const resetFilter = () => {
    setLimit(15)
    setPage(1)
    setName('')
    setStatus('')
    setPaymentProvider('')
    setState([
      {
        startDate: getDateDaysAgo(10),
        endDate: new Date(),
        key: 'selection'
      }
    ])
  }

  const getStatus = (status) => {
    switch (status) {
      case 0:
        return 'Pending'

      case 5:
        return 'Approved'

      case 2:
        return 'Cancelled'
    }
  }

  return {
    limit,
    page,
    name,
    status,
    state,
    paymentProvider,
    withdrawRequests,
    setLimit,
    setPage,
    setName,
    setStatus,
    setState,
    setPaymentProvider,
    loading,
    totalPages,
    resetFilter,
    getStatus,
    isSAdmin
  }
}

export default useWithdrawRequestList
