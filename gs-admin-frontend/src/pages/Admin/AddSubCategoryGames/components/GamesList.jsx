import React from 'react'
import {
  Button,
  Col,
  Table,
  ButtonGroup,
  Form,
  Row
} from '@themesberg/react-bootstrap'
import PaginationComponent from '../../../../components/Pagination'
import Trigger from '../../../../components/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlusSquare
} from '@fortawesome/free-solid-svg-icons'
import ProviderFilter from '../../../../components/ProviderFilter'

const GamesList = ({
  page,
  limit,
  search,
  setLimit,
  setPage,
  setSearch,
  totalPages,
  masterGames,
  addGame,
  selectedProvider,
  setSelectedProvider,
  getProviderName
}) => {
  return (
    <div className='mt-4'>
      <Row>
        <Col xs='auto'>
          <div className='d-flex justify-content-start mb-3'>
            <ProviderFilter
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
            />
          </div>
        </Col>

        <Col xs='auto'>
          <div className='d-flex justify-content-start mb-3'>
            <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '5px' }}>
              Search
            </Form.Label>

            <Form.Control
              type='search'
              value={search}
              placeholder='Search Game Name'
              size='sm'
              style={{ maxWidth: '200px' }}
              onChange={(event) =>
                setSearch(
                  event.target.value.replace(/[~`!$%@^&*#=)()><?]+/g, '')
                )}
            />
          </div>
        </Col>
      </Row>

      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {[
              'Id',
              'Game Name',
              'Casino Provider',
              'Actions'
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {masterGames?.count > 0 &&
                    masterGames?.rows?.map(
                      ({
                        masterCasinoGameId,
                        name,
                        masterCasinoProviderId
                      }) => {
                        return (
                          <tr key={masterCasinoGameId}>

                            <td>{masterCasinoGameId}</td>

                            <td>
                              <Trigger message={name}>
                                <span
                                  style={{
                                    width: '300px',
                                    cursor: 'pointer'
                                  }}
                                  className='d-inline-block text-truncate'
                                >
                                  {name}
                                </span>
                              </Trigger>
                            </td>

                            <td>{getProviderName(masterCasinoProviderId)}</td>

                            <td>
                              <ButtonGroup>
                                <Trigger message='Add this Game'>
                                  <Button
                                    className='m-1'
                                    size='sm'
                                    variant='success'
                                    onClick={() => addGame({ masterCasinoGameId, name: name })}
                                  >
                                    <FontAwesomeIcon icon={faPlusSquare} />
                                  </Button>
                                </Trigger>
                              </ButtonGroup>
                            </td>
                          </tr>
                        )
                      }
                    )}

          {masterGames?.count === 0 &&
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
        </tbody>
      </Table>

      {masterGames?.count !== 0 &&
            (
              <PaginationComponent
                page={masterGames?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
    </div>
  )
}

export default GamesList
