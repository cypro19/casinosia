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

const GamesList = ({
  page,
  limit,
  setLimit,
  setPage,
  totalPages,
  games,
  addGame,
  removeGame,
  disablePagination = false,
  hasActions = false,
  hasAddGamesAction = false,
  hasRemoveGamesAction = false
}) => {
  return (
    <>
      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {[
              'Id',
              'Name',
              'Status',
              'Operator Status'
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {games?.count > 0 &&
                    games?.rows?.map(
                      ({
                        masterCasinoGameId,
                        name,
                        isActive,
                        operatorStatus
                      }) => {
                        return (
                          <tr key={masterCasinoGameId}>

                            <td>{masterCasinoGameId}</td>

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
                              {operatorStatus
                                ? (
                                  <span className='text-success'>Active</span>
                                  )
                                : (
                                  <span className='text-danger'>In Active</span>
                                  )}
                            </td>

                            {hasAddGamesAction && (
                              <td>
                                <ButtonGroup>
                                  <Trigger message='Add this Game'>
                                    <Button
                                      className='m-1'
                                      size='sm'
                                      variant='success'
                                      onClick={() => addGame({
                                        masterCasinoGameId,
                                        name,
                                        isActive,
                                        operatorStatus
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
                                  <Trigger message='Remove this Game'>
                                    <Button
                                      className='m-1'
                                      size='sm'
                                      variant='danger'
                                      onClick={() => removeGame(masterCasinoGameId)}
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

          {games?.count === 0 &&
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

      {!disablePagination && games?.count !== 0 &&
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
  )
}

export default GamesList
