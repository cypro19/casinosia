import {
  Col,
  Form,
  Row,
  Table
} from '@themesberg/react-bootstrap'
import React from 'react'
import PaginationComponent from '../../../../components/Pagination'
import { tableHeaders } from '../../Admins/constants'
import useSubAdmins from '../hooks/useSubAdmins'

const SubAdmins = ({ superAdminId }) => {
  const {
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    data,
    totalPages,
    getRole
  } = useSubAdmins(superAdminId)

  return (
    <>
      <Row className='text-left'>
        <Col>
          <div className='d-flex mb-2'>
            <Form.Label style={{ marginBottom: '0', marginRight: '15px' }}>
              Search
            </Form.Label>

            <Form.Control
              type='search'
              value={search}
              size='sm'
              style={{ maxWidth: '230px' }}
              placeholder='Search'
              onChange={(e) =>
                setSearch(e.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))}
            />
          </div>
        </Col>
      </Row>

      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {tableHeaders.map(
              (h, idx) =>
                h.label !== 'Action' && (
                  <th
                    key={idx}
                    style={{
                      cursor: 'pointer'
                    }}
                  >
                    {h.label}{' '}
                  </th>
                )
            )}
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
                  isActive
                }) => {
                  return (
                    <tr key={email}>
                      <td>{superAdminUserId}</td>
                      <td>{email}</td>
                      <td>
                        {firstName} {lastName}
                      </td>
                      <td>{getRole(superRoleId)}</td>

                      <td>
                        {isActive
                          ? (
                            <span className='text-success'>Active</span>
                            )
                          : (
                            <span className='text-danger'>In Active</span>
                            )}
                      </td>
                    </tr>
                  )
                }
              )}

          {data?.count === 0 && (
            <tr>
              <td colSpan={5} className='text-danger text-center'>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {data?.count !== 0 && (
        <PaginationComponent
          page={data?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  )
}

export default SubAdmins
