import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllUsersStart, clearAllUsers } from '../../../store/redux-slices/fetchData'
import useDidMountEffect from '../../../utils/useDidMountEffect'

const useAllUserListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isInitialRender = useDidMountEffect()

  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [kycOptions, setKycOptions] = useState('')

  const { userData, loading } = useSelector((state) => state.fetch)
  const totalPages = Math.ceil(userData?.count / limit)

  const fetchData = () => {
    dispatch(
      getAllUsersStart({
        limit,
        pageNo: page,
        search,
        kycStatus: kycOptions
      })
    )
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (page === 1) {
          dispatch(
            getAllUsersStart({
              limit,
              pageNo: page,
              search,
              kycStatus: kycOptions
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
    !isInitialRender && fetchData()

    return () => dispatch(clearAllUsers())
  }, [page])

  useEffect(() => {
    setPage(1)
    fetchData()

    return () => dispatch(clearAllUsers())
  }, [limit, kycOptions])

  return {
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    userData,
    totalPages,
    navigate,
    loading,
    kycOptions,
    setKycOptions
  }
}

export default useAllUserListing
