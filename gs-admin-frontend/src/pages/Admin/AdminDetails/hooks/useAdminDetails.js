import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { getAdminDataStart } from '../../../../store/redux-slices/admins'

const useAdminDetails = () => {
  const [selectedTab, setSelectedTab] = useState('overview')
  const { loading, adminData: adminDetails } = useSelector((state) => state.admins)
  const { adminId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    dispatch(getAdminDataStart({ adminId }))
    if (location?.state?.isTreeView) {
      setSelectedTab('usersTree')
    } else {
      setSelectedTab('overview')
    }
  }, [adminId])

  return {
    setSelectedTab,
    selectedTab,
    adminDetails,
    adminId,
    navigate,
    loading
  }
}

export default useAdminDetails
