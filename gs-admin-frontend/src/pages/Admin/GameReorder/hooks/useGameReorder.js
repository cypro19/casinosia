import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateReorderGamesStart, getSAdminGameCategoryStart, getAllGamesStart, getAllSubCategoriesStart } from '../../../../store/redux-slices/superAdminCasinoManagement'
import { getItem } from '../../../../utils/storageUtils'

const useGameReorder = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, games, gameCategory: casinoCategories, subCategories } = useSelector((state) => state.superAdminCasino)
  const [reOrderedGame, setReorderedGame] = useState({ rows: [], count: 0 })
  const [casinoGames, setCasinoGames] = useState({ rows: [], count: 0 })
  const [categoryFilter, setCategoryFilter] = useState('')
  const [casinoCategoryId, setCasinoCategoryId] = useState(null)
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(games?.count / limit)

  useEffect(() => {
    if (games && games.length) {
      if (reOrderedGame?.rows) {
        const filteredArray = games?.filter((item) => {
          const exist = reOrderedGame?.rows.find(common => common.masterCasinoGameId === item.masterCasinoGameId)
          if (exist) {
            return false
          } else {
            return true
          }
        })
        setCasinoGames({ rows: filteredArray, count: games?.length })
      } else {
        setCasinoGames({ rows: games, count: games?.length })
      }
    }
  }, [games])

  useEffect(() => {
    dispatch(getSAdminGameCategoryStart({ limit: '', pageNo: '' }))
  }, [])

  const reorder = (reorderItem, startIndex, endIndex) => {
    const result = Array.from(reorderItem)
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
      reOrderedGame.rows,
      result.source.index,
      result.destination.index
    )
    setReorderedGame({ rows, count: rows.length })
  }

  const handleAddGame = (item) => {
    console.log(item)
    setReorderedGame((oldItem) => {
      const newArray = [...oldItem.rows, item]
      return { rows: newArray, count: newArray.length }
    })
    setCasinoGames((oldItem) => {
      const newArray = oldItem?.rows.filter((gameItem) => gameItem.masterCasinoGameId !== item.masterCasinoGameId)
      return { rows: newArray, count: newArray.length }
    })
  }

  const handRemoveGame = (item) => {
    setCasinoGames((oldItem) => {
      const newArray = [...oldItem.rows, item]
      return { rows: newArray, count: newArray.length }
    })
    setReorderedGame((oldItem) => {
      const newArray = oldItem?.rows.filter((gameItem) => gameItem.masterCasinoGameId !== item.masterCasinoGameId)
      return { rows: newArray, count: newArray.length }
    })
  }
  const onSuccess = () => {
    if (reOrderedGame.rows) {
      // toast(e.response.data.message, 'error')
      setReorderedGame({ rows: [], count: 0 })
    }
    if (casinoCategoryId) {
      dispatch(
        getAllGamesStart({
          limit: '',
          pageNo: '',
          casinoCategoryId,
          isActive: '',
          orderBy: 'orderId',
          sort: 'asc',
          providerId: ''
        })
      )
    }

  }
  const handleSave = () => {
    const orderedGames = []
    const unOrderedGames = []
    reOrderedGame && reOrderedGame.rows.map((list) => orderedGames.push(list.masterCasinoGameId))
    casinoGames && casinoGames.rows.map((list) => unOrderedGames.push(list.masterCasinoGameId))

    const data = {
      order: [...orderedGames, ...unOrderedGames],
      casinoCategoryId,
    }
    dispatch(updateReorderGamesStart({ data, onSuccess }))
  }

  useEffect(() => {
    if (casinoCategoryId) {
      dispatch(
        getAllGamesStart({
          limit: '',
          pageNo: '',
          casinoCategoryId,
          isActive: '',
          orderBy: 'orderId',
          sort: 'asc',
          providerId: ''
        })
      )
    }
  }, [casinoCategoryId])

  useEffect(() => {
    if (categoryFilter) {
      dispatch(getAllSubCategoriesStart({
        limit: '',
        pageNo: '',
        categoryId: categoryFilter,
        search: '',
        isActive: '',
        orderBy: '',
        sort: ''
      }))
    }
  }, [categoryFilter])

  return {
    loading,
    reOrderedGame,
    onDragEnd,
    handleSave,
    navigate,
    casinoGames,
    handRemoveGame,
    handleAddGame,
    casinoCategories,
    categoryFilter,
    setCategoryFilter,
    totalPages,
    setLimit,
    setPage,
    limit,
    page,
    subCategories,
    casinoCategoryId,
    setCasinoCategoryId,
    setReorderedGame
  }
}

export default useGameReorder
