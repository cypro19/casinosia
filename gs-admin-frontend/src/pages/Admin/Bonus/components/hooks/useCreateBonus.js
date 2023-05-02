import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createBonusStart, getSAPaymentMethodStart } from '../../../../../store/redux-slices/bonus'
import { formatDateYMD } from '../../../../../utils/dateFormatter'
import { toast } from '../../../../../components/Toast'
import { getloyaltyLevelStart } from '../../../../../store/redux-slices/superAdminSettings'
import { getActiveLanguagesStart, getLanguagesStart } from '../../../../../store/redux-slices/login'

const useCreateBonus = (bonusDetail, isClone) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [set, setSet] = useState(false)
  const [selectedTab, setSelectedTab] = useState('general')
  const { activeLanguages: languages } = useSelector(state => state.login)
  const { paymentMethod, loading } = useSelector(state => state.bonus)
  const { allCurrencies } = useSelector(state => state.currencies)
  const [currenciesOptions, setCurrenciesOptions] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [gameOptions, setgameOptions] = useState([])
  const [providerOptions, setProviderOptions] = useState([])
  const [enableSubmit, setEnableSubmit] = useState(false)
  const [appliedBonusOptions, setAppliedBonusOptions] = useState({ label: '', value: '' })
  const [pageNo, setPageNo] = useState(1)
  const [limit, setLimit] = useState(15)
  const [search, setSearch] = useState('')
  const [gameIds, setGameIds] = useState(bonusDetail?.gameIds || [])
  const [selectedProvider, setSelectedProvider] = useState('')
  const { loyaltyLevel } = useSelector(state => state.superAdminSettings)
  const [gamesPageNo, setGamesPageNo] = useState(1)
  const [gamesLimit, setGamesLimit] = useState(15)
  const [data, setData] = useState({
    promoTitle: bonusDetail?.promotionTitle || { EN: '' },
    desc: bonusDetail?.description || { EN: '' },
    terms: bonusDetail?.termCondition || { EN: '' }
  })

  useEffect(() => {
    if (bonusDetail) {
      setData({
        promoTitle: bonusDetail?.promotionTitle,
        desc: bonusDetail?.description,
        terms: bonusDetail?.termCondition
      })
      setSet(true)
    }
  }, [bonusDetail])

  const { casinoProvidersData, casinoGamesData } = useSelector((state) => state.superAdminCasino)
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  const [curr, setCurr] = useState({
    EUR: {
      maxBonusThreshold: '',
      minDeposit: '',
      maxWinAmount: ''
    }
  })

  useEffect(() => {
    dispatch(getloyaltyLevelStart())
  }, [])
  useEffect(() => {
    if(!languages) dispatch(getActiveLanguagesStart({limit: '', pageNo: '', active: true}))
  }, [])

  const handelCreateBonus = (formValues) => {
    Object.keys(formValues).forEach((key) => {
      if (formValues[key] === null || formValues[key] === '') {
        delete formValues[key]
      }
    })
    if (formValues.bonusType === 'freespins' || formValues?.bonusType === 'cashfreespins') {
      if (selectedTab === 'games') {
        delete formValues?.loyaltyLevel
        formValues.gameIds = gameIds
        formValues.promotionTitle = JSON.stringify(data?.promoTitle)
        formValues.description = JSON.stringify(data?.desc)
        formValues.termCondition = JSON.stringify(data?.terms)
        gameIds && gameIds?.length
          ? dispatch(
            createBonusStart({
              data: {
                ...formValues,
                bonusType: 'freespins',
                validFrom: formatDateYMD(state.map((a) => a.startDate)),
                validTo: formatDateYMD(state.map((a) => a.endDate)),
                other: { betLevel: formValues?.betLevel }
              },
              navigate
            })
          )
          : toast('Select At least One Game.', 'error')
      } else {
        setSelectedTab(selectedTab === 'general' ? (languages?.rows?.length > 1) ? 'languages' : 'currency' : (selectedTab === 'languages' ? 'currency' : selectedTab === 'currency' && 'games'))
      }
    } else if (formValues.bonusType === 'joining') {
      if (selectedTab === 'currency') {
        formValues.promotionTitle = JSON.stringify(data?.promoTitle)
        formValues.description = JSON.stringify(data?.desc)
        formValues.termCondition = JSON.stringify(data?.terms)
        dispatch(
          createBonusStart({
            data: {
              ...formValues,
              validFrom: formatDateYMD(state.map((a) => a.startDate)),
              validTo: formatDateYMD(state.map((a) => a.endDate)),
            },
            navigate
          })
        )
      } else {
        setSelectedTab(selected => selected === 'general' ? (languages?.rows?.length > 1) ? 'languages' : 'currency' : (selected === 'languages' && 'currency'))
      }
    } else {
      if (formValues.bonusType === 'deposit' && selectedTab === 'currency') {
        formValues.promotionTitle = JSON.stringify(data?.promoTitle)
        formValues.description = JSON.stringify(data?.desc)
        formValues.termCondition = JSON.stringify(data?.terms)
        dispatch(
          createBonusStart({
            data: {
              ...formValues,
              validFrom: formatDateYMD(state.map((a) => a.startDate)),
              validTo: formatDateYMD(state.map((a) => a.endDate))
            },
            navigate
          })
        )
      } else {
        setSelectedTab(selected => selected === 'general' ? (languages?.rows?.length > 1) ? 'languages' : 'currency' : (selected === 'languages' && 'currency'))
      }
    }
  }

  const [preview, setPreview] = useState({
    image_preview: !isClone ? bonusDetail?.imageUrl : null,
    image_file: !isClone ? bonusDetail?.imageUrl : null
  })

  useEffect(() => {
    if (bonusDetail?.imageUrl && !isClone) {
      setPreview({
        image_preview: bonusDetail?.imageUrl,
        image_file: bonusDetail?.imageUrl
      })
    }
    if (bonusDetail?.gameIds) {
      setGameIds(bonusDetail?.gameIds)
    }
  }, [bonusDetail])

  const handleImagePreview = (e) => {
    if (e.target.files[0]) {
      const imageAsBase64 = URL.createObjectURL(e.target.files[0])
      const imageAsFiles = e.target.files[0]
      setPreview({
        image_preview: imageAsBase64,
        image_file: imageAsFiles
      })
    }
  }

  useEffect(() => {
    if (!paymentMethod) dispatch(getSAPaymentMethodStart())
  }, [])

  useEffect(() => {
    // let options = []
    if (allCurrencies) {
      const options = allCurrencies.rows.map((currency) => { return ({ label: currency.name, value: currency.code }) })

      setCurrenciesOptions(options)
    }
  }, [allCurrencies])

  useEffect(() => {
    const options = casinoProvidersData?.rows?.map((provider) => { return { value: provider.masterCasinoProviderId, label: provider.name } })
    setProviderOptions(options)
  }, [casinoProvidersData])

  return {
    selectedTab,
    setSelectedTab,
    gameOptions,
    providerOptions,
    allCurrencies,
    state,
    setState,
    dispatch,
    navigate,
    preview,
    handleImagePreview,
    activeTab,
    setActiveTab,
    curr,
    setCurr,
    enableSubmit,
    setEnableSubmit,
    loading,
    handelCreateBonus,
    pageNo,
    setPageNo,
    limit,
    setLimit,
    casinoGamesData,
    search,
    setSearch,
    selectedProvider,
    setSelectedProvider,
    gameIds,
    setGameIds,
    loyaltyLevel,
    gamesLimit,
    gamesPageNo,
    setGamesLimit,
    setGamesPageNo,
    appliedBonusOptions,
    languages,
    data,
    setData,
    set
  }
}

export default useCreateBonus
