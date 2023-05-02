import { Col, Row, Button, Accordion, Table } from '@themesberg/react-bootstrap'
import React from 'react'
import useKYCLabels from './useKYCLabels'
import Preloader from '../../../components/Preloader'
import CreateEdit from './CreateEdit'
import useCheckPermission from '../../../utils/checkPermission'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

export default () => {
  const {
    loading,
    handleAdd,
    newLabels,
    updateLabels,
    handleEdit,
    data,
    show,
    handleClose,
    type,
    language,
    setLangauge,
    languages,
    createLabels
  } = useKYCLabels()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col>
                <h3>KYC Labels</h3>
              </Col>

              <Col className='text-right'>
                <Button
                  variant='success'
                  size='sm'
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    handleAdd()
                  }}
                  hidden={isHidden({ module: { key: 'KycLabel', value: 'C' } })}
                >Create
                </Button>
              </Col>
            </Row>

            {newLabels?.length > 0 &&
              <Accordion defaultActiveKey={0}>
                {newLabels?.map((key, index) => {
                  return (
                    <Accordion.Item
                      eventKey={index}
                      key={`label-${index}`}
                    >
                      <Accordion.Header>
                        Label {newLabels[index]?.documentLabelId}&nbsp;
                        ({newLabels[index]?.isRequired
                        ? <span className='text-success'>Required</span>
                        : <span className='text-danger'>Not Required</span>})
                        <Button
                          variant='warning'
                          style={{ marginLeft: '10px' }}
                          size='sm'
                          onClick={() => {
                            handleEdit(newLabels[index])
                          }}
                          hidden={isHidden({ module: { key: 'KycLabel', value: 'U' } })}
                        ><FontAwesomeIcon icon={faEdit} />
                        </Button>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Table
                          bordered
                          striped
                          responsive
                          hover
                          size='sm'
                          className='text-center mt-4'
                        >
                          <thead className='thead-dark'>
                            <tr>
                              {['Language Code', 'Label Name'].map((c) => (
                                <th key={c}>{c}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(newLabels[index]?.name).map((language, indx) => {
                              return (
                                <tr key={indx}>
                                  <td>{language}</td>
                                  <td>{newLabels[index]?.name?.[language]}</td>
                                </tr>
                              )
                            }
                            )}
                          </tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  )
                }
                )}
              </Accordion>}
          </>)}
      <CreateEdit
        handleClose={handleClose}
        show={show}
        updateLabels={type === 'Edit' ? updateLabels : createLabels}
        loading={loading}
        data={type === 'Edit' ? data : null}
        type={type}
        language={language}
        setLangauge={setLangauge}
        languages={languages}
      />
    </>
  )
}
