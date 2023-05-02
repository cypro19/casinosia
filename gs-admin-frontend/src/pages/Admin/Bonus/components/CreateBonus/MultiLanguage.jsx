import { Col, Form, Row } from '@themesberg/react-bootstrap'
import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const MultiLanguage = ({
  selectedLang,
  data,
  setData
}) => {
  const [terms, setTerms] = useState('')

  useEffect(() => {
    data?.terms?.[selectedLang] ? setTerms(data?.terms?.[selectedLang]) : setTerms('')
  }, [data?.terms?.[selectedLang]])

  return (
    <>
      <Row className=' mt-3 mb-3'>
        <Col sm={4} className='mb-3'>
          <label>
            Promotion Title
          </label>
          <Form.Control
            type='text'
            name='promotionTitle'
            placeholder='Enter Promotion Title'
            value={data?.promoTitle?.[selectedLang] || ''}
            onChange={(e) => {
              setData({
                ...data,
                promoTitle: {
                  ...data?.promoTitle,
                  [selectedLang]: e.target.value
                }
              })
            }}
          />
        </Col>
      </Row>
      <Row className='mb-3'>
        <Col>
          <label>
            Description
          </label>
          <Form.Control
            as='textarea'
            type='text'
            name='description'
            placeholder='Enter Description'
            value={data?.desc?.[selectedLang] || ''}
            onChange={(e) => {
              setData({
                ...data,
                desc: {
                  ...data?.desc,
                  [selectedLang]: e.target.value
                }
              })
            }}
          />
        </Col>
      </Row>
      <Row className='mb-3'>
        <Col>
          <label>
            Terms & Conditions
          </label>
          <ReactQuill
            name='termCondition'
            placeholder='Enter Terms and Conditions'
            value={terms}
            onChange={(e) => {
              setData({
                ...data,
                terms: {
                  ...data?.terms,
                  [selectedLang]: e
                }
              })
            }}
          />
        </Col>
      </Row>
    </>
  )
}

export default MultiLanguage
