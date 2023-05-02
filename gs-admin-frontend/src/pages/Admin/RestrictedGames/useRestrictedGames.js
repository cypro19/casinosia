import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getRestrictedItemsStart,
  getUnRestrictedItemsStart,
  addRestrictedItemsStart,
  deleteRestrictedItemsStart
} from '../../../store/redux-slices/fetchData'
import { toast } from '../../../components/Toast'

const useRestrictedGames = () => {
  const dispatch = useDispatch()
  const { countryId } = useParams()
  const navigate = useNavigate()

  const [selectedTab, setSelectedTab] = useState('restricted-games')
  const [selectedGames, setSelectedGames] = useState({ count: 0, rows: [] })
  const [removedGames, setRemovedGames] = useState({ count: 0, rows: [] })
  const [restrictedItemsLimit, setRestrictedItemsLimit] = useState(15)
  const [restrictedItemsPage, setRestrictedItemsPage] = useState(1)

  const [unRestrictedItemsLimit, setUnRestrictedItemsLimit] = useState(15)
  const [unRestrictedItemsPage, setUnRestrictedItemsPage] = useState(1)

  const { loading, restrictedItems, unRestrictedItems } = useSelector(state => state.fetch)

  const restrictedItemsTotalPages = Math.ceil(restrictedItems?.count / restrictedItemsLimit)
  const unRestrictedItemsTotalPages = Math.ceil(unRestrictedItems?.count / unRestrictedItemsLimit)

  useEffect(() => {
    dispatch(getRestrictedItemsStart({
      limit: restrictedItemsLimit,
      pageNo: restrictedItemsPage,
      type: 'games',
      countryId
    }))
  }, [restrictedItemsLimit, restrictedItemsPage])

  useEffect(() => {
    dispatch(getUnRestrictedItemsStart({
      limit: unRestrictedItemsLimit,
      pageNo: unRestrictedItemsPage,
      type: 'games',
      countryId
    }))
  }, [unRestrictedItemsLimit, unRestrictedItemsPage])

  const addGame = (game) => {
    const gameExists = ({ ...selectedGames }
      .rows
      .findIndex(g => g.masterCasinoGameId === game.masterCasinoGameId))

    if (gameExists === -1) {
      setSelectedGames({ count: selectedGames.count + 1, rows: [...selectedGames.rows, game] })
    } else {
      toast('Already added this game', 'error')
    }
  }

  const removeGame = (gameId) => {
    const updatedGameRows = [...selectedGames.rows].filter(g => g.masterCasinoGameId !== gameId)
    setSelectedGames({ count: selectedGames.count - 1, rows: updatedGameRows })
  }

  const addRestrictedGames = () => {
    const games = [...selectedGames.rows].map(g => g.masterCasinoGameId)

    dispatch(addRestrictedItemsStart({ type: 'games', games, countryId, navigate }))
  }

  const addDeleteGame = (game) => {
    const gameExists = ({ ...removedGames }
      .rows
      .findIndex(g => g.masterCasinoGameId === game.masterCasinoGameId))

    if (gameExists === -1) {
      setRemovedGames({ count: removedGames.count + 1, rows: [...removedGames.rows, game] })
    } else {
      toast('Already added this Game', 'error')
    }
  }

  const removeDeleteGame = (gameId) => {
    const updatedGameRows = [...removedGames.rows].filter(g => g.masterCasinoGameId !== gameId)
    setRemovedGames({ count: removedGames.count - 1, rows: updatedGameRows })
  }

  const removeRestrictedGame = () => {
    const games = [...removedGames.rows].map(g => g.masterCasinoGameId)

    dispatch(deleteRestrictedItemsStart({ type: 'games', games, countryId, navigate }))
  }

  return {
    loading,
    restrictedItemsLimit,
    setRestrictedItemsLimit,
    restrictedItemsPage,
    setRestrictedItemsPage,
    unRestrictedItemsLimit,
    setUnRestrictedItemsLimit,
    setUnRestrictedItemsPage,
    unRestrictedItemsPage,
    restrictedItemsTotalPages,
    unRestrictedItemsTotalPages,
    restrictedItems,
    selectedTab,
    setSelectedTab,
    unRestrictedItems,
    addGame,
    selectedGames,
    removeGame,
    addRestrictedGames,
    addDeleteGame,
    removeDeleteGame,
    removeRestrictedGame,
    removedGames
  }
}

export default useRestrictedGames
