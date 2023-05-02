import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllGroupsStart } from '../../../../store/redux-slices/adminUser'
import { getAdminDetailsStart, getAllAdminsStart, getSAdminDetailsStart } from '../../../../store/redux-slices/admins'

const useAdminUserForm = ({ group }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [type, setType] = useState('password')
  const { adminRole } = useSelector((state) => state.login)
  const { data, adminDetails, loading } = useSelector((state) => state.admins)
  const { groups } = useSelector((state) => state.adminUser)
  const [groupOptions, setGroupOptions] = useState()
  const [selectedGroup, setSelectedGroup] = useState()

  const permissionLabel = (label) => {
    switch (label) {
      case 'C':
        return 'Create'
      case 'R':
        return 'Read'
      case 'U':
        return 'Update'
      case 'D':
        return 'Delete'
      case 'T':
        return 'Toggle Status'
      case 'A':
        return 'Apply'
      case 'CC':
        return 'Create Custom'
      case 'AB':
        return 'Manage Wallet'
      case 'SR':
        return 'Limit'
      case 'TE':
        return 'Test Email'
      default:
        return label
    }
  }

  useEffect(() => {
    dispatch(getAllGroupsStart())
    if (group) {
      setSelectedGroup({ label: group, value: group })
    }
  }, [])

  useEffect(() => {
    if (groups.length > 0) {
      const options = []
      groups.map((g) => {
        if (g !== '' && g !== null) {
          options.push({ label: g, value: g })
        }
      })
      setGroupOptions(options)
    }
  }, [groups])

  const superAdminDetails = () => dispatch(getSAdminDetailsStart())
  const getAllAdmins = ({
    limit,
    pageNo,
    sort,
    orderBy,
    search,
    superRoleId,
    superAdminId
  }) => dispatch(
    getAllAdminsStart({
      limit,
      pageNo,
      sort,
      orderBy,
      search,
      superRoleId,
      superAdminId
    })
  )

  const getAdminDetails = ({ adminId }) => dispatch(getAdminDetailsStart({ adminId }))

  return {
    navigate,
    dispatch,
    adminRole,
    data,
    adminDetails,
    permissionLabel,
    superAdminDetails,
    getAllAdmins,
    getAdminDetails,
    loading,
    type,
    setType,
    groupOptions,
    setGroupOptions,
    selectedGroup,
    setSelectedGroup
  }
}

export default useAdminUserForm
