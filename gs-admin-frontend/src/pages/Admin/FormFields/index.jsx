import React from 'react'
import {
  Row,
  Col
} from '@themesberg/react-bootstrap'

import useFormFields from './useFormFields'
import Preloader from '../../../components/Preloader'
import RegistrationFormFields from '../../../components/RegistrationFormField'

const FormFields = () => {
  const { loading, data, handleChange, updateFields } = useFormFields()

  return (
    <>
      {loading
        ? (
          <Preloader />
          )
        : (
          <>
            <Row>
              <Col sm={8}>
                <h3>Registration Fields</h3>
              </Col>
            </Row>
            <RegistrationFormFields
              loading={loading}
              data={data}
              handleChange={handleChange}
              updateFields={updateFields}
            />
          </>)}
    </>
  )
}

export default FormFields
