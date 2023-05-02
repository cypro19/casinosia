import React, {useState} from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Tabs,
  Tab
} from '@themesberg/react-bootstrap'
import { createCmsSchema } from '../schema'
import useCreateCms from '../hooks/useCreateCms'
import useCheckPermission from '../../../../utils/checkPermission'
import Trigger from '../../../../components/OverlayTrigger'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GalleryModal } from '../../../../components/ConfirmationModal'
import EditCMSTemplate from '../../../../components/EditCMSTemplate'

const CreateCms = ({ cmsData, details }) => {
  const {
    navigate,
    createCms,
    editCms,
    cmsPageId,
    setTemplate,
    galleryModal,
    setGalleryModal,
    getGalleryData,
    cmsKeys,
    selectedTab,
    setSelectedTab,
    languages,
    deleteCms
  } = useCreateCms(cmsData)
  const { isHidden } = useCheckPermission()
  const [title, setTitle] = useState(cmsData ? cmsData?.title : { EN: '' })
  const [content, setContent] = useState(cmsData ? cmsData?.content : { EN: '' })
  return (
    <>
      <Row>
        <Col sm={8}>
          <h3>{cmsData ? `${!details ? 'Edit' : ''} CMS: ${cmsData?.title?.EN}` : 'Create CMS'}</h3>
        </Col>
        <Col className='d-flex justify-content-end'>
          <Trigger message='Gallery'>
            <Button
              hidden={details || isHidden({ module: { key: 'ImageGallery', value: 'R' } })}
              onClick={() => {
                getGalleryData()
                setGalleryModal(true)
              }}
              variant='secondary'
            >
              <FontAwesomeIcon icon={faImages} />
            </Button>
          </Trigger>
        </Col>
      </Row>

      <Formik
        initialValues={{
          title: title?.EN || '',
          slug: cmsData ? cmsData?.slug : '',
          content: content?.EN || '',
          category: cmsData ? cmsData?.category : 1,
          isActive: cmsData ? (!!cmsData?.isActive) : true,
          language: selectedTab
        }}
        validationSchema={createCmsSchema}
        onSubmit={(formValues) => {
          !cmsData
            ? createCms({ cmsData: { ...formValues} })
            : editCms({ cmsData: { ...formValues, title: title, content: content, cmsPageId: parseInt(cmsPageId) } })
        }}
      >
        {({ values, errors, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
          <Form>
            <Row className='mb-3 align-items-center'>
              <Col xs={6}>
                <Col>
                  <BForm.Label>
                    Slug <span className='text-danger'>*</span>
                  </BForm.Label>
                </Col>
                <Col>
                  <BForm.Control
                    type='text'
                    name='slug'
                    placeholder='Enter Slug'
                    value={values.slug}
                    disabled={details}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component='div'
                    name='slug'
                    className='text-danger'
                  />
                </Col>
              </Col>

              <Col>
                <BForm.Label>
                  Category <span className='text-danger'>*</span>
                </BForm.Label>

                <BForm.Select
                  type='text'
                  name='category'
                  size='sm'
                  className='w-auto'
                  value={values.category}
                  disabled={details}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value={1}>Support</option>
                  <option value={2}>About</option>
                  <option value={3}>Responsible Gaming</option>
                </BForm.Select>
              </Col>

              <Col>
                <Col>
                  <BForm.Label>
                    Status <span className='text-danger'>*</span>
                  </BForm.Label>
                </Col>
                <Col>
                  <BForm.Check
                    type='switch'
                    name='isActive'
                    disabled={details}
                    defaultChecked={values.isActive}
                    value={values.isActive}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Col>

              </Col>

            </Row>
            <Tabs
              activeKey={selectedTab}
              onSelect={(tab) => setSelectedTab(tab)}
              className='nav-light mt-3'
            >
              <Tab
                eventKey='EN'
                title='EN'
                mountOnEnter
                tabClassName={selectedTab !== 'EN' ? 'email' : 'email-active'}
              >
                <div className='mt-5'>
                  <EditCMSTemplate
                    values={cmsData}
                    cmsKeys={cmsKeys}
                    setFieldValue={setFieldValue}
                    isHidden={isHidden}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setTemp={setTemplate}
                    handleSubmit={handleSubmit}
                    navigate={navigate}
                    deleteCms={deleteCms}
                    details={details}
                    initValues={values}
                    errors={errors}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                  />
                </div>
              </Tab>
              {details
                ? cmsData && languages?.count > 1 && languages?.rows?.map(({ code }) => {
                  return cmsData?.content[code] !== undefined && code !== 'EN' && (
                    <Tab
                      eventKey={code}
                      title={code}
                      key={code}
                      mountOnEnter
                      disabled={(!cmsData && cmsData?.content.EN === undefined)}
                      tabClassName={selectedTab !== code ? content[code] !== undefined ? 'email' : '' : 'email-active'}
                    >
                      <div className='mt-5'>
                        <EditCMSTemplate
                          values={cmsData}
                          cmsKeys={cmsKeys}
                          setFieldValue={setFieldValue}
                          isHidden={isHidden}
                          selectedTab={selectedTab}
                          setSelectedTab={setSelectedTab}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          setTemp={setTemplate}
                          navigate={navigate}
                          handleSubmit={handleSubmit}
                          deleteCms={deleteCms}
                          details={details}
                          initValues={values}
                          errors={errors}
                          title={title}
                          setTitle={setTitle}
                          content={content}
                          setContent={setContent}
                        />
                      </div>
                    </Tab>
                  )
                })
                : (
                  cmsData && languages?.count > 1 && languages?.rows?.map(({ code }) => {
                  if(code === 'EN') return null;
                  return (
                    <Tab
                      eventKey={code}
                      title={code}
                      key={code}
                      mountOnEnter
                      disabled={(!cmsData && cmsData?.content.EN === undefined)}
                      tabClassName={selectedTab !== code ? content[code] !== undefined ? 'email' : '' : 'email-active'}
                    >
                      <div className='mt-5'>
                        <EditCMSTemplate
                          values={cmsData}
                          cmsKeys={cmsKeys}
                          setFieldValue={setFieldValue}
                          isHidden={isHidden}
                          selectedTab={selectedTab}
                          setSelectedTab={setSelectedTab}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          setTemp={setTemplate}
                          navigate={navigate}
                          handleSubmit={handleSubmit}
                          deleteCms={deleteCms}
                          details={details}
                          initValues={values}
                          errors={errors}
                          title={title}
                          setTitle={setTitle}
                          content={content}
                          setContent={setContent}
                        />
                      </div>
                    </Tab>
                  )
                })
                  )}
            </Tabs>

          </Form>
        )}
      </Formik>
      {galleryModal &&
        <GalleryModal
          galleryModal={galleryModal}
          setGalleryModal={setGalleryModal}
        />}
    </>
  )
}

export default CreateCms
