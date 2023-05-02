import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  createCurrenciesStart,
  editCurrencyStart
} from '../../../../store/redux-slices/currencies'

const useCreateCurrencies = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.currencies)

  const editCurrency = (data) =>
    dispatch(
      editCurrencyStart(data)
    )

  const createCurrencies = (data) =>
    dispatch(
      createCurrenciesStart(data)
    )

  return {
    navigate,
    editCurrency,
    createCurrencies,
    loading
  }
}

export default useCreateCurrencies
