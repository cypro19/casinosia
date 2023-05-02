import { Button, Col, Modal, Row, Form as BForm } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { bannerType } from './constants.js'
import { uploadBannerSchema } from './schema.js'

const EditUploadBanner = ({
  type,
  data,
  show,
  setShow,
  createUpdate,
  dispatch,
  SABanners
}) => {

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{type} Banner</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              thumbnail: null,
              bannerType: bannerType?.find((item) => item?.value === data?.bannerType)?.value || ''
            }}
            validationSchema={uploadBannerSchema(type)}
            onSubmit={(formValues) => {
              createUpdate(formValues)
              setShow(false)
            }}
          >
            {({
              values,
              errors,
              handleSubmit,
              handleBlur,
              setFieldValue,
              handleChange
            }) => (
              <Form>
                <Row className='mt-3'>
                  <Col className='d-flex'>
                    <Col>
                      <BForm.Label>Type
                        <span className='text-danger'> *</span>
                      </BForm.Label>
                    </Col>

                    <Col xs={9}>
                      <BForm.Select
                        type='select'
                        name='bannerType'
                        value={values?.bannerType}
                        size='sm'
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option key='' value=''>Select</option>

                        {bannerType?.map(({ label, value }, i) => {
                          return (
                            <option key={i} value={value}>{label}</option>
                          )
                        })}
                      </BForm.Select>

                      <ErrorMessage
                        component='div'
                        name='bannerType'
                        className='text-danger'
                      />
                    </Col>
                  </Col>
                </Row>

                <Row className='mt-3'>
                  <Col className='d-flex align-items-center'>
                    <Col>
                      <BForm.Label>Banner
                        <span className='text-danger'> *</span>
                      </BForm.Label>
                    </Col>

                    <Col xs={9}>
                      <BForm.Control
                        type='file'
                        name='thumbnail'
                        onChange={(event) => setFieldValue('thumbnail', event.target.files[0])}
                        onBlur={handleBlur}
                      />

                      <ErrorMessage
                        component='div'
                        name='thumbnail'
                        className='text-danger'
                      />
                    </Col>
                  </Col>
                </Row>

                {!errors?.thumbnail &&
                (type === 'Create'
                  ? values?.thumbnail &&
                    <Row className='text-center'>
                      <Col>
                        <img
                          alt='not found'
                          className='mt-2'
                          style={{ maxWidth: '300px', maxHeight: '300px' }}
                          src={
                        values?.thumbnail &&
                          URL.createObjectURL(values?.thumbnail)
                      }
                        />
                      </Col>
                    </Row>
                  : (
                    <Row className='text-center'>
                      <Col>
                        <img
                          alt='not found'
                          className='mt-2'
                          style={{ maxWidth: '300px', maxHeight: '300px' }}
                          src={
                            values?.thumbnail
                              ? URL.createObjectURL(values?.thumbnail)
                              : data?.thumbnail
                          }
                        />
                      </Col>
                    </Row>))}

                <div className='mt-4 d-flex justify-content-between align-items-center'>
                  <Button
                    variant='warning'
                    onClick={() => setShow(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='success'
                    onClick={() => {
                      handleSubmit()
                    }}
                    className='ml-2'
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default EditUploadBanner
