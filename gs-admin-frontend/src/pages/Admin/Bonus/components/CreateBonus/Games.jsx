import { Col, Row, Spinner, Form as BForm, Button } from '@themesberg/react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ProviderFilter from '../../../../../components/ProviderFilter'
import { getAllCasinoGamesStart, getFreeSpinGamesStart, getAllMasterGamesStart } from '../../../../../store/redux-slices/superAdminCasinoManagement'
import GamesListEdit from './GamesListEdit'
import useDidMountEffect from '../../../../../utils/useDidMountEffect'

const Games = ({
  gameIds,
  setGameIds,
  setLimit,
  setPageNo,
  setSearch,
  search,
  totalPages,
  limit,
  pageNo,
  loading,
  handleSubmit,
  handleBlur,
  casinoGamesData,
  selectedProvider,
  setSelectedProvider,
  setSelectedTab,
  isEdit,
  errors,
  details,
  isClone,
  values
}) => {
  const dispatch = useDispatch()
  const { bonusId } = useParams()
  const isInitialRender = useDidMountEffect()
  const [change, setChange] = useState(false)
  const { bonusDetail } = useSelector(state => state.bonus)

  useEffect(() => {
    if (bonusDetail?.gameIds) {
      setGameIds(bonusDetail?.gameIds)
    }
  }, [bonusDetail])

  const SAFreeSpin = () => {
    (values?.bonusType === 'freespins' || values?.bonusType === 'cashfreespins') &&
    dispatch(
      getFreeSpinGamesStart({
        limit,
        pageNo,
        search,
        providerId: selectedProvider,
        bonusId
      }))
  }
  const SAGames = () => {
    (values?.bonusType === 'freespins' || values?.bonusType === 'cashfreespins') &&
    dispatch(
      getAllCasinoGamesStart({
        limit,
        pageNo,
        casinoCategoryId: '',
        search,
        isActive: '',
        selectedProvider,
        freespins: true,
        bonusId: isEdit ? bonusId : ''
      })
    )
  }

  const TAGames = () => {
    (values?.bonusType === 'freespins' || values?.bonusType === 'cashfreespins') &&
    dispatch(
      getAllMasterGamesStart({
        limit,
        pageNo,
        search,
        casinoCategoryId: '',
        providerId: selectedProvider,
        freespins: true,
        bonusId
      })
    )
  }

  useEffect(() => {
    setPageNo(1)
    if ((isEdit || details) && bonusId && !change) {
      SAFreeSpin()
    } else {
      SAGames()
    }
  }, [limit, bonusId, selectedProvider])

  useEffect(() => {
    if (!isInitialRender) {
      if ((isEdit || details) && bonusId && !change) {
        SAFreeSpin()
      } else {
         SAGames()
      }
    }
  }, [pageNo])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (pageNo === 1) {
          if ((isEdit || details) && bonusId && !change) {
            SAFreeSpin()
          } else {
            SAGames()
          }
        } else {
          setPageNo(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  return (
    <>
      <Row className='d-flex'>
        <Col xs='auto' className='d-flex align-items-center provider'>
          <ProviderFilter
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
          />
        </Col>
        <Col xs='auto' className='d-flex align-items-center'>
          <BForm.Label>
            Search
          </BForm.Label>

          <BForm.Control
            type='search'
            size='sm'
            style={{ marginLeft: '10px', maxWidth: '230px' }}
            placeholder='Search Game Name'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={handleBlur}
          />
        </Col>
        {isEdit && bonusId &&
          <Col className='d-flex justify-content-end'>
            <Button
              variant='success'
              onClick={() => {
                setChange(true)
                setPageNo(1)
                setLimit(15)
                SAGames()
              }}
            >Add
            </Button>
          </Col>}
      </Row>

      <Row />

      <Row>
        {casinoGamesData &&
          <GamesListEdit
            gameIds={gameIds}
            casinoGamesData={casinoGamesData || []}
            setGameIds={setGameIds}
            page={pageNo}
            limit={limit}
            setLimit={setLimit}
            setPage={setPageNo}
            totalPages={totalPages}
            isEdit={isEdit}
            details={details}
          />}
      </Row>

      {!details &&
        <div
          className='mt-4 d-flex justify-content-between align-items-center'
        >
          <Button
            variant='warning'
            onClick={() => setSelectedTab('currency')}
          >
            Previous
          </Button>

          <div>
            <Button
              variant='success'
              onClick={() => {
                handleSubmit()
              }}
            >
              Submit
              {loading && (
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
              )}
            </Button>
          </div>
        </div>}
    </>
  )
}

export default Games
