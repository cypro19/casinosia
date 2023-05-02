import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '../../../components/Toast'
import { addRestrictedCountriesStart, deleteRestrictedCountriesStart, getRestrictedCountriesStart, getUnRestrictedCountriesStart } from '../../../store/redux-slices/fetchData'

const useProviderCountries = (game) => {
  const dispatch = useDispatch()
  const { itemId } = useParams()
  const navigate = useNavigate()

  const [selectedTab, setSelectedTab] = useState('restricted-countries')
  const [restrictedCountriesLimit, setRestrictedCountriesLimit] = useState(15)
  const [restrictedCountriesPage, setRestrictedCountriesPage] = useState(1)

  const [unRestrictedCountriesLimit, setUnRestrictedCountriesLimit] = useState(15)
  const [unRestrictedCountriesPage, setUnRestrictedCountriesPage] = useState(1)

  const [selectedCountries, setSelectedCountries] = useState({ count: 0, rows: [] })
  const [removedCountries, setRemovedCountries] = useState({ count: 0, rows: [] })

  const { loading, restrictedCountries, unRestrictedCountries } = useSelector(state => state.fetch)

  const restrictedCountriesTotalPages = Math.ceil(restrictedCountries?.count / restrictedCountriesLimit)
  const unRestrictedCountriesTotalPages = Math.ceil(unRestrictedCountries?.count / unRestrictedCountriesLimit)

  useEffect(() => {
    dispatch(getRestrictedCountriesStart({
      limit: restrictedCountriesLimit,
      pageNo: restrictedCountriesPage,
      type: game ? 'games' : 'providers',
      itemId
    }))
  }, [restrictedCountriesLimit, restrictedCountriesPage])

  useEffect(() => {
    dispatch(getUnRestrictedCountriesStart({
      limit: unRestrictedCountriesLimit,
      pageNo: unRestrictedCountriesPage,
      type: game ? 'games' : 'providers',
      itemId
    }))
  }, [unRestrictedCountriesLimit, unRestrictedCountriesPage])

  const addCountries = (country) => {
    const countryExists = ({ ...selectedCountries }
      .rows
      .findIndex(g => g.countryId === country.countryId))

    if (countryExists === -1) {
      setSelectedCountries({ count: selectedCountries.count + 1, rows: [...selectedCountries.rows, country] })
    } else {
      toast('Already added this Country', 'error')
    }
  }

  const removeCountries = (countryId) => {
    const updatedCountriesRows = [...selectedCountries.rows].filter(g => g.countryId !== countryId)
    setSelectedCountries({ count: selectedCountries.count - 1, rows: updatedCountriesRows })
  }

  const addRestrictedCountries = () => {
    const countries = [...selectedCountries.rows].map(g => g.countryId)

    dispatch(addRestrictedCountriesStart({ type: game ? 'games' : 'providers', countries, itemId: parseInt(itemId), navigate, game }))
  }

  const addDeleteCountries = (country) => {
    const countryExists = ({ ...removedCountries }
      .rows
      .findIndex(g => g.countryId === country.countryId))

    if (countryExists === -1) {
      setRemovedCountries({ count: removedCountries.count + 1, rows: [...removedCountries.rows, country] })
    } else {
      toast('Already added this Country', 'error')
    }
  }

  const removeDeleteCountries = (countryId) => {
    const updatedCountriesRows = [...removedCountries.rows].filter(g => g.countryId !== countryId)
    setRemovedCountries({ count: removedCountries.count - 1, rows: updatedCountriesRows })
  }

  const removeRestrictedCountries = () => {
    const countries = [...removedCountries.rows].map(g => g.countryId)

    dispatch(deleteRestrictedCountriesStart({ type: game ? 'games' : 'providers', countries, itemId: parseInt(itemId), navigate, game }))
  }

  return {
    selectedTab,
    setSelectedTab,
    loading,
    restrictedCountries,
    restrictedCountriesLimit,
    restrictedCountriesPage,
    restrictedCountriesTotalPages,
    setRestrictedCountriesLimit,
    setRestrictedCountriesPage,
    unRestrictedCountries,
    unRestrictedCountriesLimit,
    unRestrictedCountriesPage,
    unRestrictedCountriesTotalPages,
    setUnRestrictedCountriesLimit,
    setUnRestrictedCountriesPage,
    addCountries,
    selectedCountries,
    removeCountries,
    addRestrictedCountries,
    addDeleteCountries,
    removedCountries,
    removeDeleteCountries,
    removeRestrictedCountries
  }
}

export default useProviderCountries
