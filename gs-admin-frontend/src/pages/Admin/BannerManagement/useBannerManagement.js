import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllSABannersStart, updateSABannerStart, uploadSABannerStart } from '../../../store/redux-slices/superAdminSettings'

const useBannerManagement = () => {
  const { loading, SABanners } = useSelector(state => state.superAdminSettings)
  const [type, setType] = useState('')
  const [data, setData] = useState({})
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllSABannersStart({
      limit: '',
      pageNo: '',
    }))
  }, [])

  const handleCreateEdit = (type, data) => {
    setType(type)
    setData(data)
    setShow(true)
  }

  const createUpdate = (data) => {
    type === 'Create'
      ? dispatch(uploadSABannerStart({
        data: {
          bannerKey: data?.bannerType,
          image: data?.thumbnail
        },
        limit: '',
        pageNo: ''
      }))
      : dispatch(updateSABannerStart({
        data: {
          bannerKey: data?.bannerType,
          image: data?.thumbnail
        },
        limit: '',
        pageNo: ''
      }))
  }

  return {
    loading,
    SABanners,
    handleCreateEdit,
    type,
    data,
    setShow,
    show,
    createUpdate,
    dispatch
  }
}

export default useBannerManagement
