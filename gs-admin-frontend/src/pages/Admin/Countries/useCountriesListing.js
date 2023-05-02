import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getCountriesStart, resetRestrictedItemsStart } from '../../../store/redux-slices/fetchData'
import useDidMountEffect from '../../../utils/useDidMountEffect'

const useCountriesListing = () => {
  const dispatch = useDispatch()
  const isInitialRender = useDidMountEffect()
  const navigate = useNavigate()

  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [name, setName] = useState('')

  const { countries, loading } = useSelector((state) => state.fetch)
  const totalPages = Math.ceil(countries?.count / limit)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (page === 1) {
          dispatch(getCountriesStart({ limit, name, pageNo: page }))
        } else {
          setPage(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [name])

  useEffect(() => {
    dispatch(getCountriesStart({ limit, name, pageNo: page }))
    dispatch(resetRestrictedItemsStart())
  }, [limit, page])

  return {
    limit,
    setLimit,
    page,
    setPage,
    name,
    setName,
    countries,
    totalPages,
    loading,
    navigate
  }
}

export default useCountriesListing
