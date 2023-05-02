import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAdminsStart } from '../../../../store/redux-slices/admins'

const useSubAdmins = (superAdminId) => {
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data } = useSelector((state) => state.admins)
  const totalPages = Math.ceil(data?.count / limit)
  const { adminRole } = useSelector((state) => state.login)

  const getRole = (id) =>
    adminRole && adminRole.find((obj) => obj.superRoleId === id).name

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (page === 1) {
        dispatch(
          getAllAdminsStart({
            limit,
            pageNo: page,
            orderBy: 'superAdminUserId',
            sort: 'desc',
            search,
            superAdminId,
            superRoleId: ''
          })
        )
      } else {
        setPage(1)
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  useEffect(() => {
    dispatch(
      getAllAdminsStart({
        limit,
        pageNo: page,
        orderBy: 'superAdminUserId',
        sort: 'desc',
        search,
        superAdminId,
        superRoleId: ''
      })
    )
  }, [limit, page])

  return {
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    data,
    totalPages,
    getRole
  }
}

export default useSubAdmins
