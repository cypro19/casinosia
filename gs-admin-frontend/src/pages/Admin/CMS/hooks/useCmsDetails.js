import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCmsByPageIdStart } from '../../../../store/redux-slices/fetchData'

const useCmsDetails = () => {
  const { cmsPageId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { cmsByPageIdData, loading } = useSelector((state) => state?.fetch)

  useEffect(() => {
    dispatch(getCmsByPageIdStart({ cmsPageId }))
  }, [])

  return {
    cmsByPageIdData,
    loading,
    navigate
  }
}

export default useCmsDetails
