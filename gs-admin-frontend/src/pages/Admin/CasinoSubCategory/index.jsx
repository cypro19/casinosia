import React from 'react'
import {
  Button,
  Row,
  Col,
  Table,
  ButtonGroup,
  Form
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PaginationComponent from '../../../components/Pagination'
import ConfirmationModal, { DeleteConfirmationModal } from '../../../components/ConfirmationModal'
import {
  faCheckSquare,
  faEdit,
  faWindowClose,
  faPlusSquare,
  faArrowCircleUp,
  faArrowCircleDown,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

import CreateSubCategory from './components/CreateSubCategory'
import useCasinoSubCategoriesListing from './hooks/useCasinoSubCategoriesListing'
import Trigger from '../../../components/OverlayTrigger'
import Preloader from '../../../components/Preloader'
import CustomIconPicker from '../../../components/CustomIconPicker'
import { allowedKeysforOrder, tableHeaders } from './constants'
import useCheckPermission from '../../../utils/checkPermission'

export default () => {
  const {
    limit,
    page,
    loading,
    subCategories,
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
    selectedSubCategory,
    setSelectedSubCategory,
    search,
    setSearch,
    setCategoryFilter,
    categoryFilter,
    active,
    navigate,
    statusFilter,
    setStatusFilter,
    setOrderBy,
    setSort,
    setOver,
    selected,
    sort,
    over,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow
  } = useCasinoSubCategoriesListing()
  const { isHidden } = useCheckPermission()
  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row className='mb-3'>
              <Col sm={8}>
                <h3>Casino Sub Categories</h3>
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
                    onClick={() => navigate('/admin/reorder-sub-category')}
                  >
                    Reorder
                  </Button>
                </div>
              </Col>
            </Row>

            <Row className='mb-3'>
              <Col xs='auto'>
                <div className='d-flex justify-content-start align-items-center w-100 mb-2'>
                  <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                    Category
                  </Form.Label>

                  <Form.Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    size='sm'
                    style={{ maxWidth: '230px' }}
                  >
                    <option value=''>All</option>

                    {casinoCategories && casinoCategories?.rows?.map((c) => (
                      <option key={c?.masterGameCategoryId} value={c?.masterGameCategoryId}>{c?.name?.EN}</option>
                    ))}
                  </Form.Select>
                </div>
              </Col>

              <Col xs='auto'>
                <div column='sm' className='d-flex justify-content-start align-items-center w-100'>
                  <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                    Status
                  </Form.Label>

                  <Form.Select
                    onChange={(e) => { setStatusFilter(e.target.value) }}
                    value={statusFilter}
                    size='sm'
                    style={{ maxWidth: '230px' }}
                  >
                    <option value=''>All</option>
                    <option value='true'>Active</option>
                    <option value='false'>In-Active</option>
                  </Form.Select>
                </div>
              </Col>

              <Col xs='auto'>
                <div className='d-flex justify-content-start align-items-center w-100'>
                  <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                    Search
                  </Form.Label>

                  <Form.Control
                    type='search'
                    value={search}
                    placeholder='Search Sub Category Name'
                    onChange={(event) =>
                      setSearch(
                        event.target.value.replace(/[~`!$%@^&*#=)()><?]+/g, '')
                      )}
                    size='sm'
                    style={{ minWidth: '205px' }}
                  />
                </div>
              </Col>
            </Row>

            <Table bordered striped responsive hover size='sm' className='text-center mt-3'>
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
                              ? 'border-3 border border-secondary'
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
                {subCategories?.count > 0 &&
                    subCategories?.rows?.map(
                      ({
                        name,
                        MasterGameCategory: { name: categoryName },
                        isActive,
                        masterGameSubCategoryId,
                        iconColor,
                        iconName,
                        masterGameCategoryId,
                        orderId
                      }) => {
                        return (
                          <tr key={masterGameSubCategoryId}>
                            <td>{masterGameSubCategoryId}</td>
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
                              <CustomIconPicker
                                name='iconName'
                                myIconColor={iconColor}
                                myIconName={iconName}
                                setItemStyle
                              />
                            </td>

                            <td>
                              <Trigger message={categoryName?.EN}>
                                <span
                                  style={{
                                    width: '100px',
                                    cursor: 'pointer'
                                  }}
                                  className='d-inline-block text-truncate'
                                >
                                  {categoryName?.EN}
                                </span>
                              </Trigger>
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
                                      setSelectedSubCategory({
                                        masterGameCategoryId,
                                        masterGameSubCategoryId,
                                        name,
                                        isActive,
                                        iconColor,
                                        iconName
                                      })
                                      handleShowModal('Edit')
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Button>
                                </Trigger>

                                <Trigger message='Add Games to this sub category'>
                                  <Button
                                    className='m-1'
                                    size='sm'
                                    variant='dark'
                                    hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                                    onClick={() =>
                                      navigate(
                                      `/admin/add-games/${masterGameSubCategoryId}`,
                                      { state: { subCategoryName: name } }
                                      )}
                                  >
                                    <FontAwesomeIcon icon={faPlusSquare} />
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
                                          handleShow(masterGameSubCategoryId, isActive)}
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
                                          handleShow(masterGameSubCategoryId, isActive)}
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
                                    onClick={() => handleDeleteModal(masterGameSubCategoryId)}
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

                {subCategories?.count === 0 &&
                      (
                        <tr>
                          <td
                            colSpan={7}
                            className='text-danger text-center'
                          >
                            No data found
                          </td>
                        </tr>
                      )}
              </tbody>
            </Table>

            {subCategories?.count !== 0 &&
            (
              <PaginationComponent
                page={subCategories?.count < page ? setPage(1) : page}
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
            selectedSubCategory && (
              <CreateSubCategory
                selectedSubCategory={selectedSubCategory}
                handleClose={handleClose}
                limit={limit}
                pageNo={page}
                showModal={showModal}
                type={type}
                search={search}
                categoryFilter={categoryFilter}
                statusFilter={statusFilter}
              />
            )
          )
        : (
          <CreateSubCategory
            handleClose={handleClose}
            limit={limit}
            pageNo={page}
            showModal={showModal}
            type={type}
            search={search}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
          />
          )}
    </>
  )
}
