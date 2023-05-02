import React, { useEffect } from 'react'
import { casinoCategorySchema } from '../schemas'
import { Formik, Form, ErrorMessage } from 'formik'
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Modal,
  InputGroup
} from '@themesberg/react-bootstrap'

import useCreateCasinoCategory from '../hooks/useCreateCasinoCategory'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const CreateCasinoMenu = ({
  categoryName: editCategoryName,
  isActive: editIsActive,
  categoryId,
  handleClose,
  limit,
  pageNo,
  showModal,
  type
}) => {
  const {
    loading,
    updateCasinoCategory,
    createCasinoCategory,
    languages,
    language,
    setLanguage,
    createName,
    setCreateName
  } = useCreateCasinoCategory()

  useEffect(() => {
    if (type === 'Edit' && editCategoryName) {
      setCreateName(editCategoryName)
    } else {
      setCreateName({ EN: '' })
    }
  }, [type, editCategoryName])

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{type} Casino Category</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={{
          isActive: categoryId ? editIsActive : false,
          categoryName: createName
        }}
        validationSchema={casinoCategorySchema(createName)}
        onSubmit={({ isActive, categoryName }) => {
          categoryId
            ? updateCasinoCategory({
              data: {
                casinoCategoryId: categoryId,
                name: categoryName,
                isActive
              },
              limit,
              pageNo
            })
            : createCasinoCategory({
              data: {
                isActive,
                name: categoryName
              },
              limit,
              pageNo
            })

          handleClose()
        }}
      >
        {({ values, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
          <Form>
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
                        setLanguage(e.target.value)
                        const label = Object.assign({ }, values?.categoryName)
                        if (label[e.target.value] === undefined) {
                          label[e.target.value] = ''
                        }
                        setCreateName(label)
                      }}
                    >
                      <option value='EN'>EN</option>
                      {languages?.rows?.length && languages?.rows?.map((lang) => {
                        return lang.code !== 'EN' && (
                          <option key={lang.code} value={lang.code}>{lang.code}</option>
                        )
                      })}
                    </BForm.Select>
                  </Col>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                    Category Name <span className='text-danger'>*</span>
                  </BForm.Label>

                  {Object.keys(values?.categoryName).map((language) => {
                    return (
                      <div className='d-flex align-items-center mt-1' key={language}>
                        <Col>
                          <Col className='d-flex m-1'>
                            <InputGroup>
                              <InputGroup.Text>{language}</InputGroup.Text>
                              <BForm.Control
                                type='text'
                                name={`categoryName[${language}]`}
                                placeholder='Enter Menu Name'
                                value={values.categoryName[language]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </InputGroup>

                            <Button
                              variant='danger'
                              disabled={language === 'EN' || editCategoryName?.[language] !== undefined}
                              className='m-1'
                              onClick={() => {
                                const label = Object.assign({ }, values?.categoryName)
                                delete label[language]
                                setCreateName(label)
                                setFieldValue('categoryName', label)
                                setLanguage('EN')
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </Col>

                          <ErrorMessage
                            component='div'
                            name={`categoryName[${language}]`}
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
                    Is Active <span className='text-danger'>*</span>
                  </BForm.Label>

                  <BForm.Check
                    type='checkbox'
                    className='mx-auto'
                    name='isActive'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.isActive}
                    defaultChecked={editIsActive}
                  />
                </Col>
              </Row>
            </Modal.Body>

            <div className='mt-4'>
              <Modal.Footer className='d-flex justify-content-between align-items-center'>
                <Button variant='warning' onClick={() => handleClose()}>
                  Cancel
                </Button>

                <Button
                  variant='success'
                  onClick={handleSubmit}
                  className='ml-2'
                >
                  {loading && (
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                  )}
                  Submit
                </Button>
              </Modal.Footer>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default CreateCasinoMenu
