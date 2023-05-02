import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  getSAdminGameCategoryStart,
  getAllSubCategoriesStart,
  updateCategoryReOrderStart
} from '../../../../store/redux-slices/superAdminCasinoManagement'
import { useNavigate } from 'react-router-dom'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const useReorderSubCategories = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isInitialRender = useDidMountEffect()

  const { loading, subCategories, gameCategory: casinoCategories } = useSelector((state) => state.superAdminCasino)

  const [state, setState] = useState({ rows: [], count: 0 })
  const [categoryFilter, setCategoryFilter] = useState('')

  const reorder = (subCategories, startIndex, endIndex) => {
    const result = Array.from(subCategories)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  useEffect(() => {
    if (subCategories) {
      setState(subCategories)
    }
  }, [subCategories])

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const rows = reorder(
      state.rows,
      result.source.index,
      result.destination.index
    )
    setState({ rows, count: rows.length })
  }

  const handleSave = () => {
    const row = []
    state.rows.map((list) => row.push(list.masterGameSubCategoryId))

    dispatch(updateCategoryReOrderStart({ data: { order: row, masterGameCategoryId: categoryFilter }, navigate, isSubCategory: true }))
  }

  useEffect(() => {
    dispatch(getSAdminGameCategoryStart({ limit: '', pageNo: '' }))
  }, [])

  useEffect(() => {
    if (!isInitialRender) {
      dispatch(
        getAllSubCategoriesStart({
          limit: '',
          pageNo: '',
          categoryId: categoryFilter,
          search: '',
          isActive: '',
          orderBy: 'masterGameSubCategoryId',
          sort: 'desc'
        })
      )
    }
  }, [categoryFilter])

  return {
    loading,
    state,
    onDragEnd,
    handleSave,
    navigate,
    casinoCategories,
    categoryFilter,
    setCategoryFilter
  }
}

export default useReorderSubCategories
