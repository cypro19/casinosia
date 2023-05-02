import React, { useEffect, useState } from 'react'
import {
  Button,
  Form as BForm,
  Row,
  Col,
  Modal,
  InputGroup
} from '@themesberg/react-bootstrap'
import { Formik, Form, ErrorMessage } from 'formik'
import Preloader from '../../../components/Preloader'
import { KYCSchema } from './schema'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const CreateEdit = ({
  handleClose,
  show,
  updateLabels,
  loading,
  data,
  type,
  language,
  setLangauge,
  languages
}) => {
  const [createName, setCreateName] = useState({ EN: '' })

  useEffect(() => {
    if (type === 'Edit' && data) {
      setCreateName(data?.name)
    } else {
      setCreateName({ EN: '' })
    }
  }, [type, data])

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Formik
              enableReinitialize
              initialValues={{
                documentLabelId: data ? data?.documentLabelId : '',
                name: createName,
                isRequired: data?.isRequired
              }}
              validationSchema={KYCSchema(createName)}
              onSubmit={(formValues) => {
                updateLabels({ data: formValues })
                handleClose()
              }}
            >
              {({ values, setFieldValue, handleChange, handleSubmit, handleBlur, handleReset }) => (
                <Form>
                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop='static'
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{type} Labels {`${type === 'Edit' ? '(Label: ' + (data?.documentLabelId || 0) + ')' : ''}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Row className='mt-3'>
                        <Col className='d-flex'>
                          <Col>
                            <BForm.Label>
                              Languages<span className='text-danger'> *</span>
                            </BForm.Label>
                          </Col>
                          <Col>
                            <BForm.Select
                              name='language'
                              value={language}
                              onChange={(e) => {
                                setLangauge(e.target.value)
                                const label = Object.assign({ }, values?.name)
                                if (label[e.target.value] === undefined) {
                                  label[e.target.value] = ''
                                }
                                setCreateName(label)
                              }}
                            >
                              <option value='EN'>English</option>
                              {languages?.count && languages?.rows?.map(({ languageName, code }) => {
                                return code !== 'EN' && (
                                  <option key={code} value={code}>{languageName}</option>
                                )
                              })}
                            </BForm.Select>
                          </Col>
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col>
                          <BForm.Label>
                            Label Name<span className='text-danger'> *</span>
                          </BForm.Label>

                          {Object.keys(values?.name).map((language) => {
                            return (
                              <div className='d-flex align-items-center mt-1' key={language}>
                                <Col>
                                  <Col className='d-flex m-1'>
                                    <InputGroup>
                                      <InputGroup.Text>{language}</InputGroup.Text>
                                      <BForm.Control
                                        type='text'
                                        name={`name[${language}]`}
                                        placeholder='Enter Label Name'
                                        value={values.name[language]}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                    </InputGroup>

                                    <Button
                                      variant='danger'
                                      disabled={language === 'EN' || data?.name?.[language] !== undefined}
                                      className='m-1'
                                      onClick={() => {
                                        const label = Object.assign({ }, values?.name)
                                        delete label[language]
                                        setCreateName(label)
                                        setFieldValue('name', label)
                                        setLangauge('EN')
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                  </Col>

                                  <ErrorMessage
                                    component='div'
                                    name={`name[${language}]`}
                                    className='text-danger'
                                  />
                                </Col>
                              </div>
                            )
                          })}
                        </Col>
                      </Row>

                      <Row className='mt-3'>
                        <Col className='d-flex'>
                          <BForm.Label>
                            Required<span className='text-danger'> *</span>
                          </BForm.Label>

                          <BForm.Check
                            className='mx-auto'
                            type='checkbox'
                            name='isRequired'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.isRequired}
                            defaultChecked={data?.isRequired}
                          />

                          <ErrorMessage
                            component='div'
                            name='isRequired'
                            className='text-danger'
                          />
                        </Col>
                      </Row>
                    </Modal.Body>

                    <div className='mt-4 '>
                      <Modal.Footer className='d-flex justify-content-between align-items-center'>
                        <Button
                          variant='warning'
                          onClick={() => {
                            handleReset()
                            handleClose()
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant='success'
                          onClick={handleSubmit}
                          className='ml-2'
                        >
                          Submit
                        </Button>
                      </Modal.Footer>
                    </div>
                  </Modal>
                </Form>
              )}
            </Formik>
          </>)}
    </>
  )
}

export default CreateEdit
