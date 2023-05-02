import React, { useEffect } from 'react'
import { createSubCategorySchema } from '../schema'
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
import { SketchPicker } from 'react-color'

import CustomIconPicker from '../../../../components/CustomIconPicker'
import useCreateSubCategory from '../hooks/useCreateSubCategory'
import useOutsideClick from '../../../../utils/useOutsideClick'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const CreateSubCategory = ({
  selectedSubCategory,
  handleClose,
  limit,
  pageNo,
  search,
  categoryFilter,
  showModal,
  type,
  statusFilter
}) => {
  const {
    masterGameCategoryId: editMasterGameCategoryId,
    masterGameSubCategoryId,
    name: editName,
    isActive: editIsActive,
    iconColor: editIconColor,
    iconName: editIconName
  } = !!selectedSubCategory && selectedSubCategory

  const {
    myIconName,
    myIconColor,
    setMyIconName,
    setMyIconColor,
    loading,
    updateCasinoMenu,
    createCasinoMenu,
    casinoCategories,
    languages,
    language,
    setLanguage,
    createName,
    setCreateName
  } = useCreateSubCategory(editIconName, editIconColor)

  const { ref, isVisible, setIsVisible } = useOutsideClick(false)

  useEffect(() => {
    if (type === 'Edit' && editName) {
      setCreateName(editName)
    } else {
      setCreateName({ EN: '' })
    }
  }, [type, editName])

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
          iconName: editIconName || myIconName,
          iconColor: editIconColor || myIconColor,
          isActive: editIconName ? editIsActive : false,
          subCategoryName: createName || '',
          masterGameCategoryId: editMasterGameCategoryId || ''
        }}
        validationSchema={createSubCategorySchema(createName)}
        onSubmit={({ isActive, subCategoryName, masterGameCategoryId }) => {
          editName
            ? updateCasinoMenu({
              data: {
                iconName: myIconName,
                iconColor: myIconColor,
                isActive,
                masterGameCategoryId: parseInt(masterGameCategoryId),
                name: subCategoryName,
                casinoSubCategoryId: masterGameSubCategoryId
              },
              limit,
              pageNo,
              search,
              categoryFilter,
              isActive: statusFilter
            })
            : createCasinoMenu({
              data: {
                iconName: myIconName,
                iconColor: myIconColor,
                isActive,
                name: subCategoryName,
                masterGameCategoryId
              },
              limit,
              pageNo,
              search,
              categoryFilter,
              isActive: statusFilter
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
                        const label = Object.assign({ }, values?.subCategoryName)
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
                    Sub Category Name <span className='text-danger'>*</span>
                  </BForm.Label>

                  {Object.keys(values?.subCategoryName).map((language) => {
                    return (
                      <div className='d-flex align-items-center mt-1' key={language}>
                        <Col>
                          <Col className='d-flex m-1'>
                            <InputGroup>
                              <InputGroup.Text>{language}</InputGroup.Text>
                              <BForm.Control
                                type='text'
                                name={`subCategoryName[${language}]`}
                                placeholder='Enter Menu Name'
                                value={values.subCategoryName[language]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </InputGroup>

                            <Button
                              variant='danger'
                              disabled={language === 'EN' || editName?.[language] !== undefined}
                              className='m-1'
                              onClick={() => {
                                const label = Object.assign({ }, values?.subCategoryName)
                                delete label[language]
                                setCreateName(label)
                                setFieldValue('subCategoryName', label)
                                setLanguage('EN')
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </Col>

                          <ErrorMessage
                            component='div'
                            name={`subCategoryName[${language}]`}
                            className='text-danger'
                          />
                        </Col>
                      </div>
                    )
                  })}
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                    Category <span className='text-danger'>*</span>
                  </BForm.Label>

                  <BForm.Select
                    value={values.masterGameCategoryId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name='masterGameCategoryId'
                  >
                    <option value=''>Select Category</option>

                    {casinoCategories && casinoCategories?.rows?.map((c) => (
                      <option
                        key={c?.masterGameCategoryId}
                        value={c?.masterGameCategoryId}
                      >
                        {c?.name?.EN}
                      </option>
                    ))}
                  </BForm.Select>

                  <ErrorMessage
                    component='div'
                    name='masterGameCategoryId'
                    className='text-danger'
                  />
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

              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                    Icon <span className='text-danger'>*</span>
                  </BForm.Label>

                  <CustomIconPicker
                    name='iconName'
                    myIconColor={myIconColor}
                    setMyIconName={setMyIconName}
                    myIconName={myIconName}
                    setItemStyle={false}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <BForm.Label>
                    Color <span className='text-danger'>*</span>
                  </BForm.Label>

                  <Col>
                    <Button
                      variant='light'
                      onClick={() => setIsVisible(prev => !prev)}
                    >
                      Choose Color
                    </Button>
                  </Col>

                  {isVisible && (
                    <div ref={ref} style={{ width: 'max-content', marginTop: '15px' }}>
                      <SketchPicker
                        name='iconColor'
                        color={myIconColor}
                        onChangeComplete={(v) => setMyIconColor(v.hex)}
                        width='370px'
                      />
                    </div>
                  )}
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

export default CreateSubCategory
