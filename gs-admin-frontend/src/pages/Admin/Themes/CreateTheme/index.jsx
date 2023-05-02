import React from 'react'
import {
  Alert,
  Form,
  Col,
  Row,
  InputGroup,
  Button,
  Spinner
} from '@themesberg/react-bootstrap'
import useCreateTheme from '../hooks/useCreateTheme'

const CreateTheme = () => {
  const { navigate, error, setError, loading, sTheme, setStheme, createTheme } =
    useCreateTheme()

  return (
    <>
      <>
        <Row>
          <Col sm={8}>
            <h3>Themes</h3>
          </Col>
        </Row>
        <div className='mt-3'>
          <h5>Create Theme</h5>
        </div>

        <Form className='mt-3'>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <Form.Label style={{ marginBottom: '0', marginRight: '15px' }}>
              Name<span className='text-danger'>*</span>
            </Form.Label>

            <InputGroup>
              <Form.Control
                type='text'
                style={{ maxWidth: '500px' }}
                value={sTheme?.themeName}
                onChange={(e) => {
                  setStheme({ ...sTheme, themeName: e.target.value })
                  if (e.target.value !== '') {
                    setError(false)
                  } else {
                    setError(true)
                  }
                }}
              />
            </InputGroup>

          </div>
          {error && <span className='text-danger m-10'>Name is required</span>}
        </Form>

        <div className='mt-3'>
          <h5>Theme</h5>
        </div>

        <>
          <Form>
            <Form.Group>
              <Row className='g-2'>
                <Col xs={6}>
                  <Form.Label>Theme Mode</Form.Label>
                </Col>

                <Col xs={6}>
                  <Form.Group className='mb-3' controlId='formBasicCheckbox'>
                    <>
                      <Form.Check
                        inline
                        label='Light'
                        name='themeMode'
                        type='radio'
                        id='inline-radio-1'
                        defaultChecked={sTheme?.themeMode === 'Light'}
                        onClick={() =>
                          setStheme({ ...sTheme, themeMode: 'Light' })}
                      />
                      <Form.Check
                        inline
                        label='Dark'
                        name='themeMode'
                        type='radio'
                        id='inline-radio-2'
                        defaultChecked={sTheme?.themeMode === 'Dark'}
                        onClick={() =>
                          setStheme({ ...sTheme, themeMode: 'Dark' })}
                      />
                    </>
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className='input-color'>
              <Row>
                <Col md={6} xs={6}>
                  <Form.Label>Primary Color</Form.Label>
                </Col>

                <Col md={6} xs={6}>
                  <Form.Control
                    type='color'
                    defaultValue={sTheme?.primaryColor}
                    onChange={(e) =>
                      setStheme({ ...sTheme, primaryColor: e.target.value })}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className='input-color'>
              <Row>
                <Col md={6} xs={6}>
                  <Form.Label>Secondry Color</Form.Label>
                </Col>

                <Col md={6} xs={6}>
                  <Form.Control
                    type='color'
                    defaultValue={sTheme?.secondaryColor}
                    onChange={(e) =>
                      setStheme({ ...sTheme, secondaryColor: e.target.value })}
                  />
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </>
      </>

      <div className='d-flex justify-content-between mt-3'>
        <Button
          variant='outline-warning'
          className='mt-4'
          onClick={() => navigate('/admin/theme')}
        >
          Cancel
        </Button>

        <Button
          variant='outline-success'
          className='mt-4'
          onClick={() => {
            if (sTheme?.themeName === '') {
              setError(true)
              return
            }
            createTheme({ sTheme, navigate })
          }}
        >
          Create
          {loading && (
            <Spinner
              as='span'
              animation='border'
              size='sm'
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

export default CreateTheme
