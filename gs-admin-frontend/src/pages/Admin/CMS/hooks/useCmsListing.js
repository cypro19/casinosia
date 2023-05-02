import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getAllCmsStart, clearAllCms, updateSACMSStatusStart } from '../../../../store/redux-slices/fetchData'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const useCmsListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isInitialRender = useDidMountEffect()

  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [active, setActive] = useState('')
  const [statusShow, setStatusShow] = useState(false)
  const [cmsId, setCmsId] = useState('')

  const { cmsData, loading } = useSelector((state) => state.fetch)
  const totalPages = Math.ceil(cmsData?.count / limit)

  const fetchCMS = () => {
    dispatch(
      getAllCmsStart({
        limit,
        pageNo: page,
        search,
        isActive: active
      })
    )
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (page === 1) {
          fetchCMS()
        } else {
          setPage(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  useEffect(() => {
    !isInitialRender && fetchCMS()
  }, [page])

  useEffect(() => {
    setPage(1)
    fetchCMS()
  }, [limit, active])

  const handleStatusShow = (id, status) => {
    setCmsId(id)
    setStatus(!status)
    setStatusShow(true)
  }

  const handleYes = () => {
    dispatch(
      updateSACMSStatusStart({
        data: {
          code: 'CMS',
          cmsPageId: cmsId,
          status
        },
        limit,
        pageNo: page,
        search,
        isActive: active
      })
    )
    setStatusShow(false)
  }

  return {
    navigate,
    limit,
    page,
    search,
    setPage,
    setLimit,
    setSearch,
    cmsData,
    totalPages,
    loading,
    handleStatusShow,
    statusShow,
    setStatusShow,
    handleYes,
    status,
    active,
    setActive
  }
}

export default useCmsListing
