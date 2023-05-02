import React from 'react'
import {
  Row,
  Col,
  Table,
  Form,
  Button,
  ButtonGroup
} from '@themesberg/react-bootstrap'
import PaginationComponent from '../../../components/Pagination'
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faCheckSquare,
  faEdit,
  faTrash,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons'

import Trigger from '../../../components/OverlayTrigger'
import Preloader from '../../../components/Preloader'
import useCasinoGamesListing from './hooks/useCasinoGamesListing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ConfirmationModal, { DeleteConfirmationModal } from '../../../components/ConfirmationModal'
import EditGames from './components/EditGames'
import { allowedKeysforOrder, tableHeaders } from './constants'
import ProviderFilter from '../../../components/ProviderFilter'
import useCheckPermission from '../../../utils/checkPermission'
import { AdminRoutes } from '../../../routes'

const CasinoGames = () => {
  const {
    limit,
    page,
    loading,
    setLimit,
    setPage,
    totalPages,
    games,
    casinoCategoryId,
    setCasinoCategoryId,
    subCategories,
    show,
    setShow,
    handleShow,
    handleYes,
    active,
    handleShowModal,
    showModal,
    type,
    handleClose,
    gameData,
    categoryGameId,
    setDeleteModalShow,
    deleteModalShow,
    handleDeleteYes,
    handleDeleteModal,
    statusFilter,
    setStatusFilter,
    setOrderBy,
    setSort,
    setOver,
    selected,
    sort,
    over,
    selectedProvider,
    setSelectedProvider,
    getProviderName,
    navigate
  } = useCasinoGamesListing()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col xs='auto'>
                <h3>Casino Games</h3>
              </Col>

              <Col xs='auto' className='ms-auto'>
                <div className='d-flex justify-content-end align-items-center w-100'>
                  <ProviderFilter
                    selectedProvider={selectedProvider}
                    setSelectedProvider={setSelectedProvider}
                  />

                  <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px', minWidth: 'fit-content' }}>
                    Sub Category
                  </Form.Label>

                  <Form.Select
                    style={{ marginBottom: '0', marginRight: '15px', maxWidth: '230px' }}
                    value={casinoCategoryId}
                    size='sm'
                    onChange={(e) => setCasinoCategoryId(e.target.value)}
                  >
                    <option value=''>All</option>

                    {subCategories && subCategories?.rows?.map((c) => (
                      <option key={c?.masterGameSubCategoryId} value={c?.masterGameSubCategoryId}>{c?.name?.EN}</option>
                    ))}
                  </Form.Select>

                  <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                    Status
                  </Form.Label>

                  <Form.Select
                    onChange={(e) => { setStatusFilter(e.target.value) }}
                    value={statusFilter}
                    size='sm'
                    style={{ maxWidth: '230px', marginRight: '5px' }}
                  >
                    <option value=''>All</option>
                    <option value='true'>Active</option>
                    <option value='false'>In-Active</option>
                  </Form.Select>

                  <Button
                    variant='success'
                    size='sm'
                    onClick={() => navigate(AdminRoutes.GameReorder)}
                  >
                    Reorder
                  </Button>
                </div>
              </Col>
            </Row>

            {/* <ListGroup.Item>
                  <Card.Text className='text-right'>
                    <Button
                      variant='success'
                      className='f-right'
                      style={{ marginRight: '10px' }}
                      size='sm'
                      onClick={() => handleShowModal('Create')}
                    >
                      Create
                    </Button>
                  </Card.Text>
                </ListGroup.Item> */}

            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
              <thead className='thead-dark'>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => allowedKeysforOrder.includes(h.value) ? setOrderBy(h.value) : setOrderBy(allowedKeysforOrder[0])}
                      style={{
                        cursor: 'pointer'
                      }}
                      className={
                            selected(h)
                              ? 'border-3 border border-blue'
                              : ''
                          }
                    >
                      {h.label} &nbsp;
                      {selected(h) &&
                            (sort === 'asc'
                              ? (
                                <FontAwesomeIcon
                                  style={over ? { color: 'red' } : {}}
                                  icon={faArrowCircleUp}
                                  onClick={() => setSort('desc')}
                                  onMouseOver={() => setOver(true)}
                                  onMouseLeave={() => setOver(false)}
                                />
                                )
                              : (
                                <FontAwesomeIcon
                                  style={over ? { color: 'red' } : {}}
                                  icon={faArrowCircleDown}
                                  onClick={() => setSort('asc')}
                                  onMouseOver={() => setOver(true)}
                                  onMouseLeave={() => setOver(false)}
                                />
                                ))}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {games?.count > 0 &&
                    games?.rows?.map(
                      ({
                        name,
                        isActive,
                        masterCasinoGameId: categoryGameId,
                        thumbnailUrl,
                        masterGameSubCategoryId,
                        MasterGameSubCategory: {
                          name: subCategoryName,
                          isActive: subCategoryActive,
                          MasterGameCategory: {
                            name: categoryName,
                            isActive: categoryActive
                          }
                        },
                        masterCasinoProviderId
                      }, index) => {
                        return (
                          <tr key={categoryGameId}>
                            <td>{categoryGameId}</td>
                            <td>
                              <Trigger message={name}>
                                <span
                                  style={{
                                    width: '100px',
                                    cursor: 'pointer'
                                  }}
                                  className='d-inline-block text-truncate'
                                >
                                  {name}
                                </span>
                              </Trigger>
                            </td>

                            <td>
                              <span
                                onClick={() => window.open(thumbnailUrl)}
                                className='text-link'
                                style={{ cursor: 'pointer' }}
                              >
                                View Thumbnail
                              </span>
                            </td>

                            <td>
                              {isActive
                                ? (
                                  <span className='text-success'>Active</span>
                                  )
                                : (
                                  <span className='text-danger'>In Active</span>
                                  )}
                            </td>

                            <td>{getProviderName(masterCasinoProviderId)}</td>

                            <td>
                              {subCategoryName?.EN}
                              {'  ( '}
                              {subCategoryActive
                                ? <span className='text-success'>Active</span>
                                : <span className='text-danger'>In Active</span>}
                              {' )'}
                            </td>

                            <td>
                              {categoryName?.EN}
                              {'  ( '}
                              {categoryActive
                                ? <span className='text-success'>Active</span>
                                : <span className='text-danger'>In Active</span>}
                              {' )'}
                            </td>

                            <td>
                              <ButtonGroup>
                                <Trigger message='Edit'>
                                  <Button
                                    className='m-1'
                                    size='sm'
                                    variant='warning'
                                    hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                                    onClick={() => {
                                      handleShowModal('Edit', games?.rows[index], categoryGameId)
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Button>
                                </Trigger>

                                {!isActive
                                  ? (
                                    <Trigger message='Set Game Status Active'>
                                      <Button
                                        className='m-1'
                                        size='sm'
                                        variant='success'
                                        hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                        onClick={() =>
                                          handleShow(categoryGameId, masterGameSubCategoryId, isActive)}
                                      >
                                        <FontAwesomeIcon icon={faCheckSquare} />
                                      </Button>
                                    </Trigger>
                                    )
                                  : (
                                    <Trigger message='Set Game Status In-Active'>
                                      <Button
                                        className='m-1'
                                        size='sm'
                                        variant='danger'
                                        hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                        onClick={() =>
                                          handleShow(categoryGameId, masterGameSubCategoryId, isActive)}
                                      >
                                        <FontAwesomeIcon icon={faWindowClose} />
                                      </Button>
                                    </Trigger>
                                    )}

                                <Trigger message='Delete'>
                                  <Button
                                    className='m-1'
                                    size='sm'
                                    variant='danger'
                                    hidden={isHidden({ module: { key: 'CasinoManagement', value: 'D' } })}
                                    onClick={() => handleDeleteModal(categoryGameId)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </Trigger>
                              </ButtonGroup>
                            </td>
                          </tr>
                        )
                      }
                    )}

                {games?.count === 0 &&
                      (
                        <tr>
                          <td
                            colSpan={8}
                            className='text-danger text-center'
                          >
                            No data found
                          </td>
                        </tr>
                      )}
              </tbody>
            </Table>

            {games?.count !== 0 &&
            (
              <PaginationComponent
                page={games?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </>
          )}

      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
        />
      )}

      {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
          />)}

      {categoryGameId !== null && 
        <EditGames
          handleClose={handleClose}
          show={showModal}
          gameData={gameData}
          type={type}
          subCategories={subCategories}
          limit={limit}
          pageNo={page}
          casinoCategoryId={casinoCategoryId}
          statusFilter={statusFilter}
          providerId={selectedProvider}
        />}
    </>

  )
}

export default CasinoGames
