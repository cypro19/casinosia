import { Row, Form as BForm, Button, Col, Modal } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import { selfExclusionSchema } from './schema'

const SelfExclusion = ({
  limit,
  show,
  setShow,
  updateLimit
}) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Self Exclusion</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{
            days: limit?.days === -1 ? '1' : limit?.days,
            permanent: limit?.days === -1 ? 'true' : 'false'
          }}
          validationSchema={selfExclusionSchema}
          onSubmit={(formValues) => {
            updateLimit({ formValues, reset: false, type: 'SELF_EXCLUSION' })
            setShow(false)
          }}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldValue,
            errors
          }) => (
            <Form className='m-3'>
              <div>
                <Row className='mt-2'>
                  <Col className='d-flex justify-content-between align-items-center'>
                    <Col>
                      <BForm.Label>Time Period</BForm.Label>
                    </Col>

                    <Col>
                      <BForm.Select
                        type='number'
                        name='permanent'
                        value={values.permanent}
                        onChange={(e) => {
                          if (e.target.value === 'true') {
                            setFieldValue('days', 1)
                          } else {
                            setFieldValue('days', limit?.days === -1 ? '' : limit?.days)
                          }
                          handleChange(e)
                        }}
                        onBlur={handleBlur}
                      >
                        <option key='permanent' value='true'>Permanent</option>
                        <option key='custom' value='false'>Custom Value</option>
                      </BForm.Select>
                    </Col>
                  </Col>
                </Row>

                {values?.permanent === 'false' &&
                  <Row className='mt-2'>
                    <Col className='d-flex justify-content-between align-items-center'>
                      <Col>
                        <BForm.Label>Months</BForm.Label>
                      </Col>

                      <Col>
                        <BForm.Control
                          type='number'
                          name='days'
                          placeholder='Enter Months'
                          value={values.days}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          component='div'
                          name='days'
                          className='text-danger'
                        />
                      </Col>
                    </Col>
                  </Row>}

              </div>

              <div className='mt-3 d-flex justify-content-between align-items-center'>
                <Button
                  variant='warning'
                  onClick={() => {
                    setShow(false)
                  }}
                  className='ml-2'
                >
                  Cancel
                </Button>

                <Button
                  variant='success'
                  onClick={() => {
                    handleSubmit()
                  }}
                >
                  Confirm
                </Button>

              </div>

            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default SelfExclusion
