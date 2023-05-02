import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

import {
  deleteSubCategoryStart,
  getSAdminGameCategoryStart,
  getAllSubCategoriesStart,
  updateSubCategoryStatusStart
} from '../../../../store/redux-slices/superAdminCasinoManagement'
import { useNavigate } from 'react-router-dom'

const useCasinoCategoriesListing = () => {
  const dispatch = useDispatch()
  const isInitialRender = useDidMountEffect()
  const navigate = useNavigate()

  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryId, setCategoryId] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [orderBy, setOrderBy] = useState('masterGameSubCategoryId')
  const [sort, setSort] = useState('desc')
  const [over, setOver] = useState(false)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [masterGameSubCategoryId, setMasterGameSubCategoryId] = useState('')

  const { loading, subCategories, gameCategory: casinoCategories } = useSelector((state) => state.superAdminCasino)

  const totalPages = Math.ceil(subCategories?.count / limit)

  const selected = (h) =>
    orderBy === h.value &&
    h.label !== 'Status' &&
    h.label !== 'Icon' &&
    h.label !== 'Category Name' &&
    h.label !== 'Actions'

  const handleShow = (id, active) => {
    setCategoryId(id)
    setActive(!active)
    setShow(true)
  }

  const handleYes = () => {
    dispatch(
      updateSubCategoryStatusStart({
        code: 'CASINO_SUB_CATEGORY',
        categoryId,
        status: active,
        limit,
        pageNo: page,
        categoryFilter,
        search,
        isActive: statusFilter
      })
    )
    setShow(false)
  }

  const handleClose = () => setShowModal(false)

  const handleShowModal = (type) => {
    setType(type)
    setShowModal(true)
  }

  useEffect(() => {
    dispatch(getSAdminGameCategoryStart({ limit: 100, pageNo: 1 }))
  }, [])

  useEffect(() => {
    dispatch(
      getAllSubCategoriesStart({
        limit,
        pageNo: page,
        categoryId: categoryFilter,
        search,
        isActive: statusFilter,
        orderBy,
        sort
      })
    )
  }, [limit, page, categoryFilter, statusFilter, orderBy, sort])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (page === 1) {
          dispatch(
            getAllSubCategoriesStart({
              limit,
              pageNo: page,
              search,
              categoryId: categoryFilter,
              isActive: statusFilter,
              orderBy,
              sort
            })
          )
        } else {
          setPage(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const handleDeleteYes = () => {
    dispatch(deleteSubCategoryStart({
      data: { masterGameSubCategoryId },
      limit,
      pageNo: page,
      search,
      categoryFilter,
      isActive: statusFilter
    }))
    setDeleteModalShow(false)
  }

  const handleDeleteModal = (id) => {
    setMasterGameSubCategoryId(id)
    setDeleteModalShow(true)
  }

  return {
    search,
    setSearch,
    limit,
    page,
    loading,
    subCategories,
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
    selectedSubCategory,
    setSelectedSubCategory,
    setCategoryFilter,
    categoryFilter,
    active,
    navigate,
    statusFilter,
    setStatusFilter,
    setOrderBy,
    setSort,
    setOver,
    selected,
    sort,
    over,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow
  }
}

export default useCasinoCategoriesListing
