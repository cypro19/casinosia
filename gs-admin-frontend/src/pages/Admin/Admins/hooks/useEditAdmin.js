import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getSAdminDetailsStart } from '../../../../store/redux-slices/admins'
import { updateSAdminUserStart } from '../../../../store/redux-slices/adminUser'
import { getAdmin } from '../../../../utils/apiCalls'

const useEditAdmin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { adminId } = useParams()
  const [adminData, setAdminData] = useState()

  useEffect(() => {
    dispatch(getSAdminDetailsStart())
    async function fetchData () {
      await getAdmin({ adminId }).then((res) => {
        setAdminData(res?.data?.data)
      })
    }
    fetchData()
  }, [])

  const editAdmin = ({ data }) => dispatch(
    updateSAdminUserStart({
      data,
      navigate
    })
  )

  return {
    adminData,
    editAdmin
  }
}

export default useEditAdmin
