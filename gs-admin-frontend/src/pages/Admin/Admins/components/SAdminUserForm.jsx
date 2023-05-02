import React, { useEffect } from 'react'
import {
  Button,
  Card,
  Form as BForm,
  Row,
  Col,
  Badge,
  Spinner,
  InputGroup
} from '@themesberg/react-bootstrap'
import { Form, Field, ErrorMessage } from 'formik'
import { AdminRoutes } from '../../../../routes'
import { toast } from '../../../../components/Toast'
import useAdminUserForm from '../hooks/useAdminUserForm'
import Trigger from '../../../../components/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import CreatableSelect from 'react-select/creatable'

const SAdminUserForm = ({
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  setFieldValue,
  isEdit = false
}) => {
  const {
    navigate,
    data,
    adminRole,
    adminDetails,
    permissionLabel,
    superAdminDetails,
    getAllAdmins,
    getAdminDetails,
    loading,
    type,
    setType,
    groupOptions,
    setGroupOptions,
    selectedGroup,
    setSelectedGroup
  } = useAdminUserForm({ group: values?.group })

  useEffect(() => {
    if (values.role === 'Support') {
      getAllAdmins({
        limit: '',
        pageNo: '',
        sort: 'desc',
        orderBy: 'superAdminUserId',
        search: '',
        superRoleId: 2,
        superAdminId: ''
      })
      values?.adminId && getAdminDetails({ adminId: values.adminId })
    }
  }, [values.role])

  return (
    <>
      <Form>
        <Row>
          <Col>
            <BForm.Label>Email</BForm.Label>

            <BForm.Control
              type='text'
              name='email'
              placeholder='Enter Email'
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isEdit}
            />

            <ErrorMessage
              component='div'
              name='email'
              className='text-danger'
            />
          </Col>

          <Col>
            <BForm.Label>Password</BForm.Label>

            <Trigger message='Must be atleast 8 characters long with 1 uppercase and 1 lowercase letters, 1 special character and 1 digit'>
              <InputGroup>
                <BForm.Control
                  type={type}
                  name='password'
                  placeholder='Enter Password'

                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <InputGroup.Text className='b-1'>
                  <FontAwesomeIcon
                    icon={type === 'password' ? faEyeSlash : faEye}
                    onClick={() => {
                      type === 'password' ? setType('text') : setType('password')
                    }}
                  />
                </InputGroup.Text>
              </InputGroup>
            </Trigger>

            <ErrorMessage
              component='div'
              name='password'
              className='text-danger'
            />
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col>
            <BForm.Label>First Name</BForm.Label>

            <BForm.Control
              type='text'
              name='firstName'
              placeholder='Enter First Name'
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <ErrorMessage
              component='div'
              name='firstName'
              className='text-danger'
            />
          </Col>

          <Col>
            <BForm.Label>Last Name</BForm.Label>

            <BForm.Control
              type='text'
              name='lastName'
              placeholder='Enter Last Name'
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <ErrorMessage
              component='div'
              name='lastName'
              className='text-danger'
            />
          </Col>
        </Row>

        <Row>
          <Col md={6} sm={12} className='mt-3'>
            <BForm.Label>User Name</BForm.Label>

            <BForm.Control
              type='text'
              name='superAdminUsername'
              placeholder='Enter User Name'
              value={values.superAdminUsername}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <ErrorMessage
              component='div'
              name='superAdminUsername'
              className='text-danger'
            />
          </Col>

          <Col md={6} sm={12} className='mt-3'>
            <BForm.Label>Group</BForm.Label>

            <CreatableSelect
              isClearable
              name='group'
              onCreateOption={(option) => {
                groupOptions?.length > 0
                  ? setGroupOptions([
                    ...groupOptions,
                    { label: option, value: option }
                  ])
                  : setGroupOptions([
                    { label: option, value: option }
                  ])
                setSelectedGroup({ label: option, value: option })
                setFieldValue('group', option)
              }}
              options={groupOptions}
              value={selectedGroup}
              classNamePrefix='select'
              onChange={(option, e) => {
                if (option === null) {
                  setSelectedGroup()
                  setFieldValue('group', '')
                } else {
                  setSelectedGroup({ label: option?.label, value: option?.value })
                  setFieldValue('group', option?.value)
                }
              }}
            />

            <ErrorMessage
              component='div'
              name='group'
              className='text-danger'
            />
          </Col>

        </Row>

        <Row>

          <Col md={6} sm={12} className='mt-3'>
            <BForm.Label>Role</BForm.Label>

            <BForm.Select
              name='role'
              value={values.role || ''}
              disabled={isEdit}
              onChange={(e) => {
                handleChange(e)
                if (e.target.value !== 'Support') {
                  superAdminDetails()
                } else {
                  setFieldValue('permission', {})
                  setFieldValue('adminId', '')
                }
              }}
              onBlur={handleBlur}
            >
              <option value='' disabled key=''>
                Select Role
              </option>
              {adminRole?.map((roles, index) => {
                return (
                  roles.name !== 'Admin' &&
                    <option key={index} value={roles && roles.name}>
                      {roles && roles.name}
                    </option>
                )
              })}
            </BForm.Select>

            <ErrorMessage component='div' name='role' className='text-danger' />
          </Col>

          {values.role === 'Support' && (
            <Col md={6} sm={12} className='mt-3'>
              <BForm.Label>Manager</BForm.Label>

              <BForm.Select
                name='adminId'

                value={values.adminId || ''}
                disabled={isEdit}
                onChange={(e) => {
                  handleChange(e)
                  getAdminDetails({ adminId: e.target.value })
                }}
                onBlur={handleBlur}
              >
                <option value='' disabled>
                  Select Manager
                </option>
                {data &&
                  data?.rows?.map((admin, index) => {
                    return (
                      <option
                        key={index}
                        value={admin && admin.superAdminUserId}
                      >
                        {admin && `${admin?.firstName} ${admin?.lastName}`}
                      </option>
                    )
                  })}
              </BForm.Select>

              <ErrorMessage
                component='div'
                name='adminId'
                className='text-danger'
              />
            </Col>
          )}
        </Row>

        {(['Manager'].includes(values?.role) ||
          values.adminId) && (
            <Card className='mt-3'>
              <Card.Header>Permissions</Card.Header>
              {!loading && adminDetails?.userPermission && (
                <Card.Body>
                  {Object.keys(
                    adminDetails.userPermission?.permission
                  ).map((key, index) => {
                    return (
                      ((values.role === 'Support' && key === 'Admins')
                        ? null
                        : (
                          <Row key={index}>
                            <Col>
                              <BForm.Label>{key}</BForm.Label>
                            </Col>

                            <Col className='d-flex '>
                              {adminDetails?.userPermission?.permission[
                                key
                              ].map((value, index) => {
                                return (
                                  <label key={index}>
                                    {adminDetails?.userPermission?.permission[
                                      key
                                    ].includes('R')
                                      ? (
                                        <Field
                                          className='d-none'
                                          type='checkbox'
                                          name={`permission[${key}]`}
                                          value={value}
                                          onChange={(e) => {
                                            if (
                                              e.target.value === 'R' ||
                                      values?.permission?.[key]?.includes('R')
                                            ) {
                                              if (
                                                e.target.value === 'R' &&
                                        !e.target.checked
                                              ) {
                                                delete values.permission[key]
                                                setFieldValue(
                                                  'permission',
                                                  values.permission
                                                )
                                              } else {
                                                handleChange(e)
                                              }
                                            } else {
                                              toast(
                                                'Please Select Read Permission Before Selecting Other For This Module',
                                                'error'
                                              )
                                            }
                                          }}
                                        />
                                        )
                                      : (
                                        <Field
                                          className='d-none'
                                          type='checkbox'
                                          name={`permission[${key}]`}
                                          value={value}
                                          onChange={handleChange}
                                        />
                                        )}

                                    <h3>
                                      <Badge
                                        className='p-2 mx-2 '
                                        type='button'
                                        bg={
                                    values?.permission?.[key]?.includes(value)
                                      ? 'success'
                                      : 'primary'
                                  }
                                      >
                                        {permissionLabel(value)}
                                      </Badge>
                                    </h3>
                                  </label>
                                )
                              })}
                            </Col>
                          </Row>)
                      ))
                  })}

                </Card.Body>
              )}
            </Card>
        )}

        <div className='mt-4 d-flex justify-content-between align-items-center'>
          <Button
            variant='warning'
            onClick={() => navigate(AdminRoutes.Admins)}
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
            {loading && (
              <Spinner
                as='span'
                animation='border'

                role='status'
                aria-hidden='true'
              />
            )}
          </Button>

        </div>
      </Form>
    </>
  )
}

export default SAdminUserForm
