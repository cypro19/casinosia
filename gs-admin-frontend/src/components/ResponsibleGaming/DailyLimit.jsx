import { Row, Form as BForm, Button, Col, Modal, InputGroup } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import { limitsSchema, setDisableUserlimitsSchema } from './schema'

const DailyLimit = ({
  limit,
  show,
  setShow,
  updateLimit,
  currencyCode
}) => {
  const labelArray = limit?.label?.split(' ')
  const label = '' + (labelArray?.[0] === 'Weekly' ? 'Daily ' : 'Weekly ') + labelArray?.[1] + ' ' + labelArray?.[2]

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Set {limit?.label}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ limit: limit?.value || '' }}
          validationSchema={
            (limit?.label === 'Take A Break' || limit?.label === 'Session Limit')
              ? setDisableUserlimitsSchema
              : limitsSchema({ minimum: limit?.minimum, currLabel: limit?.label, label })
}
          onSubmit={(formValues) => {
            updateLimit({ formValues, label: limit?.label })
            setShow(false)
          }}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            handleBlur
          }) => (
            <Form className='m-3'>
              <div>
                <Row>
                  <Col className='d-flex justify-content-between align-items-center'>
                    <Col>
                      <BForm.Label>{(limit?.label === 'Take A Break' || limit?.label === 'Session Limit') ? 'Time Period' : limit?.label}</BForm.Label>
                    </Col>

                    <Col>
                      <InputGroup>
                        {(limit?.label !== 'Take A Break' && limit?.label !== 'Session Limit') && <InputGroup.Text>{currencyCode}</InputGroup.Text>}
                        <BForm.Control
                          type='number'
                          name='limit'
                          placeholder={`Enter ${limit?.label === 'Take A Break' ? 'Days' : limit?.label === 'Session Limit' ? 'Hours' : 'Limit'}`}
                          value={values.limit}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </InputGroup>
                      <ErrorMessage
                        component='div'
                        name='limit'
                        className='text-danger'
                      />

                    </Col>
                  </Col>
                </Row>

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
                  Set
                </Button>

              </div>

            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default DailyLimit
