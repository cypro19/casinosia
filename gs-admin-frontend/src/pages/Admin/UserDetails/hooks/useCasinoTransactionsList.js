import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import { getAllCurrenciesStart } from '../../../../store/redux-slices/currencies'
import { getSAdminCasinoTransactionsStart } from '../../../../store/redux-slices/superAdminTransactions'
import { getLoginToken } from '../../../../utils/storageUtils'
import { useParams } from 'react-router-dom'

const useCasinoTransactionsList = () => {
  const dispatch = useDispatch()
  const { userId } = useParams()

  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [selectedAction, setSelectedAction] = useState('all')
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
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
    dispatch(getSAdminCasinoTransactionsStart({
      limit,
      pageNo: page,
      email: '',
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      currencyCode: selectedCurrency,
      transactionType: selectedAction,
      status,
      userId
    }))
  }, [limit, page, selectedCurrency, selectedAction, state, status, userId])

  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL}/api/admin/get-casino-transactions?csvDownload=true&limit=${limit}&pageNo=${page}&startDate=${formatDateYMD(state.map(a => a.startDate))}&endDate=${formatDateYMD(state.map(a => a.endDate))}&currencyCode=${selectedCurrency}&transactionType=${selectedAction}&status=${status}&email=&token=${getLoginToken()}&userId=${userId}`

  return {
    allCurrencies,
    setSelectedCurrency,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    setSelectedAction,
    selectedCurrency,
    selectedAction,
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
