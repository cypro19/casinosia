import React from 'react'
import { Row, Col } from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import { createSAdminUserSchema } from '../schemas'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createSAdminUserStart } from '../../../../store/redux-slices/adminUser'
import SAdminUserForm from './SAdminUserForm'
import { toast } from '../../../../components/Toast'

const CreateSAdminUser = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Create Staff</h3>
        </Col>
      </Row>

      <Formik
        initialValues={{
          email: '',
          password: '',
          superAdminUsername: '',
          firstName: '',
          lastName: '',
          role: null,
          permission: {},
          group: ''
        }}
        validationSchema={createSAdminUserSchema}
        onSubmit={(formValues) => {
          ([undefined, null].includes(formValues.permission) || Object.keys(formValues.permission).length < 1)
            ? toast('Please Select At Least One Permission', 'error')
            : dispatch(
              createSAdminUserStart({
                data: {
                  ...formValues,
                  password: Buffer.from(formValues.password).toString('base64')
                },
                navigate
              })
            )
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue
        }) => (
          <SAdminUserForm
            values={values}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleBlur={handleBlur}
            setFieldValue={setFieldValue}
          />
        )}
      </Formik>
    </div>
  )
}

export default CreateSAdminUser
