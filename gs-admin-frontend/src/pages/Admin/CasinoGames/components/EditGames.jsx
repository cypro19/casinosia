import { Button, Row, Form as BForm, Col, Modal } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import useEditCasinoGames from '../hooks/useEditCasinoGames'
import { editGamesSchema } from '../schema'

const EditGames = ({
  handleClose,
  show,
  gameData,
  type,
  subCategories,
  limit,
  pageNo,
  masterCasinoGameId,
  statusFilter,
  providerId
}) => {
  const {
    editGames
  } = useEditCasinoGames()
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={
              {
                name: gameData?.name || '',
                description: gameData?.description || '',
                thumbnail: null,
                isActive: gameData?.isActive || false,
                masterGameSubCategoryId: gameData?.masterGameSubCategoryId
              }
            }
        validationSchema={editGamesSchema}
        onSubmit={(formValues) => {
          editGames({
            data: {
              ...formValues,
              masterGameCategoryId: gameData?.masterCasinoGameId,
              masterGameSubCategoryId: parseInt(formValues.masterGameSubCategoryId)
            },
            limit,
            pageNo,
            masterCasinoGameId,
            isActive: statusFilter,
            providerId
          })
          handleClose()
        }}
      >
        {({ values, handleChange, handleSubmit, handleBlur, setFieldValue, handleReset }) => (
          <Form>
            <Modal
              show={show}
              onHide={handleClose}
              backdrop='static'
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>{type} Game</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className='mt-3'>
                  <Col>
                    <BForm.Label>
                      Name<span className='text-danger'> *</span>
                    </BForm.Label>

                    <BForm.Control
                      type='text'
                      name='name'
                      placeholder='Enter Name'
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <ErrorMessage
                      component='div'
                      name='name'
                      className='text-danger'
                    />
                  </Col>
                </Row>

                <Row className='mt-3'>
                  <Col>
                    <BForm.Label>
                      Description<span className='text-danger'> *</span>
                    </BForm.Label>

                    <BForm.Control
                      as='textarea'
                      name='description'
                      placeholder='Enter Description'
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <ErrorMessage
                      component='div'
                      name='description'
                      className='text-danger'
                    />
                  </Col>
                </Row>

                <Row className='mt-3'>
                  <Col>
                    <BForm.Label>
                      Game Sub Category<span className='text-danger'> *</span>
                    </BForm.Label>
                    <BForm.Select
                      name='masterGameSubCategoryId'
                      value={values.masterGameSubCategoryId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {subCategories &&
                      subCategories?.rows?.map(({ name, masterGameSubCategoryId }) => {
                        return (
                          <option key={masterGameSubCategoryId} value={masterGameSubCategoryId}>
                            {name?.EN}
                          </option>
                        )
                      })}
                    </BForm.Select>
                    <ErrorMessage
                      component='div'
                      name='masterGameSubCategoryId'
                      className='text-danger'
                    />
                  </Col>
                </Row>

                <Row className='mt-3'>
                  <Col className='d-flex'>
                    <BForm.Label>
                      Status<span className='text-danger'> *</span>
                    </BForm.Label>

                    <BForm.Check
                      className='mx-auto'
                      type='checkbox'
                      name='isActive'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.isActive}
                      defaultChecked={gameData?.isActive}
                    />

                    <ErrorMessage
                      component='div'
                      name='isActive'
                      className='text-danger'
                    />
                  </Col>
                </Row>

                <Row className='mt-3'>
                  <Col className='d-grid'>
                    <BForm.Label>
                      Thumbnail<span className='text-danger'> *</span>
                    </BForm.Label>
                    <BForm.Text>
                      <input
                        id='file'
                        name='thumbnail'
                        type='file'
                        onChange={(event) => {
                          setFieldValue(
                            'thumbnail',
                            event.currentTarget.files[0]
                          )
                        }}
                      />
                      {values?.thumbnail && (
                        <img
                          alt='not found'
                          width='60px'
                          src={URL.createObjectURL(values.thumbnail)}
                        />
                      )}
                      {!values?.thumbnail && gameData?.thumbnailUrl && (
                        <img
                          alt='not found'
                          width='60px'
                          src={gameData.thumbnailUrl}
                        />
                      )}
                    </BForm.Text>

                    <ErrorMessage
                      component='div'
                      name='thumbnail'
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
                      handleClose()
                      handleReset()
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
    </>
  )
}

export default EditGames
