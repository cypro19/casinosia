import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrencyByIdStart } from '../../../../store/redux-slices/currencies'

const useEditCurrency = () => {
  const dispatch = useDispatch()
  const { currencyId } = useParams()

  useEffect(() => {
    dispatch(getCurrencyByIdStart({ currencyId }))
  }, [])

  const { currency, loading } = useSelector((state) => state.currencies)

  return {
    currencyId,
    currency,
    loading
  }
}

export default useEditCurrency
