import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getSAdminTransactionUsers } from '../../../../utils/apiCalls'
import { getAllCurrenciesStart } from '../../../../store/redux-slices/currencies'
import { toast } from '../../../../components/Toast'

const useDeposit = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [targetEmail, setTargetEmail] = useState('')

  const { loading, allCurrencies } = useSelector((state) => state.currencies)

  const loadOptions = async (inputValue) => {
    if (targetEmail !== '') {
      setTargetEmail('')
    }
    if (inputValue.length > 3) {
      const { data } = await getSAdminTransactionUsers({ email: inputValue })
      return data?.data?.transactionUsers
    }
  }

  const formSubmitHandler = (formData) => {
    if (targetEmail === '') {
      toast('Please Select Target Email', 'error')
    } else {
      console.log({ ...formData, toOwnerId: targetEmail?.admin_user_id })
    }
  }

  useEffect(() => {
    dispatch(getAllCurrenciesStart({ limit: '', pageNo: '' }))
  }, [])

  return {
    loading,
    navigate,
    allCurrencies,
    loadOptions,
    setTargetEmail,
    formSubmitHandler
  }
}

export default useDeposit
