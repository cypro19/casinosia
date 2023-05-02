import React from 'react'
import {
  Button,
  Form,
  Row,
  Col,
  Table,
  ButtonGroup
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckSquare,
  faWindowClose,
  faEye,
  faArrowCircleUp,
  faArrowCircleDown,
  faEdit
  // faEdit
} from '@fortawesome/free-solid-svg-icons'
import ConfirmationModal from '../../../components/ConfirmationModal'
import PaginationComponent from '../../../components/Pagination'
import { tableHeaders } from './constants'
// import { AdminRoutes } from '../../../routes'
import useAdminListing from './hooks/useAdminListing'
import Trigger from '../../../components/OverlayTrigger'
import { AdminRoutes } from '../../../routes'
import useCheckPermission from '../../../utils/checkPermission'

export default () => {
  const {
    navigate,
    limit,
    setLimit,
    page,
    setPage,
    setOrderBy,
    sort,
    setSort,
    setSearch,
    search,
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
  } = useAdminListing()

  const { isHidden } = useCheckPermission()

  return (
    <>
      <Row>
        <Col>
          <h3>Staff</h3>
        </Col>

        <Col>
          <div className='d-flex justify-content-end'>
            <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
              Search
            </Form.Label>

            <Form.Control
              type='search'
              placeholder='Search by Email, Name, Group'
              value={search}
              size='sm'
              style={{ maxWidth: '230px', marginRight: '10px', maxHeight: '15px', marginTop: '5px' }}
              onChange={(event) => {
                const mySearch = event.target.value.replace(/[^\w\s+@.]/gi, '')
                setSearch(mySearch)
              }}
            />
            {/* Button to create new admin */}
            <Button
              variant='success'
              className='mb-2 m-1'
              size='sm'
              onClick={() =>
                navigate(AdminRoutes.CreateSAdminUser)}
              hidden={isHidden({ module: { key: 'Admins', value: 'C' } })}
            >
              Create
            </Button>
          </div>
        </Col>
      </Row>

      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {tableHeaders.map((h, idx) => (
              <th
                key={idx}
                onClick={() => setOrderBy(h.value)}
                style={{
                  cursor: 'pointer'
                }}
                className={
                      selected(h)
                        ? 'border-3 border border-blue'
                        : ''
                    }
              >
                {h.label}{' '}
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
          {data &&
                data?.rows?.map(
                  ({
                    superAdminUserId,
                    email,
                    firstName,
                    lastName,
                    superRoleId,
                    isActive,
                    group
                  }) => {
                    return (
                      <tr key={email}>
                        <td>{superAdminUserId}</td>
                        <td>
                          <span
                            onClick={() =>
                              navigate(
                                `/admin/admin-details/${superAdminUserId}`
                              )}
                            className='text-link'
                            style={{ cursor: 'pointer' }}
                          >
                            {email}
                          </span>
                        </td>
                        <td>
                          <Trigger message={`${firstName} ${lastName}`}>
                            <span
                              style={{
                                width: '100px',
                                cursor: 'pointer'
                              }}
                              className='d-inline-block text-truncate text-link'
                            >
                              {firstName} {lastName}
                            </span>
                          </Trigger>

                        </td>
                        <td>{getRole(superRoleId)}</td>

                        <td>{group || '-'}</td>

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
                                onClick={() =>
                                  navigate(
                                    `/admin/edit-admin-user/${superAdminUserId}`
                                  )}
                                hidden={isHidden({ module: { key: 'Admins', value: 'U' } })}
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
                                    `/admin/admin-details/${superAdminUserId}`
                                  )}
                                hidden={isHidden({ module: { key: 'Admins', value: 'R' } })}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>
                            </Trigger>

                            {/* <Button
                                    className='m-1'
                                    size='sm'
                                    variant='secondary'
                                  >
                                    <FontAwesomeIcon icon={faSitemap} />
                                  </Button> */}
                            
                            {(!isActive
                              ? (<>{getRole(superRoleId) !== 'Admin' &&( 
                                <Trigger message='Set Status Active'>
                                  <Button
                                    className='m-1'
                                    size='sm'
                                    variant='success'
                                    onClick={() =>
                                      handleShow(superAdminUserId, isActive)}
                                    hidden={isHidden({ module: { key: 'Admins', value: 'T' } })}
                                  >
                                    <FontAwesomeIcon icon={faCheckSquare} />
                                  </Button>
                                </Trigger>)}</>
                                )
                              : (<>
                                {getRole(superRoleId) !== 'Admin' &&(
                                <Trigger message='Set Status In-Active'>
                                  <Button
                                    className='m-1'
                                    size='sm'
                                    variant='danger'
                                    onClick={() =>
                                      handleShow(superAdminUserId, isActive)}
                                    hidden={isHidden({ module: { key: 'Admins', value: 'T' } })}
                                  >
                                    <FontAwesomeIcon icon={faWindowClose} />
                                  </Button>
                                </Trigger>)}</>)
                            )}
                            {getRole(superRoleId) !== 'Support' &&
                              <Trigger message='View Tree'>
                                <Button
                                  className='m-1'
                                  size='sm'
                                  variant='secondary'
                                  style={{ width: '35px' }}
                                  onClick={() =>
                                    navigate(
                                    `/admin/admin-details/${superAdminUserId}`,
                                    {
                                      state: {
                                        isTreeView: true
                                      }
                                    }
                                    )}
                                  hidden={isHidden({ module: { key: 'Admins', value: 'R' } })}
                                >
                                  <img height='20px' src='https://static.thenounproject.com/png/1320675-200.png' />

                                </Button>
                              </Trigger>}
                          </ButtonGroup>
                        </td>
                      </tr>
                    )
                  }
                )}

          {data?.count === 0 &&
                (
                  <tr>
                    <td
                      colSpan={6}
                      className='text-danger text-center'
                    >
                      No data found
                    </td>
                  </tr>
                )}
        </tbody>
      </Table>

      {data?.count !== 0 &&
          (
            <PaginationComponent
              page={data?.count < page ? setPage(1) : page}
              totalPages={totalPages}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />

          )}

      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
        />
      )}
    </>
  )
}
