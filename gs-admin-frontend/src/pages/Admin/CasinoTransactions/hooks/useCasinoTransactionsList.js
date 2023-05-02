import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import useDidMountEffect from '../../../../utils/useDidMountEffect'
import { getAllCurrenciesStart } from '../../../../store/redux-slices/currencies'
import { getSAdminCasinoTransactionsStart } from '../../../../store/redux-slices/superAdminTransactions'
import { getLoginToken } from '../../../../utils/storageUtils'

const useCasinoTransactionsList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isInitialRender = useDidMountEffect()

  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [selectedAction, setSelectedAction] = useState('all')
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const { allCurrencies } = useSelector((state) => state.currencies)
  const { loading, casinoTransactions } = useSelector((state) => state.superAdminTransactions)
  const totalPages = Math.ceil(casinoTransactions?.count / limit)

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

  useEffect(() => {
    !isInitialRender && dispatch(getSAdminCasinoTransactionsStart({
      limit,
      pageNo: page,
      email: search,
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      currencyCode: selectedCurrency,
      transactionType: selectedAction,
      status,
      userId: ''
    }))
  }, [page])

  useEffect(() => {
    setPage(1)
    dispatch(getSAdminCasinoTransactionsStart({
      limit,
      pageNo: 1,
      email: search,
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      currencyCode: selectedCurrency,
      transactionType: selectedAction,
      status,
      userId: ''
    }))
  }, [limit, selectedCurrency, selectedAction, state, status])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender && search !== '') {
        if (page === 1) {
          dispatch(getSAdminCasinoTransactionsStart({
            limit,
            pageNo: page,
            email: search,
            startDate: formatDateYMD(state.map(a => a.startDate)),
            endDate: formatDateYMD(state.map(a => a.endDate)),
            currencyCode: selectedCurrency,
            transactionType: selectedAction,
            status,
            userId: ''
          }))
        } else {
          setPage(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL}/api/admin/get-casino-transactions?csvDownload=true&limit=${limit}&pageNo=${page}&startDate=${formatDateYMD(state.map(a => a.startDate))}&endDate=${formatDateYMD(state.map(a => a.endDate))}&currencyCode=${selectedCurrency}&transactionType=${selectedAction}&status=${status}&email=${search}&token=${getLoginToken()}`

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
    casinoTransactions,
    loading,
    status,
    setStatus,
    getCsvDownloadUrl
  }
}

export default useCasinoTransactionsList
