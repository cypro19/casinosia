import React from 'react'
import {
  Form,
  Table,
  Button,
  Spinner
} from '@themesberg/react-bootstrap'
import useCheckPermission from '../../utils/checkPermission'
import { fields } from './constants'

const RegistrationFormFields = ({ loading, data, handleChange, updateFields }) => {
  const { isHidden } = useCheckPermission()
  return (
    <>
      <Table bordered responsive hover className='mt-4'>
        <thead className='thead-dark'>
          <tr>
            <th>Field</th>
            <th>Required</th>
          </tr>
        </thead>

        <tbody>
          {data &&
                  fields.map((field, index) => (
                    <tr key={index}>
                      <td>{field.label}</td>
                      <td>
                        <Form.Check
                          name={field.value}
                          type='switch'
                          checked={data[field.value]}
                          value={data[field.value]}
                          onChange={(e) => handleChange(e, '')}
                          disabled={data?.disable?.includes(field.value)}
                        />
                      </td>
                    </tr>
                  ))}
        </tbody>
      </Table>

      <div className='mt-3 d-flex justify-content-between'>
        <Button
          variant='success'
          onClick={updateFields}
          hidden={isHidden({ module: { key: 'RegistrationField', value: 'U' } })}
        >
          Submit
          {loading && (
            <Spinner
              as='span'
              animation='border'
              role='status'
              aria-hidden='true'
              style={{ marginLeft: '10px' }}
            />
          )}
        </Button>
      </div>
    </>
  )
}

export default RegistrationFormFields
