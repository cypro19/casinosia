import React from 'react'
import {
  Button,
  Row,
  Col,
  Table,
  ButtonGroup
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PaginationComponent from '../../../components/Pagination'
import ConfirmationModal, { DeleteConfirmationModal } from '../../../components/ConfirmationModal'
import {
  faCheckSquare,
  faEdit,
  faTrash,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons'

import CreateCasinoCategory from './components/CreateCasinoCategory'
import useCasinoCategoriesListing from './hooks/useCasinoCategoriesListing'
import Trigger from '../../../components/OverlayTrigger'
import Preloader from '../../../components/Preloader'
import useCheckPermission from '../../../utils/checkPermission'

export default () => {
  const {
    limit,
    page,
    loading,
    casinoCategories,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages,
    handleShow,
    handleYes,
    handleShowModal,
    showModal,
    type,
    handleClose,
    selectedCategory,
    setSelectedCategory,
    active,
    navigate,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow
  } = useCasinoCategoriesListing()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row className='mb-2'>
              <Col>
                <h3>Casino Categories</h3>
              </Col>

              <Col>
                <div className='d-flex justify-content-end'>
                  <Button
                    variant='success'
                    size='sm'
                    style={{ marginRight: '10px' }}
                    hidden={isHidden({ module: { key: 'CasinoManagement', value: 'C' } })}
                    onClick={() => handleShowModal('Create')}
                  >
                    Create
                  </Button>

                  <Button
                    variant='success'
                    size='sm'
                    hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                    onClick={() => navigate('/admin/reorder-category')}
                  >
                    Reorder
                  </Button>
                </div>
              </Col>
            </Row>

            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
              <thead className='thead-dark'>
                <tr>
                  {[
                    'Category Id',
                    'Name',
                    'Order Id',
                    'Status',
                    'Actions'
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {casinoCategories?.count > 0 &&
                    casinoCategories?.rows?.map(
                      ({
                        name,
                        masterGameCategoryId,
                        isActive,
                        orderId
                      }) => {
                        return (
                          <tr key={masterGameCategoryId}>
                            <td>{masterGameCategoryId}</td>
                            <td>
                              <Trigger message={name?.EN}>
                                <span
                                  style={{
                                    width: '100px',
                                    cursor: 'pointer'
                                  }}
                                  className='d-inline-block text-truncate'
                                >
                                  {name?.EN}
                                </span>
                              </Trigger>
                            </td>

                            <td>{orderId}</td>

                            <td>
                              {isActive
                                ? (
                                  <span className='text-success'>Active</span>
                                  )
                                : (
                                  <span className='text-danger'>In Active</span>
                                  )}
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
                                      setSelectedCategory({ categoryId: masterGameCategoryId, name, isActive })
                                      handleShowModal('Edit')
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Button>
                                </Trigger>

                                {!isActive
                                  ? (
                                    <Trigger message='Set Status Active'>
                                      <Button
                                        className='m-1'
                                        size='sm'
                                        variant='success'
                                        hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                        onClick={() =>
                                          handleShow(masterGameCategoryId, isActive)}
                                      >
                                        <FontAwesomeIcon icon={faCheckSquare} />
                                      </Button>
                                    </Trigger>
                                    )
                                  : (
                                    <Trigger message='Set Status In-Active'>
                                      <Button
                                        className='m-1'
                                        size='sm'
                                        variant='danger'
                                        hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                        onClick={() =>
                                          handleShow(masterGameCategoryId, isActive)}
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
                                    onClick={() => handleDeleteModal(masterGameCategoryId)}
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

                {casinoCategories?.count === 0 &&
                      (
                        <tr>
                          <td
                            colSpan={5}
                            className='text-danger text-center'
                          >
                            No data found
                          </td>
                        </tr>
                      )}
              </tbody>
            </Table>

            {casinoCategories?.count !== 0 &&
            (
              <PaginationComponent
                page={casinoCategories?.count < page ? setPage(1) : page}
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

      {type === 'Edit'
        ? (
            selectedCategory && (
              <CreateCasinoCategory
                categoryName={selectedCategory.name}
                isActive={selectedCategory.isActive}
                categoryId={selectedCategory?.categoryId}
                handleClose={handleClose}
                limit={limit}
                pageNo={page}
                showModal={showModal}
                type={type}
              />
            )
          )
        : (
          <CreateCasinoCategory
            handleClose={handleClose}
            limit={limit}
            pageNo={page}
            showModal={showModal}
            type={type}
          />
          )}
    </>
  )
}
