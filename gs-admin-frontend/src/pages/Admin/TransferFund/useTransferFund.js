import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { depositToOwnerStart } from '../../../store/redux-slices/transferFund'

const useTransferFund = () => {
  const [sourceCurr, setSourceCurr] = useState('')
  const dispatch = useDispatch()
  const { wallets } = useSelector((state) => state.login)
  const { loading } = useSelector((state) => state.transferFund)

  const getAmount = () =>
    wallets && sourceCurr !== '' &&
    wallets?.rows.find((val) => val.currencyCode === sourceCurr).amount

  const deposit = ({ data }) => dispatch(depositToOwnerStart({ data }))

  return {
    wallets,
    deposit,
    loading,
    sourceCurr,
    setSourceCurr,
    getAmount
  }
}

export default useTransferFund
