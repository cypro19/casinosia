import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { resetRestrictedCountriesStart } from '../../../store/redux-slices/fetchData'
import { createCasinoProviderStart, getAllCasinoProvidersStart, getSAdminAggregatorsStart, updateCasinoProviderStart, updateCasinoStatusStart } from '../../../store/redux-slices/superAdminCasinoManagement'

const useProviderListing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [show, setShow] = useState(false)
  const [providerId, setProviderId] = useState()
  const [status, setStatus] = useState()
  const [statusShow, setStatusShow] = useState(false)
  const [data, setData] = useState()
  const [type, setType] = useState('')

  const { casinoProvidersData, aggregators, loading } = useSelector((state) => state.superAdminCasino)
  const totalPages = Math.ceil(casinoProvidersData?.count / limit)

  const handleClose = () => setShow(false)
  const handleShow = (type, data) => {
    setType(type)
    setData(data)
    setShow(true)
  }

  const handleStatusShow = (id, status) => {
    setProviderId(id)
    setStatus(!status)
    setStatusShow(true)
  }

  const handleYes = () => {
    dispatch(
      updateCasinoStatusStart({
        data: {
          code: 'CASINO_PROVIDER',
          masterCasinoProviderId: providerId,
          status
        },
        limit,
        pageNo: page
      })
    )
      setStatusShow(false)
  }

  useEffect(() => {
    dispatch(getAllCasinoProvidersStart({ limit, pageNo: page }))
    dispatch(resetRestrictedCountriesStart())
  }, [limit, page])

  useEffect(() => {
    show && dispatch(getSAdminAggregatorsStart({ limit: '', pageNo: '' }))
  }, [show])

  const updateProvider = (data, { masterCasinoProviderId }) =>
    dispatch(
      updateCasinoProviderStart({
        data: {
          ...data,
          masterCasinoProviderId
        },
        limit,
        pageNo: page
      }))

  const createProvider = (data) =>
    dispatch(
      createCasinoProviderStart({
        data,
        limit,
        pageNo: page
      })
    )

  return {
    limit,
    setLimit,
    page,
    setPage,
    show,
    statusShow,
    setStatusShow,
    data,
    type,
    casinoProvidersData,
    totalPages,
    handleClose,
    handleShow,
    handleStatusShow,
    handleYes,
    aggregators,
    loading,
    createProvider,
    updateProvider,
    status,
    navigate
  }
}

export default useProviderListing
