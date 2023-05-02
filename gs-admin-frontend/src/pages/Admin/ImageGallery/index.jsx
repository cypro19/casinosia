import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import ReactUploadGallery from '../../../components/ReactUploadGallery'
import { getImageGalleryStart } from '../../../store/redux-slices/emailTemplate'
import useCheckPermission from '../../../utils/checkPermission'

const ImageGallery = () => {
  const { isHidden } = useCheckPermission()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getImageGalleryStart())
  }, [])

  return (
    <>
      {!isHidden({ module: { key: 'ImageGallery', value: 'R' } }) && <ReactUploadGallery />}
    </>
  )
}

export default ImageGallery
