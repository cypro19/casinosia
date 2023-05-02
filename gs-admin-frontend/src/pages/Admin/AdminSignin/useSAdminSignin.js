import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { superAdminLoginStart } from '../../../store/redux-slices/login'
import { getLoginToken, removeLoginToken, getItem } from '../../../utils/storageUtils'
import { AdminRoutes } from '../../../routes'

const useSAdminSignin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.login)

  useEffect(() => {
    if (getLoginToken() && getItem('role') === 'Super Admin') {
      navigate(AdminRoutes.Dashboard)
    } else {
      removeLoginToken()
    }
  }, [])

  const handleSignIn = ({ email, password }) =>
    dispatch(superAdminLoginStart({ email, password, navigate }))

  return {
    loading,
    handleSignIn
  }
}

export default useSAdminSignin
