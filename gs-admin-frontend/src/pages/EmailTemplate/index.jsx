import { Col, Row } from '@themesberg/react-bootstrap'
import React, { useState } from 'react'
import CodepenEditor from '../../components/CodeEditor'

export default () => {
  const [template, setTemplate] = useState('')
  return (
    <>
      <Row>
        <Col sm={8}>
          <h3>Email Template</h3>
        </Col>
        <CodepenEditor
          initial='HTML'
          mobileQuery={800}
          height='400px'
          setTemplate={setTemplate}
          themeTransitionSpeed={150}
        />
      </Row>
      <Row>
        <button onClick={() => console.log(template, 'hhhhhhhh')}>jhhjh</button>
      </Row>
    </>
  )
}
