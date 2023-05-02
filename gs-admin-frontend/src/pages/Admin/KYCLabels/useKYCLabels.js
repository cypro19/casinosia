import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveLanguagesStart, getLanguagesStart } from '../../../store/redux-slices/login'
import { getDocumentLabelStart, updateDocumentLabelStart, createDocumentLabelStart } from '../../../store/redux-slices/superAdminSettings'

const useKYCLabels = () => {
  const dispatch = useDispatch()
  const { activeLanguages: languages } = useSelector(state => state.login)
  const { documentLabels, loading } = useSelector(state => state.superAdminSettings)
  const [newLabels, setNewLabels] = useState(documentLabels || '')
  const [show, setShow] = useState(false)
  const [data, setData] = useState('')
  const [type, setType] = useState('')
  const [language, setLangauge] = useState('EN')

  useEffect(() => {
    dispatch(getDocumentLabelStart({ userId: '' }))
  }, [])

  useEffect(() => {
    dispatch(getActiveLanguagesStart({ limit: '', pageNo: '', active: true }))
  }, [])

  const handleClose = () => {
    setShow(false)
    setData('')
  }

  useEffect(() => {
    setNewLabels(documentLabels)
  }, [documentLabels])

  const handleAdd = () => {
    setType('Create')
    setData({ name: '', isRequired: false })
    setShow(true)
  }

  const updateLabels = ({ data }) => {
    dispatch(updateDocumentLabelStart({ data }))
    setData('')
  }

  const createLabels = ({ data }) => {
    dispatch(createDocumentLabelStart({ data }))
    setData('')
  }

  const handleEdit = (data) => {
    setType('Edit')
    setData(data)
    setShow(true)
  }

  return {
    handleAdd,
    show,
    type,
    setShow,
    language,
    setLangauge,
    handleClose,
    handleEdit,
    languages,
    newLabels,
    setNewLabels,
    updateLabels,
    createLabels,
    data,
    loading
  }
}

export default useKYCLabels
