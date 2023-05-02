import React from 'react'
import {
  Table,
  Button,
  ButtonGroup
} from '@themesberg/react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlusSquare,
  faMinusSquare
} from '@fortawesome/free-solid-svg-icons'

import PaginationComponent from '../../../../../components/Pagination'
import Trigger from '../../../../../components/OverlayTrigger'

const CountriesList = ({
  page,
  limit,
  setLimit,
  setPage,
  totalPages,
  countries,
  disablePagination = false,
  hasActions = false,
  hasAddGamesAction = false,
  hasRemoveGamesAction = false,
  addCountries,
  removeCountries
}) => {
  return (
    <>
      <Table bordered striped responsive hover size='sm' className='text-center mt-1'>
        <thead className='thead-dark'>
          <tr>
            {[
              'Id',
              'Name',
              'Code'
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {countries?.count > 0 &&
                    countries?.rows?.map(
                      ({
                        countryId,
                        name,
                        code
                      }) => {
                        return (
                          <tr key={countryId}>

                            <td>{countryId}</td>

                            <td>
                              <Trigger message={name}>
                                <span
                                  style={{
                                    width: '200px',
                                    cursor: 'pointer'
                                  }}
                                  className='d-inline-block text-truncate'
                                >
                                  {name}
                                </span>
                              </Trigger>
                            </td>

                            <td>{code}</td>

                            {hasAddGamesAction && (
                              <td>
                                <ButtonGroup>
                                  <Trigger message='Add this Country'>
                                    <Button
                                      className='m-1'
                                      size='sm'
                                      variant='success'
                                      onClick={() => addCountries({
                                        countryId,
                                        name,
                                        code
                                      })}
                                    >
                                      <FontAwesomeIcon icon={faPlusSquare} />
                                    </Button>
                                  </Trigger>
                                </ButtonGroup>
                              </td>
                            )}

                            {hasRemoveGamesAction && (
                              <td>
                                <ButtonGroup>
                                  <Trigger message='Remove this Country'>
                                    <Button
                                      className='m-1'
                                      size='sm'
                                      variant='danger'
                                      onClick={() => removeCountries(countryId)}
                                    >
                                      <FontAwesomeIcon icon={faMinusSquare} />
                                    </Button>
                                  </Trigger>
                                </ButtonGroup>
                              </td>
                            )}
                          </tr>
                        )
                      }
                    )}

          {countries?.count === 0 &&
                      (
                        <tr>
                          <td
                            colSpan={hasActions ? 5 : 4}
                            className='text-danger text-center'
                          >
                            No data found
                          </td>
                        </tr>
                      )}
        </tbody>
      </Table>

      {!disablePagination && countries?.count !== 0 &&
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
  )
}

export default CountriesList
