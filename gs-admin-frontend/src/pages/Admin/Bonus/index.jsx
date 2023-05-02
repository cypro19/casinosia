import {
  Row,
  Col,
  ButtonGroup,
  Button,
  Form as BForm
} from '@themesberg/react-bootstrap'
import React from 'react'
import Preloader from '../../../components/Preloader'
import { tableHeaders } from './bonusConstant'
import useBonus from './hooks/useBonus'
import { bonusType } from './components/CreateBonus/constants'
import BonusListing from '../../../components/BonusListing'
import useCheckPermission from '../../../utils/checkPermission'

const BonusManagement = () => {
  const {
    bonusList,
    navigate,
    loading,
    handleShow,
    show,
    setShow,
    handleYes,
    active,
    limit,
    setLimit,
    setPage,
    page,
    totalPages,
    bonusTyp,
    setBonusTyp,
    search,
    setSearch,
    isActive,
    setIsActive
  } = useBonus()
  const { isHidden } = useCheckPermission()

  return loading
    ? <Preloader />
    : (
      <>
        <Row>
          <Col>
            <h3>Bonus </h3>
          </Col>

          <Col xs='auto'>
            <div className='d-flex justify-content-end align-items-center'>
              <ButtonGroup>
                <Button
                  className='m-1'
                  size='sm'
                  variant='success'
                  hidden={isHidden({ module: { key: 'Bonus', value: 'C' } })}
                  onClick={() => navigate('/admin/create-bonus')}
                >
                  Create
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>

        <Row>
          <Col className='d-flex' xs='auto'>
            <BForm.Label column='sm' style={{ marginRight: '15px', minWidth: 'fit-content' }}>
              Bonus Type
            </BForm.Label>
            <BForm.Select
              name='bonusType'
              size='sm'
              value={bonusTyp}
              onChange={(e) => setBonusTyp(e.target.value)}
              style={{ maxWidth: '230px' }}
            >
              <option value='' key=''>
                All
              </option>
              {bonusType.map((item) => {
                return (
                  item.value !== 'cashfreespins' &&
                    <option key={`bonusType ${item.value}`} value={item.value}>
                      {item.value === 'freespins' ? 'FREESPINS' : item?.label}
                    </option>
                )
              })}
            </BForm.Select>
          </Col>

          <Col className='d-flex' xs='auto'>
            <BForm.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
              Search
            </BForm.Label>

            <BForm.Control
              type='search'
              value={search}
              placeholder='Search Promotion Title'
              size='sm'
              style={{ maxWidth: '230px' }}
              onChange={(event) => setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))}
            />
          </Col>

          <Col className='d-flex' xs='auto'>
            <BForm.Label column='sm' style={{ marginRight: '15px', minWidth: 'fit-content' }}>
              Status
            </BForm.Label>
            <BForm.Select
              name='isActive'
              size='sm'
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              style={{ maxWidth: '230px' }}
            >
              <option value='' key=''>
                All
              </option>
              <option value='true' key='active'>
                Active
              </option>
              <option value='false' key='in-active'>
                In-Active
              </option>
            </BForm.Select>
          </Col>
        </Row>

        <BonusListing
          bonusList={bonusList}
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          tableHeaders={tableHeaders}
          show={show}
          setShow={setShow}
          handleYes={handleYes}
          active={active}
          handleShow={handleShow}
          navigate={navigate}
        />
      </>
      )
}

export default BonusManagement
