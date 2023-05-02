import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllThemeStart } from '../../../../store/redux-slices/theme'

const useThemesListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)

  const { data, loading } = useSelector((state) => state.theme)
  const totalPages = Math.ceil(data?.count / limit)

  const getThemeById = (themeId) =>
    data && data.rows.find((ele) => ele.themeId === themeId)

  useEffect(() => {
    dispatch(getAllThemeStart({ limit, pageNo: page }))
  }, [page, limit])

  return {
    navigate,
    page,
    setPage,
    data,
    totalPages,
    getThemeById,
    limit,
    setLimit,
    loading
  }
}

export default useThemesListing
