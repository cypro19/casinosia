import React from 'react'
import {
  Button,
  Row,
  Col,
  Table,
  ButtonGroup,
  OverlayTrigger,
  Tooltip
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { AdminRoutes } from '../../../routes'
import PaginationComponent from '../../../components/Pagination'
import useCurrenciesListing from './hooks/useCurrenciesListing'
import useCheckPermissions from '../../../utils/checkPermission'

export default () => {
  const {
    navigate,
    limit,
    setLimit,
    page,
    setPage,
    allCurrencies,
    totalPages
  } = useCurrenciesListing()

  const { isHidden } = useCheckPermissions()
  const hide = isHidden({ module: { key: 'Currencies', value: 'U' } })

  return (
    <>
      <>
        <Row className='mb-2'>
          <Col>
            <h3>Currencies</h3>
          </Col>

          <Col>
            <div className='text-right'>
              {/* Button to create new Currency */}
              <Button
                variant='success'
                size='sm'
                onClick={() => navigate(AdminRoutes.CreateCurrencies)}
                hidden={isHidden({ module: { key: 'Currencies', value: 'C' } })}
              >
                Create
              </Button>
            </div>
          </Col>

        </Row>

        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
          <thead className='thead-dark'>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Code</th>
              <th>Exchange Rate</th>
              <th>Loyalty Points</th>
              <th>Type</th>
              <th>Primary</th>
              {!hide && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {Boolean(allCurrencies) &&
                      allCurrencies?.rows?.map(
                        ({
                          name,
                          currencyId,
                          code,
                          exchangeRate,
                          type,
                          isPrimary,
                          loyaltyPoint
                        }) => {
                          return (
                            <tr key={currencyId}>
                              <td>{currencyId}</td>
                              <td>{name}</td>
                              <td>{code} </td>
                              <td>{exchangeRate}</td>
                              <td>{loyaltyPoint}</td>
                              <td>{type ? 'Fiat' : 'Crypto'}</td>
                              <td>{isPrimary ? 'Yes' : 'No'}</td>
                              {!hide &&
                                <td>
                                  <ButtonGroup>
                                    <OverlayTrigger
                                      placement='bottom'
                                      delay={{ show: 250, hide: 200 }}
                                      overlay={<Tooltip>Edit</Tooltip>}
                                    >
                                      <Button
                                        className='m-1'
                                        size='sm'
                                        variant='warning'
                                        onClick={() =>
                                          navigate(
                                        `/admin/edit-currency/${currencyId}`
                                          )}
                                        hidden={hide}
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                      </Button>
                                    </OverlayTrigger>
                                  </ButtonGroup>
                                </td>}
                            </tr>
                          )
                        }
                      )}

            {allCurrencies?.count === 0 &&
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

        {allCurrencies?.count !== 0 &&
              (
                <PaginationComponent
                  page={allCurrencies?.count < page ? setPage(1) : page}
                  totalPages={totalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              )}
      </>
    </>
  )
}
