import axios from 'axios'
import { serialize } from 'object-to-formdata'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getItem, getLoginToken } from '../../utils/storageUtils'
import { deleteFromGalleryStart } from '../../store/redux-slices/emailTemplate'
import { toast } from '../../components/Toast'
import useCheckPermission from '../../utils/checkPermission'

const useUploadGallery = () => {
  const dispatch = useDispatch()
  const { REACT_APP_API_URL } = process.env
  const [initialState, setInitialState] = useState([])
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [imageDelete, setImageDelete] = useState()
  const { gallery } = useSelector(state => state.emailTemplate)
  const { isHidden } = useCheckPermission()

  const handleDeleteYes = () => {
    setDeleteModalShow(false)
    const data = { imageUrl: imageDelete?.source }
    dispatch(deleteFromGalleryStart({ data }))
    setInitialState([])
  }

  useEffect(() => {
    if (gallery?.length > 0) {
      const state = []
      for (const img in gallery) {
        const data = gallery[img]
        state.push({ name: data.name, source: data.imageUrl })
      }
      setInitialState(state?.reverse())
    }
  }, [gallery])

  const customRequest = ({ uid, file, onProgress, onSuccess, onError }) => {
    if (!isHidden({ module: { key: 'ImageGallery', value: 'U' } })) {
      const action = `${REACT_APP_API_URL}/api/${'admin'}/upload-to-gallery`

      let data = { name: file.name, image: file }
      data = serialize(data)

      const CancelToken = axios.CancelToken
      const source = CancelToken.source()

      axios.put(
        action,
        data,
        {
          headers: {
            'Content-Type': 'multipart/formdata',
            Authorization: `Bearer ${getLoginToken()}`
          },
          onUploadProgress: ({ total, loaded }) => {
            onProgress(uid, Math.round(loaded / total * 100))
          },
          cancelToken: source.token
        }
      ).then(({ data: response }) => {
        const state = []
        for (const img in response?.data?.gallery) {
          const data = response?.data?.gallery[img]
          state.push({ name: data.name, source: data.imageUrl })
        }
        onSuccess(uid, state[state?.length - 1])
        setInitialState(state)
        toast('Image Uploaded Successfully', 'success')
      })
        .catch(error => {
          onError(uid, {
            action,
            status: error.request,
            response: error.response
          })
        })
        .catch(error => {
          onError(uid, {
            action,
            status: error.request,
            response: error.response
          })
        })

      return {
        abort () {
          source.cancel()
        }
      }
    } else {
      toast('Upload Permission is Not Granted', 'error')
    }
  }

  return {
    customRequest,
    initialState,
    setInitialState,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    setImageDelete,
    isHidden
  }
}

export default useUploadGallery
