import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getSAdminGameCategoryStart, updateCategoryReOrderStart } from '../../../../store/redux-slices/superAdminCasinoManagement'

const useReorderSubCategories = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, gameCategory: casinoCategories } = useSelector((state) => state.superAdminCasino)

  const [state, setState] = useState({ rows: [], count: 0 })

  useEffect(() => {
    if (casinoCategories) {
      setState(casinoCategories)
    }
  }, [casinoCategories])

  const reorder = (subCategories, startIndex, endIndex) => {
    const result = Array.from(subCategories)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

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
    state.rows.map((list) => row.push(list.masterGameCategoryId))
    dispatch(updateCategoryReOrderStart({ data: { order: row }, navigate, isSubCategory: false }))
  }

  useEffect(() => {
    dispatch(
      getSAdminGameCategoryStart({
        limit: '',
        pageNo: ''
      })
    )
  }, [])

  return {
    loading,
    state,
    onDragEnd,
    handleSave,
    navigate
  }
}

export default useReorderSubCategories
