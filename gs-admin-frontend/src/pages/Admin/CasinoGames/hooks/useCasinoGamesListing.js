import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  deleteGameStart,
  getAllGamesStart,
  getAllSubCategoriesStart,
  updateGameStatusStart
} from '../../../../store/redux-slices/superAdminCasinoManagement'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const useCasinoGamesListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [casinoCategoryId, setCasinoCategoryId] = useState('')
  const [categoryId, setCategoryId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [subCategoryId, setSubCategoryId] = useState()
  const [categoryGameId, setCategoryGameId] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [gameData, setGameData] = useState()
  const [orderBy, setOrderBy] = useState('categoryGameId')
  const [sort, setSort] = useState('desc')
  const [over, setOver] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')

  const { loading, games, subCategories, allProviders } = useSelector((state) => state.superAdminCasino)

  const totalPages = Math.ceil(games?.count / limit)
  const isInitialRender = useDidMountEffect()

  const getProviderName = (id) =>
    allProviders?.rows.find((val) => val.masterCasinoProviderId === id)?.name

  const selected = (h) =>
    orderBy === h.value &&
    h.label !== 'Thumbnail' &&
    h.label !== 'Status' &&
    h.label !== 'Sub Category' &&
    h.label !== 'Category'

  const handleShow = (id, subId, active) => {
    setCategoryId(id)
    setSubCategoryId(subId)
    setActive(!active)
    setShow(true)
  }

  const handleDeleteYes = () => {
    dispatch(deleteGameStart({
      data: { categoryGameId },
      limit,
      pageNo: page,
      casinoCategoryId,
      isActive: statusFilter,
      providerId: selectedProvider,
      search:''
    }))
    setDeleteModalShow(false)
  }

  const handleDeleteModal = (id) => {
    setCategoryGameId(id)
    setDeleteModalShow(true)
  }

  const handleYes = () => {
    dispatch(
      updateGameStatusStart({
        data: {
          code: 'CATEGORY_GAME',
          categoryGameId: categoryId,
          status: active,
          masterGameSubCategoryId: subCategoryId
        },
        limit,
        pageNo: page,
        casinoCategoryId,
        isActive: statusFilter,
        providerId: selectedProvider,
        search:''
      })
    )
    setShow(false)
  }

  const handleClose = () => setShowModal(false)

  const handleShowModal = (type, data, id) => {
    setGameData(data)
    setCategoryGameId(id)
    setType(type)
    setShowModal(true)
  }

  useEffect(() => {
    dispatch(getAllSubCategoriesStart({
      limit: '',
      pageNo: '',
      categoryId: '',
      search: '',
      isActive: '',
      orderBy: '',
      sort: ''
    }))
  }, [])

  useEffect(() => {
    setPage(1)
    !isInitialRender && dispatch(
      getAllGamesStart({
        limit,
        pageNo: page,
        casinoCategoryId,
        isActive: statusFilter,
        orderBy,
        sort,
        providerId: selectedProvider,
        search:''
      })
    )
  }, [limit, casinoCategoryId, statusFilter, orderBy, sort, selectedProvider])

  useEffect(() => {
    dispatch(
      getAllGamesStart({
        limit,
        pageNo: page,
        casinoCategoryId,
        isActive: statusFilter,
        orderBy,
        sort,
        providerId: selectedProvider,
        search:''
      })
    )
  }, [page])

  return {
    limit,
    page,
    loading,
    setLimit,
    setPage,
    totalPages,
    games,
    casinoCategoryId,
    setCasinoCategoryId,
    subCategories,
    show,
    setShow,
    handleShow,
    handleYes,
    handleShowModal,
    showModal,
    type,
    handleClose,
    active,
    gameData,
    categoryGameId,
    setDeleteModalShow,
    deleteModalShow,
    handleDeleteYes,
    handleDeleteModal,
    statusFilter,
    setStatusFilter,
    setOrderBy,
    setSort,
    setOver,
    selected,
    sort,
    over,
    selectedProvider,
    setSelectedProvider,
    getProviderName,
    navigate
  }
}

export default useCasinoGamesListing
