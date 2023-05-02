import { faCheckSquare, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, ButtonGroup, Col, Form, Row, Table } from '@themesberg/react-bootstrap'
import React from 'react'
import ConfirmationModal from '../../../components/ConfirmationModal'
import Trigger from '../../../components/OverlayTrigger'
import PaginationComponent from '../../../components/Pagination'
import Preloader from '../../../components/Preloader'
import useCheckPermission from '../../../utils/checkPermission'
import useLanguages from './hooks/useLanguages'

const Languages = () => {
  const {
    loading,
    languages,
    limit,
    pageNo,
    totalPages,
    setPageNo,
    setLimit,
    showModal,
    handleClose,
    handleYes,
    setShow,
    show,
    active,
    handleShow,
    statusFilter,
    setStatusFilter
  } = useLanguages()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col>
                <h3>Languages</h3>
              </Col>

              <Col xs='auto' style={{marginRight: "10px"}}>
                <div column='sm' className='d-flex justify-content-start align-items-center w-100'>
                  <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                    Status
                  </Form.Label>

                  <Form.Select
                    onChange={(e) => { setStatusFilter(e.target.value) }}
                    value={statusFilter}
                    size='sm'
                    style={{ maxWidth: '230px' }}
                  >
                    <option value=''>All</option>
                    <option value='true'>Active</option>
                    <option value='false'>In-Active</option>
                  </Form.Select>
                </div>
              </Col>
            </Row>

            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
              <thead className='thead-dark'>
                <tr>
                  <th>Id</th>
                  <th>Language Code</th>
                  <th>Language Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {languages?.rows?.map((item, i) => (
                  <tr key={`language-listing ${i}`}>
                    <td>
                      {item?.languageId}
                    </td>
                    <td>
                      {item?.code}
                    </td>
                    <td>
                      {item?.languageName}
                    </td>
                    <td>
                    {item?.isActive
                    ? (
                      <span className='text-success'>Active</span>
                      )
                    : (
                      <span className='text-danger'>In Active</span>
                      )}
                  </td>
                  <td>
                              <ButtonGroup>
                                {!item?.isActive
                                  ? (
                                    <Trigger message='Set Status Active'>
                                      <Button
                                        className='m-1'
                                        size='sm'
                                        variant='success'
                                        hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                        onClick={() =>
                                          handleShow(item.languageId, false)}
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
                                        hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                        onClick={() =>
                                          handleShow(item.languageId, true)}
                                      >
                                        <FontAwesomeIcon icon={faWindowClose} />
                                      </Button>
                                    </Trigger>
                                    )}
                              </ButtonGroup>
                            </td>
                  </tr>
                ))}
              </tbody>

              {languages?.count === 0 &&
                <tr>
                  <td
                    colSpan={4}
                    className='text-danger text-center'
                  >
                    No data found
                  </td>

                </tr>}
            </Table>

            {showModal && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
        />
      )}

            {languages?.count !== 0 &&
              (
                <PaginationComponent
                  page={languages?.count < pageNo ? setPageNo(1) : pageNo}
                  totalPages={totalPages}
                  setPage={setPageNo}
                  limit={limit}
                  setLimit={setLimit}
                />
              )}

          </>
          )}
    </>

  )
}

export default Languages
