import React from 'react'
import {
  Button,
  Form,
  Row,
  Col,
  Table
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import PaginationComponent from '../../../components/Pagination'
import useAllUserListing from './useAllUserListing'
import Trigger from '../../../components/OverlayTrigger'
import Preloader from '../../../components/Preloader'
import { kycLabels } from './userConstant'

export default () => {
  const {
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    userData,
    totalPages,
    navigate,
    loading,
    kycOptions,
    setKycOptions
  } = useAllUserListing()

  return (
    <>
      {
      loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col>
                <h3>Players</h3>
              </Col>

              <Col xs='auto'>
                <div className='d-flex justify-content-end align-items-center'>
                  <Form.Label style={{ margin: '10px', whiteSpace: 'nowrap' }}>
                    Kyc Status
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => setKycOptions(e.target.value)}
                    value={kycOptions}
                    style={{ width: 'auto', marginRight: '10px' }}
                    size='sm'
                  >
                    {kycLabels.map((item) => {
                      return <option key={`kyc Labels ${item.value}`} value={item.value}>{item.label}</option>
                    })}

                  </Form.Select>

                  <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '5px' }}>
                    Search
                  </Form.Label>

                  <Form.Control
                    type='search'
                    placeholder='Search Email, Name'
                    size='sm'
                    style={{ maxWidth: '230px', marginRight: '10px', maxHeight: '15px' }}
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
                      )}
                  />
                </div>
              </Col>
            </Row>

            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
              <thead className='thead-dark'>
                <tr>
                  {['Id', 'email', 'First Name', 'status', 'kyc status', 'action'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Boolean(userData) &&
                  userData?.rows?.map(
                    ({ email, isActive, userId, firstName, kycStatus }) => {
                      return (
                        <tr key={userId}>
                          <td>{userId}</td>
                          <td>{email}</td>
                          <td>
                            <Trigger message={firstName}>
                              <span
                                style={{
                                  width: '100px',
                                  cursor: 'pointer'
                                }}
                                onClick={() =>
                                  navigate(
                                    `/admin/user-details/${userId}`
                                  )}
                                className='text-link d-inline-block text-truncate'
                              >
                                {firstName}
                              </span>
                            </Trigger>
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

                          <td>{kycStatus}</td>

                          <td>
                            <Trigger message='View Details'>
                              <Button
                                className='m-1'
                                size='sm'
                                variant='info'
                                onClick={() => {
                                  navigate(
                                    `/admin/user-details/${userId}`
                                  )
                                }}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>
                            </Trigger>
                          </td>
                        </tr>
                      )
                    }
                  )}

                {userData?.count === 0 && (
                  <tr>
                    <td colSpan={6} className='text-danger text-center'>
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {userData?.count !== 0 && (
              <PaginationComponent
                page={userData?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </>
          )
}

    </>
  )
}
