import React from 'react'
import {
  Button,
  Form,
  Row,
  Col,
  Table
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faEdit, faEye, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import PaginationComponent from '../../../components/Pagination'
import useCmsListing from './hooks/useCmsListing'
import Trigger from '../../../components/OverlayTrigger'
import Preloader from '../../../components/Preloader'
import { AdminRoutes } from '../../../routes'
import useCheckPermission from '../../../utils/checkPermission'
import ConfirmationModal from '../../../components/ConfirmationModal'

export default () => {
  const {
    page,
    limit,
    setPage,
    setLimit,
    setSearch,
    search,
    navigate,
    cmsData,
    totalPages,
    loading,
    handleStatusShow,
    statusShow,
    setStatusShow,
    handleYes,
    status,
    active,
    setActive
  } = useCmsListing()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {
        loading
          ? <Preloader />
          : (
            <>
              <Row>
                <Col>
                  <h3>CMS</h3>
                </Col>

                <Col xs='auto'>
                  <div className='d-flex justify-content-end align-items-center'>

                    <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '5px' }}>
                      Search
                    </Form.Label>

                    <Form.Control
                      type='search'
                      size='sm'
                      style={{ maxWidth: '230px', marginRight: '10px' }}
                      value={search}
                      placeholder='Search title, slug'
                      onChange={(event) =>
                        setSearch(
                          event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
                        )}
                    />

                    <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '5px' }}>
                      Status
                    </Form.Label>

                    <Form.Select
                      size='sm'
                      style={{ maxWidth: '200px', marginRight: '10px' }}
                      value={active}
                      onChange={(event) =>
                        setActive(
                          event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
                        )}
                    >
                      <option key='' value=''>All</option>
                      <option key='true' value>Active</option>
                      <option key='false' value={false}>In-Active</option>
                    </Form.Select>

                    <Button
                      variant='success'
                      className='f-right'
                      size='sm'
                      onClick={() => navigate(AdminRoutes.CreateCMS)}
                      hidden={isHidden({ module: { key: 'CMS', value: 'C' } })}
                    >
                      Create
                    </Button>
                  </div>
                </Col>
              </Row>

              <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                <thead className='thead-dark'>
                  <tr>
                    {['Id', 'Title', 'Slug', 'Status', 'Action'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Boolean(cmsData) &&
                    cmsData?.rows?.map(
                      ({ cmsPageId, title, slug, isActive }) => {
                        return (
                          <tr key={cmsPageId}>
                            <td>{cmsPageId}</td>

                            <td>
                              <Trigger message={title?.EN}>
                                <span
                                  style={{
                                    width: '150px',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/admin/cms-details/${cmsPageId}`
                                    )}
                                  className='text-link d-inline-block text-truncate'
                                >
                                  {title?.EN}
                                </span>
                              </Trigger>
                            </td>

                            <td>{slug}</td>

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
                              <Trigger message='Edit'>
                                <Button
                                  className='m-1'
                                  size='sm'
                                  variant='warning'
                                  onClick={() =>
                                    navigate(
                                      `/admin/edit-cms/${cmsPageId}`
                                    )}
                                  hidden={isHidden({ module: { key: 'CMS', value: 'U' } })}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                              </Trigger>
                              <Trigger message='View Details'>
                                <Button
                                  className='m-1'
                                  size='sm'
                                  variant='info'
                                  onClick={() =>
                                    navigate(
                                      `/admin/cms-details/${cmsPageId}`
                                    )}
                                  hidden={isHidden({ module: { key: 'CMS', value: 'R' } })}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </Button>
                              </Trigger>

                              {!isActive
                                ? (
                                  <Trigger message='Set Status Active'>
                                    <Button
                                      className='m-1'
                                      size='sm'
                                      variant='success'
                                      onClick={() =>
                                        handleStatusShow(cmsPageId, isActive)}
                                      hidden={isHidden({ module: { key: 'CMS', value: 'T' } })}
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
                                      onClick={() =>
                                        handleStatusShow(cmsPageId, isActive)}
                                      hidden={isHidden({ module: { key: 'CMS', value: 'T' } })}
                                    >
                                      <FontAwesomeIcon icon={faWindowClose} />
                                    </Button>
                                  </Trigger>
                                  )}
                            </td>
                          </tr>
                        )
                      }
                    )}

                  {cmsData?.count === 0 && (
                    <tr>
                      <td colSpan={6} className='text-danger text-center'>
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {cmsData?.count !== 0 && (
                <PaginationComponent
                  page={cmsData?.count < page ? setPage(1) : page}
                  totalPages={totalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              )}
            </>
            )
    }
      <ConfirmationModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleYes}
        active={status}
      />
    </>
  )
}
