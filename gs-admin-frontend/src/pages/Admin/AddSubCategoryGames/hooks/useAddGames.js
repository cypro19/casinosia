import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getAllMasterGamesStart, addGamesToSubCategoryStart } from '../../../../store/redux-slices/superAdminCasinoManagement'
import useDidMountEffect from '../../../../utils/useDidMountEffect'
import { toast } from '../../../../components/Toast'

const useAddGames = () => {
  const { masterGameSubCategoryId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state: { subCategoryName } } = useLocation()

  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedGames, setSelectedGames] = useState([])
  const [selectedProvider, setSelectedProvider] = useState('')

  const isInitialRender = useDidMountEffect()

  const { loading, masterGames, allProviders } = useSelector(state => state.superAdminCasino)

  const totalPages = Math.ceil(masterGames?.count / limit)

  const getProviderName = (id) =>
    allProviders?.rows.find((val) => val.masterCasinoProviderId === id)?.name

  const addGame = (game) => {
    const gameExists = ([...selectedGames]
      .findIndex(g => g.masterCasinoGameId === game.masterCasinoGameId))

    if (gameExists === -1) {
      setSelectedGames([...selectedGames, game])
    } else {
      toast('Already added this game', 'error')
    }
  }

  const removeGame = (gameId) => {
    const updatedGames = [...selectedGames].filter(g => g.masterCasinoGameId !== gameId)
    setSelectedGames(updatedGames)
  }

  const addGamesToSubCategory = () => {
    const games = [...selectedGames].map(g => g.masterCasinoGameId)

    dispatch(addGamesToSubCategoryStart({ masterGameSubCategoryId, games, navigate }))
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (page === 1) {
          dispatch(
            getAllMasterGamesStart({
              limit,
              pageNo: page,
              search,
              casinoCategoryId: masterGameSubCategoryId,
              providerId: selectedProvider
            })
          )
        } else {
          setPage(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  useEffect(() => {
    dispatch(getAllMasterGamesStart({
      limit,
      pageNo: page,
      search,
      casinoCategoryId: masterGameSubCategoryId,
      providerId: selectedProvider
    }))
  }, [limit, page, selectedProvider])

  return {
    loading,
    page,
    limit,
    search,
    setLimit,
    setPage,
    setSearch,
    totalPages,
    masterGames,
    addGame,
    removeGame,
    selectedGames,
    addGamesToSubCategory,
    subCategoryName,
    selectedProvider,
    setSelectedProvider,
    getProviderName
  }
}

export default useAddGames
