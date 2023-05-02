import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createCmsStart } from '../../../../store/redux-slices/cmsFetchData'
import { useEffect, useState } from 'react'
import { deleteCMSLanguageStart, getCMSDynamicKeysStart, updateSAdminCMSStart } from '../../../../store/redux-slices/fetchData'
import { getImageGalleryStart } from '../../../../store/redux-slices/emailTemplate'
import { getActiveLanguagesStart } from '../../../../store/redux-slices/login'

const useCreateCms = (cmsData) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { cmsPageId } = useParams()
  const [err, setErr] = useState('')
  const [selectedTab, setSelectedTab] = useState('EN')
  const [template, setTemplate] = useState('')
  const [galleryModal, setGalleryModal] = useState('')

  const { loading } = useSelector((state) => state.cmsFetch)
  const { cmsKeys } = useSelector((state) => state.fetch)
  const { activeLanguages: languages } = useSelector((state) => state.login)

  const getGalleryData = () => {
    dispatch(getImageGalleryStart())
  }

  useEffect(() => {
    dispatch(getActiveLanguagesStart({ limit: '', pageNo: '', active: true }))
    dispatch(getCMSDynamicKeysStart())
  }, [])

  const createCms = (data) => dispatch(createCmsStart({ cmsData: data, navigate }))
  const editCms = (data) => dispatch(updateSAdminCMSStart({cmsData: data, navigate}))
  const deleteCms = (data) => dispatch(deleteCMSLanguageStart({ data }))

  return {
    navigate,
    loading,
    createCms,
    err,
    setErr,
    editCms,
    cmsPageId,
    template,
    setTemplate,
    galleryModal,
    setGalleryModal,
    getGalleryData,
    cmsKeys,
    selectedTab,
    setSelectedTab,
    languages,
    deleteCms
  }
}

export default useCreateCms
