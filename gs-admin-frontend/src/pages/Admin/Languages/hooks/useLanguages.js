import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLanguagesStart, updateLanguageStatusStart } from '../../../../store/redux-slices/login'

const useLanguages = () => {
  const dispatch = useDispatch()
  const { languages, loading } = useSelector(state => state?.login)
  const [statusFilter, setStatusFilter ] = useState('')
  const [limit, setLimit] = useState(15)
  const [pageNo, setPageNo] = useState(1)
  const [languageId, setLanguageId] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const totalPages = Math.ceil(languages?.count / limit)

  const handleClose = () => setShowModal(false)
  const handleShowModal = () => {
    setShowModal(true)
    setShow(true)
  }
  const handleShow = (id, active) => {
    setShowModal(true)
    setLanguageId(id)
    setActive(!active)
    setShow(true)
  }

  const handleYes = () => {
    dispatch(
      updateLanguageStatusStart({
        code: 'LANGUAGE',
        languageId,
        status: active,
        limit,
        pageNo: pageNo
      })
    )
    setShow(false)
  }

  useEffect(() => {
    dispatch(getLanguagesStart({ limit, pageNo, active: statusFilter }))
  }, [limit, pageNo, statusFilter])

  return {
    loading,
    handleShowModal,
    showModal,
    handleShow,
    handleClose,
    languages,
    limit,
    pageNo,
    totalPages,
    setPageNo,
    handleYes,
    active,
    show,
    setShow,
    setLimit,
    statusFilter,
    setStatusFilter
  }
}

export default useLanguages
