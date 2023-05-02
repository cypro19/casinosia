import {
  Button,
  Row,
  Col,
  Table,
  ButtonGroup
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import React from 'react'
import PaginationComponent from '../../../components/Pagination'
import ConfirmationModal from '../../../components/ConfirmationModal'
import {
  faCheckSquare,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons'
import Trigger from '../../../components/OverlayTrigger'
import useAggregatorListing from './useAggregatorListing'
import CreateAggregator from './components/CreateAggregator'
import Preloader from '../../../components/Preloader'
import useCheckPermission from '../../../utils/checkPermission'

export default () => {
  const {
    aggregators,
    limit,
    setLimit,
    page,
    setPage,
    totalPages,
    handleStatusShow,
    handleYes,
    statusShow,
    setStatusShow,
    show,
    handleClose,
    handleShow,
    loading,
    status,
    createAggregator
  } = useAggregatorListing()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col sm={8}>
                <h3>Casino Aggregators</h3>
              </Col>

              <Col>
                <div className='text-right mb-2'>
                  <Button
                    variant='success'
                    className='f-right'
                    size='sm'
                    onClick={() => handleShow()}
                    hidden={isHidden({ module: { key: 'CasinoManagement', value: 'C' } })}
                  >
                    Create
                  </Button>
                </div>
              </Col>
            </Row>

            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
              <thead className='thead-dark'>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {aggregators &&
                        aggregators?.rows?.map(
                          (
                            {
                              name,
                              masterGameAggregatorId,
                              isActive
                            }
                          ) => {
                            return (
                              <tr key={masterGameAggregatorId}>
                                <td>{masterGameAggregatorId}</td>
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
                                  {!isHidden({ module: { key: 'CasinoManagement', value: 'T' } })
                                    ? (
                                      <ButtonGroup>
                                        {!isActive
                                          ? (
                                            <Trigger message='Set Status Active'>
                                              <Button
                                                className='m-1'
                                                size='sm'
                                                variant='success'
                                                onClick={() =>
                                                  handleStatusShow(
                                                    masterGameAggregatorId,
                                                    isActive
                                                  )}
                                                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
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
                                                  handleStatusShow(
                                                    masterGameAggregatorId,
                                                    isActive
                                                  )}
                                                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                              >
                                                <FontAwesomeIcon icon={faWindowClose} />
                                              </Button>
                                            </Trigger>
                                            )}
                                      </ButtonGroup>)
                                    : 'NA'}
                                </td>
                              </tr>
                            )
                          }
                        )}

                {
                        aggregators?.count === 0 &&
                          (
                            <tr>
                              <td
                                colSpan={5}
                                className='text-danger text-center'
                              >
                                No data found
                              </td>
                            </tr>
                          )
                      }
              </tbody>
            </Table>

            {aggregators?.count !== 0 &&
              (
                <PaginationComponent
                  page={aggregators?.count < page ? setPage(1) : page}
                  totalPages={totalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              )}

            <ConfirmationModal
              setShow={setStatusShow}
              show={statusShow}
              handleYes={handleYes}
              active={status}
            />
          </>)}
      <CreateAggregator
        handleClose={handleClose}
        show={show}
        createAggregator={createAggregator}
        loading={loading}
      />
    </>
  )
}
