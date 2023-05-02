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

const useRestrictedProviders = () => {
  const dispatch = useDispatch()
  const { countryId } = useParams()
  const navigate = useNavigate()

  const [selectedTab, setSelectedTab] = useState('restricted-providers')
  const [selectedProviders, setSelectedProviders] = useState({ count: 0, rows: [] })
  const [removedProviders, setRemovedProviders] = useState({ count: 0, rows: [] })
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
      type: 'providers',
      countryId
    }))
  }, [restrictedItemsLimit, restrictedItemsPage])

  useEffect(() => {
    dispatch(getUnRestrictedItemsStart({
      limit: unRestrictedItemsLimit,
      pageNo: unRestrictedItemsPage,
      type: 'providers',
      countryId
    }))
  }, [unRestrictedItemsLimit, unRestrictedItemsPage])

  const addProvider = (provider) => {
    const providerExists = ({ ...selectedProviders }
      .rows
      .findIndex(g => g.masterCasinoProviderId === provider.masterCasinoProviderId))

    if (providerExists === -1) {
      setSelectedProviders({ count: selectedProviders.count + 1, rows: [...selectedProviders.rows, provider] })
    } else {
      toast('Already added this Provider', 'error')
    }
  }

  const removeProvider = (gameId) => {
    const updatedGameRows = [...selectedProviders.rows].filter(g => g.masterCasinoProviderId !== gameId)
    setSelectedProviders({ count: selectedProviders.count - 1, rows: updatedGameRows })
  }

  const addRestrictedProvider = () => {
    const games = [...selectedProviders.rows].map(g => g.masterCasinoProviderId)

    dispatch(addRestrictedItemsStart({ type: 'providers', games, countryId, navigate }))
  }

  const addDeleteProvider = (provider) => {
    const providerExists = ({ ...removedProviders }
      .rows
      .findIndex(g => g.masterCasinoProviderId === provider.masterCasinoProviderId))

    if (providerExists === -1) {
      setRemovedProviders({ count: removedProviders.count + 1, rows: [...removedProviders.rows, provider] })
    } else {
      toast('Already added this Provider', 'error')
    }
  }

  const removeDeleteProvider = (gameId) => {
    const updatedGameRows = [...removedProviders.rows].filter(g => g.masterCasinoProviderId !== gameId)
    setRemovedProviders({ count: removedProviders.count - 1, rows: updatedGameRows })
  }

  const removeRestrictedProvider = () => {
    const games = [...removedProviders.rows].map(g => g.masterCasinoProviderId)

    dispatch(deleteRestrictedItemsStart({ type: 'providers', games, countryId, navigate }))
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
    addProvider,
    selectedProviders,
    removeProvider,
    addRestrictedProvider,
    removeRestrictedProvider,
    addDeleteProvider,
    removeDeleteProvider,
    removedProviders,
    setRemovedProviders
  }
}

export default useRestrictedProviders
