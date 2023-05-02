import React from 'react'
import { Card, Row, Col } from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import { updateSAdminUserSchema } from '../schemas'
import SAdminUserForm from './SAdminUserForm'
import useEditAdmin from '../hooks/useEditAdmin'
import { toast } from '../../../../components/Toast'

const EditSAdminUser = () => {
  const {
    adminData,
    editAdmin
  } = useEditAdmin()

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Edit Staff</h3>
        </Col>
      </Row>

      <Card body>
        {adminData && (
          <Formik
            initialValues={{
              email: adminData?.adminDetails.email,
              password: '',
              superAdminUsername: adminData?.adminDetails.superAdminUsername,
              firstName: adminData?.adminDetails.firstName,
              lastName: adminData?.adminDetails.lastName,
              role: adminData?.adminDetails.SuperadminRole?.name,
              adminId: adminData?.adminDetails.parentId,
              permission:
                adminData?.adminDetails.userPermission?.permission,
              group:
                adminData?.adminDetails.group
            }}
            validationSchema={updateSAdminUserSchema}
            onSubmit={(formValues) => {
              ([undefined, null].includes(formValues.permission) || Object.keys(formValues.permission).length < 1)
                ? toast('Please Select At Least One Permission', 'error')
                : editAdmin({
                  data: {
                    ...formValues,
                    superAdminId: adminData.adminDetails.superAdminUserId,
                    password: Buffer.from(formValues.password).toString(
                      'base64'
                    )
                  }
                })
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
                isEdit
              />
            )}
          </Formik>
        )}
      </Card>
    </div>
  )
}

export default EditSAdminUser
