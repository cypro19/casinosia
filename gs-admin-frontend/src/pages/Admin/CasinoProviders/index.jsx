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
import CreateCasinoProviders from './components/CreateCasinoProvider'
import ConfirmationModal from '../../../components/ConfirmationModal'
import {
  faCheckSquare,
  faWindowClose,
  faEdit,
  faBan
} from '@fortawesome/free-solid-svg-icons'
import useProviderListing from './useProviderListing'
import Trigger from '../../../components/OverlayTrigger'
import Preloader from '../../../components/Preloader'
import useCheckPermission from '../../../utils/checkPermission'

export default () => {
  const {
    limit,
    setLimit,
    page,
    setPage,
    show,
    statusShow,
    setStatusShow,
    data,
    type,
    casinoProvidersData,
    totalPages,
    handleClose,
    handleShow,
    handleStatusShow,
    handleYes,
    loading,
    status,
    aggregators,
    createProvider,
    updateProvider,
    navigate
  } = useProviderListing()
  const { isHidden } = useCheckPermission()
  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col sm={7}>
                <h3>Casino Providers</h3>
              </Col>

              <Col sm={5}>
                <div className='text-right mb-2'>
                  <Button
                    variant='success'
                    className='f-right'
                    size='sm'
                    onClick={() => handleShow('Create', null)}
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
                  <th>Id</th>
                  <th>Name</th>
                  <th>Thumbnail</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {Boolean(casinoProvidersData) &&
                      casinoProvidersData?.rows?.map(
                        (
                          {
                            masterCasinoProviderId,
                            name,
                            isActive,
                            thumbnailUrl
                          },
                          index
                        ) => {
                          return (
                            <tr key={masterCasinoProviderId}>
                              <td>{masterCasinoProviderId}</td>
                              <td>
                                <Trigger message={name}>
                                  <span
                                    style={{
                                      width: '100px',
                                      cursor: 'pointer'
                                    }}
                                    className='d-inline-block text-truncate'
                                  >
                                    {name}
                                  </span>
                                </Trigger>
                              </td>

                              <td>
                                {thumbnailUrl
                                  ? (
                                    <span
                                      onClick={() => window.open(thumbnailUrl)}
                                      className='text-link'
                                      style={{ cursor: 'pointer' }}
                                    >
                                      View Here
                                    </span>
                                    )
                                  : (
                                    <span className='text-danger'>
                                      No Image Available
                                    </span>
                                    )}
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
                                {(!isHidden({ module: { key: 'CasinoManagement', value: 'U' } }) || !isHidden({ module: { key: 'CasinoManagement', value: 'T' } }))
                                  ? (
                                    <ButtonGroup>
                                      <Trigger message='Edit'>

                                        <Button
                                          className='m-1'
                                          size='sm'
                                          variant='warning'
                                          onClick={() =>
                                            handleShow(
                                              'Edit',
                                              casinoProvidersData.rows[index]
                                            )}
                                          hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                                        >
                                          <FontAwesomeIcon icon={faEdit} />
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
                                                handleStatusShow(
                                                  masterCasinoProviderId,
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
                                                  masterCasinoProviderId,
                                                  isActive
                                                )}
                                              hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                            >
                                              <FontAwesomeIcon icon={faWindowClose} />
                                            </Button>
                                          </Trigger>
                                          )}

                                      <Trigger message='View Blocked Countries'>
                                        <Button
                                          className='m-1'
                                          size='sm'
                                          variant='secondary'
                                          hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                                          onClick={() => navigate(`/admin/restrict-providers-countries/${masterCasinoProviderId}`)}
                                        >
                                          <FontAwesomeIcon icon={faBan} />
                                        </Button>
                                      </Trigger>
                                    </ButtonGroup>)
                                  : 'NA'}
                              </td>
                            </tr>
                          )
                        }
                      )}

                {
                      casinoProvidersData?.count === 0 &&
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

            {casinoProvidersData?.count !== 0 &&
            (
              <PaginationComponent
                page={casinoProvidersData?.count < page ? setPage(1) : page}
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
      <CreateCasinoProviders
        handleClose={handleClose}
        data={data}
        type={type}
        show={show}
        aggregators={aggregators}
        loading={loading}
        createProvider={createProvider}
        updateProvider={updateProvider}
      />
    </>
  )
}
