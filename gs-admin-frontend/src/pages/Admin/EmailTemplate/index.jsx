import React from 'react'
import {
  Button,
  Row,
  Col,
  Table,
  ButtonGroup,
  Accordion,
  Modal,
  Form
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons'

import Preloader from '../../../components/Preloader'
import useEmailTemplate from './hooks/useEmailTemplate'
import Trigger from '../../../components/OverlayTrigger'
import { useNavigate } from 'react-router-dom'

export default () => {
  const navigate = useNavigate()
  const {
    emailTemplates,
    loading,
    show,
    setShow,
    setModalData,
    templateData,
    isHidden,
    emailTemplateOrder,
    lang,
    setLang,
    languages
  } = useEmailTemplate()

  return (
    <>
      {loading
        ? (
          <Preloader />
          )
        : (
          <>
            <Row>
              <Col>
                <h3>Email Templates</h3>
              </Col>
            </Row>
            <Accordion defaultActiveKey='0'>
              {emailTemplateOrder?.map(
                (template, index) =>
                  emailTemplates.hasOwnProperty(template) && (
                    <Accordion.Item
                      eventKey={String(index)}
                      key={`${template}-${index}`}
                    >
                      <Accordion.Header>{template}</Accordion.Header>
                      <Accordion.Body>
                        <Table
                          bordered
                          striped
                          responsive
                          hover
                          size='sm'
                          className='text-center mt-4'
                        >
                          <thead className='thead-dark'>
                            <tr>
                              {['Id', 'Label', 'Action'].map((c) => (
                                <th key={c}>{c}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {emailTemplates?.[`${template}`].map(
                              ({
                                emailTemplateId,
                                label,
                                templateCode
                              }) => {
                                return (
                                  <tr key={emailTemplateId}>
                                    <td>{emailTemplateId}</td>
                                    <td>{label}</td>
                                    <td>
                                      <ButtonGroup>
                                        <Trigger message='Edit'>
                                          <Button
                                            className='m-1'
                                            size='sm'
                                            variant='warning'
                                            hidden={isHidden({ module: { key: 'EmailTemplate', value: 'U' } })}
                                            onClick={() =>
                                              navigate(
                                            `/admin/edit-email-template/${emailTemplateId}`
                                              )}
                                          >
                                            <FontAwesomeIcon icon={faEdit} />
                                          </Button>
                                        </Trigger>

                                        <Trigger message='View Template'>
                                          <Button
                                            className='m-1'
                                            size='sm'
                                            variant='info'
                                            onClick={() =>
                                              setModalData(
                                                templateCode
                                              )}
                                          >
                                            <FontAwesomeIcon icon={faEye} />
                                          </Button>
                                        </Trigger>
                                      </ButtonGroup>
                                    </td>
                                  </tr>
                                )
                              }
                            )}
                          </tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  )
              )}
            </Accordion>

            {/* {!isHidden({ module: { key: 'ImageGallery', value: 'R' } }) && <ReactUploadGallery />} */}

            <Modal
              show={show}
              onHide={() => setShow(false)}
              dialogClassName='modal-90w'
              size='lg'
              aria-labelledby='example-custom-modal-styling-title'
            >
              <Modal.Header closeButton />
              <Modal.Body>
                <Row>
                  <Col>
                    <Form.Label>Language</Form.Label>
                  </Col>
                  <Col>
                    <Form.Select
                      name='language'
                      value={lang}
                      onChange={(e) => {
                        setLang(e.target.value)
                      }}
                    >
                      <option value='EN'>English</option>
                      {languages?.count && languages?.rows?.map(({ languageName, code }) => {
                        return code !== 'EN' && templateData?.[code] !== undefined && (
                          <option key={code} value={code}>{languageName}</option>
                        )
                      })}
                    </Form.Select>
                  </Col>
                </Row>
                <div
                  dangerouslySetInnerHTML={{
                    __html: templateData?.[lang]
                  }}
                />
              </Modal.Body>
            </Modal>
          </>
          )}
    </>
  )
}
