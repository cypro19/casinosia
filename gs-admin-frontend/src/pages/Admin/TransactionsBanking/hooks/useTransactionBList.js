import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllCurrenciesStart } from '../../../../store/redux-slices/currencies'
import { getAllSAdminTransactionsStart } from '../../../../store/redux-slices/superAdminTransactions'
import { getDateDaysAgo, formatDateYMD } from '../../../../utils/dateFormatter'
import { AdminRoutes } from '../../../../routes'
import { getLoginToken } from '../../../../utils/storageUtils'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const useTransactionBList = ({ isUserDetail }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userId } = useParams()

  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState('')
  const { allCurrencies } = useSelector((state) => state.currencies)
  const { loading, transactions } = useSelector((state) => state.superAdminTransactions)
  const totalPages = Math.ceil(transactions?.count / limit)
  const isInitialRender = useDidMountEffect()

  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(10),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  useEffect(() => {
    dispatch(getAllCurrenciesStart({ limit: '', pageNo: '' }))
  }, [])

  const onDeposit = () => {
    navigate(AdminRoutes.Deposit)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (selectedPaymentProvider.length > 2) {
        dispatch(getAllSAdminTransactionsStart({
          limit,
          pageNo: page,
          search,
          startDate: formatDateYMD(state.map(a => a.startDate)),
          endDate: formatDateYMD(state.map(a => a.endDate)),
          currencyId: selectedCurrency,
          transactionType: selectedAction,
          paymentProvider: selectedPaymentProvider,
          isUserDetail,
          userId,
          status
        }))
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [selectedPaymentProvider])

  useEffect(() => {
    !isInitialRender && dispatch(getAllSAdminTransactionsStart({
      limit,
      pageNo: page,
      search,
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      currencyId: selectedCurrency,
      transactionType: selectedAction,
      paymentProvider: selectedPaymentProvider,
      isUserDetail,
      userId,
      status
    }))
  }, [page])

  useEffect(() => {
    setPage(1)
    dispatch(getAllSAdminTransactionsStart({
      limit,
      pageNo: 1,
      search,
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      currencyId: selectedCurrency,
      transactionType: selectedAction,
      paymentProvider: selectedPaymentProvider,
      isUserDetail,
      userId,
      status
    }))
  }, [limit, selectedCurrency, selectedAction, state, search, status])

  const getCsvDownloadUrl = (player) => {
    if (player) {
      return `${process.env.REACT_APP_API_URL}/api/admin/get-transactions?csvDownload=true&limit=${limit}&pageNo=${page}&actioneeType=${search}&startDate=${formatDateYMD(state.map(a => a.startDate))}&endDate=${formatDateYMD(state.map(a => a.endDate))}&currencyCode=${selectedCurrency}&transactionType=${selectedAction}&paymentProvider=${selectedPaymentProvider}&token=${getLoginToken()}&userId=${userId}`
    } else {
      return `${process.env.REACT_APP_API_URL}/api/admin/get-transactions?csvDownload=true&limit=${limit}&pageNo=${page}&actioneeType=${search}&startDate=${formatDateYMD(state.map(a => a.startDate))}&endDate=${formatDateYMD(state.map(a => a.endDate))}&currencyCode=${selectedCurrency}&transactionType=${selectedAction}&paymentProvider=${selectedPaymentProvider}&token=${getLoginToken()}`
    }
  }

  return {
    allCurrencies,
    setSelectedCurrency,
    setSearch,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    setSelectedAction,
    navigate,
    selectedCurrency,
    selectedAction,
    search,
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
  }
}

export default useTransactionBList
