import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSAdminAggregatorStart, getSAdminAggregatorsStart, updateSAdminAggregatorStatusStart } from '../../../store/redux-slices/superAdminCasinoManagement'

const useAggregatorListing = () => {
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [id, setId] = useState()
  const [status, setStatus] = useState()
  const [statusShow, setStatusShow] = useState(false)
  const [show, setShow] = useState(false)
  const { loading, aggregators } = useSelector((state) => state.superAdminCasino)
  const totalPages = Math.ceil(aggregators?.count / limit)

  const handleStatusShow = (id, status) => {
    setId(id)
    setStatus(!status)
    setStatusShow(true)
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleYes = () => {
    dispatch(
      updateSAdminAggregatorStatusStart({
        data: {
          code: 'AGGREGATOR',
          masterGameAggregatorId: id,
          status
        },
        limit,
        pageNo: page
      })
    )
      setStatusShow(false)
  }

  useEffect(() => {
    dispatch(getSAdminAggregatorsStart({ limit, pageNo: page }))
  }, [limit, page])

  const createAggregator = (data) =>
    dispatch(createSAdminAggregatorStart({ data, limit, pageNo: page }))

  return {
    aggregators,
    limit,
    setLimit,
    page,
    setPage,
    totalPages,
    handleStatusShow,
    handleYes,
    statusShow,
    setStatusShow,
    show,
    handleClose,
    createAggregator,
    handleShow,
    loading,
    status
  }
}

export default useAggregatorListing
