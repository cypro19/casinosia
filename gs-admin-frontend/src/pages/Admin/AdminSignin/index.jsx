import React, { useState } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faEye, faEyeSlash, faUnlockAlt } from '@fortawesome/free-solid-svg-icons'
import {
  Spinner,
  Col,
  Row,
  Form as BForm,
  Container,
  InputGroup
} from '@themesberg/react-bootstrap'

import BgImage from '../../../assets/img/illustrations/newsignin.svg'
import { superAdminLoginSchema } from './schema'
import useSAdminSignin from './useSAdminSignin'

export default () => {
  const { loading, handleSignIn } = useSAdminSignin()
  const [showPassword, setShowPassword ] = useState(false)

  return (
    <main>
      <section className='d-flex align-items-center my-5 mt-lg-6 mb-lg-5'>
        <Container>
          <Row
            className='justify-content-center form-bg-image'
            style={{ backgroundImage: `url(${BgImage})` }}
          >
            <Col
              xs={12}
              className='d-flex align-items-center justify-content-center'
            >
              <div className='bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500'>
                <div className='text-center text-md-center mb-4 mt-md-0'>
                  <h3 className='mb-0'>Admin Sign In</h3>
                </div>

                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={superAdminLoginSchema}
                  onSubmit={({ email, password }) =>
                    handleSignIn({ email, password })}
                >
                  {({
                    touched,
                    errors,
                    values,
                    handleChange,
                    handleSubmit,
                    handleBlur
                  }) => (
                    <div>
                      <Form>
                        <div className='form-group'>
                          <label
                            htmlFor='email'
                            className={
                              touched.email && errors.email ? 'text-danger' : ''
                            }
                          >
                            Email
                          </label>

                          <InputGroup
                            className={
                              touched.email && errors.email
                                ? 'border border-danger'
                                : ''
                            }
                          >
                            <InputGroup.Text>
                              <FontAwesomeIcon icon={faEnvelope} />
                            </InputGroup.Text>

                            <BForm.Control
                              name='email'
                              autoFocus
                              required
                              type='email'
                              placeholder='example@company.com'
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </InputGroup>

                          <ErrorMessage
                            component='div'
                            name='email'
                            className='text-danger'
                          />
                        </div>

                        <div className='form-group'>
                          <label
                            htmlFor='password'
                            className={`mt-3 ${
                              touched.password && errors.password
                                ? 'text-danger'
                                : ''
                            }`}
                          >
                            Password
                          </label>

                          <InputGroup
                            className={
                              touched.password && errors.password
                                ? 'border border-danger'
                                : ''
                            }
                          >
                            <InputGroup.Text>
                              <FontAwesomeIcon icon={faUnlockAlt} />
                            </InputGroup.Text>

                            <BForm.Control
                              name='password'
                              required
                              type={`${showPassword ? 'text' : 'password'}`}
                              placeholder='qwerty'
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <InputGroup.Text style={{cursor: "pointer"}} className='b-1'>
                              <FontAwesomeIcon
                                icon={showPassword === true ? faEyeSlash : faEye}
                                onClick={() => {
                                  setShowPassword((showPass) => !showPass)
                                }}
                              />
                            </InputGroup.Text>
                          </InputGroup>

                          <ErrorMessage
                            component='div'
                            name='password'
                            className='text-danger'
                          />
                        </div>

                        <button
                          type='submit'
                          className='btn btn-primary btn-block mt-4'
                          onClick={handleSubmit}
                          style={{background: "#1c2144"}}
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
                          Sign In
                        </button>
                      </Form>
                    </div>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  )
}
