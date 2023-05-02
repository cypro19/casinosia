import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getSAdminGameCategoryStart, deleteCategoryStart, updateCategoryStatusStart } from '../../../../store/redux-slices/superAdminCasinoManagement'

const useCasinoCategoriesListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [categoryId, setCategoryId] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [masterGameCategoryId, setMasterGameCategoryId] = useState('')

  const { loading, gameCategory: casinoCategories } = useSelector((state) => state.superAdminCasino)

  const totalPages = Math.ceil(casinoCategories?.count / limit)

  const handleShow = (id, active) => {
    setCategoryId(id)
    setActive(!active)
    setShow(true)
  }

  const handleYes = () => {
    dispatch(
      updateCategoryStatusStart({
        code: 'CASINO_CATEGORY',
        categoryId,
        status: active,
        limit,
        pageNo: page
      })
    )
    setShow(false)
  }

  const handleClose = () => setShowModal(false)

  const handleShowModal = (type) => {
    setType(type)
    setShowModal(true)
  }

  const handleDeleteYes = () => {
    dispatch(deleteCategoryStart({
      data: { masterGameCategoryId },
      limit,
      pageNo: page
    }))
    setDeleteModalShow(false)
  }

  const handleDeleteModal = (id) => {
    setMasterGameCategoryId(id)
    setDeleteModalShow(true)
  }

  useEffect(() => {
    dispatch(
      getSAdminGameCategoryStart({
        limit,
        pageNo: page
      })
    )
  }, [limit, page])

  return {
    limit,
    page,
    loading,
    casinoCategories,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages,
    handleShow,
    handleYes,
    handleShowModal,
    showModal,
    type,
    handleClose,
    selectedCategory,
    setSelectedCategory,
    active,
    navigate,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow
  }
}

export default useCasinoCategoriesListing
