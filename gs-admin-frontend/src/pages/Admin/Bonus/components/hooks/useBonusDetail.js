import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import useDidMountEffect from '../../../../../utils/useDidMountEffect'
import { getBonusStart, getSAPaymentMethodStart } from '../../../../../store/redux-slices/bonus'
import { getFreeSpinGamesStart } from '../../../../../store/redux-slices/superAdminCasinoManagement'

const useBonusDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { bonusId } = useParams()
  const [selectedTab, setSelectedTab] = useState('general')
  const { loading, bonusDetail, paymentMethod } = useSelector((state) => state.bonus)
  const [pageNo, setPageNo] = useState(1)
  const [limit, setLimit] = useState(15)
  const [gamesPageNo, setGamesPageNo] = useState(1)
  const [gamesLimit, setGamesLimit] = useState(15)
  const isInitialRender = useDidMountEffect()
  const [search, setSearch] = useState('')
  const [wagerSearch, setWagerSearch] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [gameIds, setGameIds] = useState(bonusDetail?.gameIds || [])
  const { casinoGamesData } = useSelector((state) => state.superAdminCasino)
  const [selectedLang, setSelectedLang] = useState('EN')

  useEffect(() => {
    if (bonusId) {
      dispatch(getBonusStart({ bonusId }))
      dispatch(getSAPaymentMethodStart())
    }
  }, [bonusId])

  useEffect(() => {
    if (bonusDetail) {
      setGameIds(bonusDetail?.gameIds)
    }
  }, [bonusDetail])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (pageNo === 1) {
          bonusDetail && bonusDetail?.bonusId === parseInt(bonusId) && bonusDetail?.bonusType === 'freespins' &&
          dispatch(
            getFreeSpinGamesStart({
              limit: gamesLimit,
              pageNo: gamesPageNo,
              search,
              providerId: selectedProvider,
              bonusId
            })
          )
        } else {
          setPageNo(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  useEffect(() => {
    bonusDetail && bonusDetail?.bonusId === parseInt(bonusId) && bonusDetail?.bonusType === 'freespins' &&
    dispatch(
      getFreeSpinGamesStart({
        limit: gamesLimit,
        pageNo: gamesPageNo,
        search,
        providerId: selectedProvider,
        bonusId
      })
    )
  }, [selectedProvider, gamesLimit, gamesPageNo, bonusDetail])

  return {
    selectedTab,
    setSelectedTab,
    bonusDetail,
    loading,
    bonusId,
    paymentMethod,
    navigate,
    pageNo,
    setPageNo,
    limit,
    setLimit,
    casinoGamesData,
    gameIds,
    setGameIds,
    search,
    setSearch,
    selectedProvider,
    setSelectedProvider,
    gamesLimit,
    gamesPageNo,
    setGamesLimit,
    setGamesPageNo,
    wagerSearch,
    setWagerSearch,
    selectedLang,
    setSelectedLang
  }
}

export default useBonusDetail
