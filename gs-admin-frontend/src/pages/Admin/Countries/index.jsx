import React from 'react'
import {
  Form,
  Row,
  Col,
  Table,
  ButtonGroup,
  Button
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStoreSlash, faBan } from '@fortawesome/free-solid-svg-icons'
import useCheckPermission from '../../../utils/checkPermission'
import PaginationComponent from '../../../components/Pagination'
import Preloader from '../../../components/Preloader'
import Trigger from '../../../components/OverlayTrigger'
import useCountriesListing from './useCountriesListing'

const Countries = () => {
  const {
    page,
    limit,
    setLimit,
    setName,
    name,
    setPage,
    totalPages,
    countries,
    loading,
    navigate
  } =
    useCountriesListing()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col>
                <h3>Countries</h3>
              </Col>

              <Col xs='auto'>
                <div className='d-flex justify-content-end align-items-center w-100'>
                  <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                    Search
                  </Form.Label>

                  <Form.Control
                    type='search'
                    placeholder='Search Country Name'
                    size='sm'
                    style={{ maxWidth: '230px' }}
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value.replace(/[^\w\s]/gi, ''))}
                  />
                </div>
              </Col>
            </Row>

            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
              <thead className='thead-dark'>
                <tr>
                  <th>Id</th>
                  <th>Country Code</th>
                  <th>Country Name</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {countries &&
                      countries?.rows.map(
                        ({ countryId, code, name: countryName }) => (
                          <tr key={countryId}>
                            <td>{countryId}</td>
                            <td>{code}</td>
                            <td>{countryName}</td>

                            <td>
                              {!isHidden({ module: { key: 'RestrictedCountry', value: 'U' } })
                                ? (
                                  <ButtonGroup>
                                    <Trigger message='View Blocked Games'>
                                      <Button
                                        className='m-1'
                                        size='sm'
                                        variant='warning'
                                        onClick={() => navigate(`/admin/restricted-games/${countryId}`)}
                                      >
                                        <FontAwesomeIcon icon={faBan} />
                                      </Button>
                                    </Trigger>

                                    <Trigger message='View Blocked Providers'>
                                      <Button
                                        className='m-1'
                                        size='sm'
                                        variant='success'
                                        onClick={() => navigate(`/admin/restricted-providers/${countryId}`)}
                                      >
                                        <FontAwesomeIcon icon={faStoreSlash} />
                                      </Button>
                                    </Trigger>
                                  </ButtonGroup>)
                                : '-'}
                            </td>
                          </tr>
                        )
                      )}
              </tbody>

              {countries?.count === 0 &&
                    (
                      <tr>
                        <td
                          colSpan={4}
                          className='text-danger text-center'
                        >
                          No data found
                        </td>
                      </tr>
                    )}
            </Table>

            {countries?.count !== 0 &&
              (
                <PaginationComponent
                  page={countries?.count < page ? setPage(1) : page}
                  totalPages={totalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              )}
          </>
          )}
    </>

  )
}

export default Countries
