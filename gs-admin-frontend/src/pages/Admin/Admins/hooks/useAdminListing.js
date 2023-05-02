import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllAdminsStart } from '../../../../store/redux-slices/admins'
import { updateSAdminStatusStart } from '../../../../store/redux-slices/adminUser'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const useAdminListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('superAdminUserId')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [over, setOver] = useState(false)
  const [superAdminUserId, setSAdminUserId] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const { data } = useSelector((state) => state.admins)
  const totalPages = Math.ceil(data?.count / limit)
  const { adminRole } = useSelector((state) => state.login)
  const isInitialRender = useDidMountEffect()

  const getRole = (id) =>
    adminRole && adminRole.find((obj) => obj.superRoleId === id).name

  const handleShow = (id, active) => {
    setSAdminUserId(id)
    setActive(!active)
    setShow(true)
  }

  const fetchData = () => {
    dispatch(
      getAllAdminsStart({
        limit,
        pageNo: page,
        orderBy,
        sort,
        search,
        superAdminId: '',
        superRoleId: ''
      })
    )
  }

  const handleYes = () => {
    dispatch(
      updateSAdminStatusStart({
        data: {
          code: 'SUPERADMIN',
          status: active,
          adminId: superAdminUserId
        },
        limit,
        pageNo: page,
        orderBy,
        sort,
        search,
        superAdminId: '',
        superRoleId: ''
      })
    )
    setShow(false)
  }
  const selected = (h) =>
    orderBy === h.value &&
    h.label !== 'Role' &&
    h.label !== 'Status' &&
    h.label !== 'Action' &&
    h.label !== 'Group'

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (page === 1) {
          fetchData()
        } else {
          setPage(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  useEffect(() => {
    !isInitialRender && fetchData()
  }, [page])

  useEffect(() => {
    setPage(1)
    fetchData()
  }, [limit, orderBy, sort])

  return {
    navigate,
    limit,
    setLimit,
    page,
    setPage,
    setOrderBy,
    sort,
    setSort,
    search,
    setSearch,
    show,
    setShow,
    over,
    setOver,
    data,
    totalPages,
    getRole,
    handleShow,
    handleYes,
    selected,
    active
  }
}

export default useAdminListing
