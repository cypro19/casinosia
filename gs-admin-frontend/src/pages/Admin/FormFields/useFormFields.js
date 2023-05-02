import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGlobalRegistrationStart, updateGlobalRegistrationStart } from '../../../store/redux-slices/fetchData'

const useFormFields = () => {
  const dispatch = useDispatch()

  const { formFields, loading } = useSelector((state) => state.fetch)

  const [data, setData] = useState(null)

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.checked ? 2 : 0
    })
  }

  const updateFields = () => {
    dispatch(updateGlobalRegistrationStart({ data }))
  }

  useEffect(() => {
    setData(formFields)
  }, [formFields])

  useEffect(() => {
    dispatch(getGlobalRegistrationStart())
  }, [])

  return {
    formFields,
    loading,
    data,
    setData,
    handleChange,
    updateFields
  }
}

export default useFormFields
