import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCurrenciesStart } from '../../../../store/redux-slices/currencies'

const useCurrenciesListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const { allCurrencies } = useSelector((state) => state.currencies)
  const totalPages = Math.ceil(allCurrencies?.count / limit)

  useEffect(() => {
    dispatch(getAllCurrenciesStart({ limit, pageNo: page }))
  }, [limit, page])

  return {
    navigate,
    limit,
    setLimit,
    page,
    setPage,
    allCurrencies,
    totalPages
  }
}

export default useCurrenciesListing
