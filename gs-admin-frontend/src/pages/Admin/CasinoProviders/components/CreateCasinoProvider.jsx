import React from 'react'
import {
  Button,
  Form as BForm,
  Row,
  Col,
  Modal,
  Spinner
} from '@themesberg/react-bootstrap'
import { Formik, Form, ErrorMessage } from 'formik'
import { editproviderSchema, providerSchema } from '../schema'
import Preloader from '../../../../components/Preloader'
import Trigger from '../../../../components/OverlayTrigger'

const CreateCasinoProviders = ({
  handleClose,
  data,
  show,
  type,
  aggregators,
  loading,
  createProvider,
  updateProvider
}) => {
  return (
    <>
      {loading
        ? <Preloader />
        : (
          <Formik
            initialValues={
          data?.masterCasinoProviderId
            ? {
                name: data.name,
                isActive: data.isActive,
                thumbnail: null,
                masterGameAggregatorId: data.masterGameAggregatorId
              }
            : {
                name: '',
                isActive: false,
                masterGameAggregatorId: '',
                thumbnail: ''
              }
        }
            validationSchema={
              data?.masterCasinoProviderId ? editproviderSchema : providerSchema
            }
            onSubmit={(formValues) => {
              data?.masterCasinoProviderId
                ? updateProvider(formValues, { masterCasinoProviderId: data?.masterCasinoProviderId })
                : createProvider(formValues)

              handleClose()
            }}
          >
            {({ values, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
              <Form>
                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop='static'
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>{type} Provider</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Row className='mt-3'>
                      <Col>
                        <BForm.Label>
                          Provider Name<span className='text-danger'> *</span>
                        </BForm.Label>

                        <BForm.Control
                          type='text'
                          name='name'
                          placeholder='Enter Provider Name'
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
                          Aggregator<span className='text-danger'> *</span>
                        </BForm.Label>

                        <BForm.Select
                          type='text'
                          name='masterGameAggregatorId'
                          value={values.masterGameAggregatorId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={data?.masterCasinoProviderId}
                        >
                          <option value='' disabled>---Select Aggregator---</option>
                          {aggregators &&
                        aggregators?.rows.map(({ masterGameAggregatorId, name }) => {
                          return (
                            <option value={masterGameAggregatorId} key={masterGameAggregatorId}>
                              {name}
                            </option>
                          )
                        })}
                        </BForm.Select>

                        <ErrorMessage
                          component='div'
                          name='masterGameAggregatorId'
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
                          defaultChecked={values.isActive}
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
                        <BForm.Label>Thumbnail</BForm.Label>

                        <BForm.Text>
                          <Trigger message='Only PNG, JPG, JPEG allowed with size < 1MB'>
                            <input
                              id='file'
                              title=' '
                              name='thumbnail'
                              type='file'
                              onChange={(event) => {
                                setFieldValue(
                                  'thumbnail',
                                  event.currentTarget.files[0]
                                )
                              }}
                            />
                          </Trigger>
                          {values?.thumbnail && (
                            <img
                              alt='not found'
                              width='60px'
                              src={URL.createObjectURL(values.thumbnail)}
                            />
                          )}
                          {!values?.thumbnail && data?.thumbnailUrl && (
                            <img
                              alt='not found'
                              width='60px'
                              src={data.thumbnailUrl}
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
                      <Button variant='warning' onClick={() => handleClose()}>
                        Cancel
                      </Button>
                      <Button
                        variant='success'
                        onClick={handleSubmit}
                        className='ml-2'
                      >
                        Submit
                        {loading && (
                          <Spinner
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                        )}
                      </Button>
                    </Modal.Footer>
                  </div>
                </Modal>
              </Form>
            )}
          </Formik>)}
    </>
  )
}

export default CreateCasinoProviders
