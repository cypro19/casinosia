import React, { useState } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Tabs,
  Tab
} from '@themesberg/react-bootstrap'
import { createCmsNewSchema } from '../schema'
import useCreateCms from '../hooks/useCreateCms'
import useCheckPermission from '../../../../utils/checkPermission'
import Trigger from '../../../../components/OverlayTrigger'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GalleryModal } from '../../../../components/ConfirmationModal'
import { AdminRoutes } from '../../../../routes'
import { CreateCMSTemplate } from '../../../../components/EditCMSTemplate/CreateCMSTemplate'
import { languageCode } from '../constants'
import { toast } from '../../../../components/Toast'

const CreateCMSNew = () => {
  const {
    navigate,
    createCms,
    galleryModal,
    setGalleryModal,
    getGalleryData,
    cmsKeys,
    selectedTab,
    setSelectedTab,
    languages,
    deleteCms
  } = useCreateCms()

  const { isHidden } = useCheckPermission()
  const [title, setTitle] = useState({ EN: '' })
  const [content, setContent] = useState({ EN: '' })

  return (
    <>
      <Row>
        <Col sm={8}>
          <h3>Create CMS</h3>
        </Col>
        <Col className='d-flex justify-content-end'>
          <Trigger message='Gallery'>
            <Button
              hidden={isHidden({ module: { key: 'ImageGallery', value: 'R' } })}
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
          slug: '',
          content: content?.EN || '',
          category: 1,
          isActive: true
        }}
        validationSchema={createCmsNewSchema}
        onSubmit={(formValues) => {
          createCms({ cmsData: { ...formValues, title, content } })
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
                  className='w-auto'
                  value={values.category}
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
                title={
                  <Trigger message='English'>
                    <span>EN</span>
                  </Trigger>
                }
                mountOnEnter
                tabClassName={selectedTab !== 'EN' ? 'email' : 'email-active'}
              >
                <div className='mt-5'>
                  <CreateCMSTemplate
                    cmsKeys={cmsKeys}
                    setFieldValue={setFieldValue}
                    isHidden={isHidden}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    handleSubmit={handleSubmit}
                    navigate={navigate}
                    deleteCms={deleteCms}
                    initValues={values}
                    errors={errors}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                  />
                </div>
              </Tab>
              {languages?.rows?.length && languages?.rows?.map(({code}) => {
                return code !== 'EN' && (
                  <Tab
                    eventKey={code}
                    title={
                      <Trigger message={languageCode[code]}>
                        <span>{code}</span>
                      </Trigger>
                      }
                    key={code}
                    mountOnEnter
                    disabled={content?.EN === '' || title?.EN === ''}
                    tabClassName={selectedTab !== code ? content?.[code] !== undefined ? 'email' : '' : 'email-active'}
                  >
                    <div className='mt-5'>
                      <CreateCMSTemplate
                        cmsKeys={cmsKeys}
                        setFieldValue={setFieldValue}
                        isHidden={isHidden}
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        navigate={navigate}
                        handleSubmit={handleSubmit}
                        deleteCms={deleteCms}
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
              })}
            </Tabs>

            <div className='d-flex justify-content-between'>
              <Button
                variant='warning'
                className='m-2'
                onClick={() => {
                  navigate(AdminRoutes.CMS)
                }}
              >
                Cancel
              </Button>
              <Button
                variant='success'
                hidden={isHidden({ module: { key: 'CMS', value: 'U' } })}
                onClick={() => {
                  if (content?.EN === '') {
                    toast('Content for English is Required', 'error')
                  } else {
                    if (title?.EN === '') {
                      toast('Title for English is Required', 'error')
                      window.scroll(0, 0)
                    } else if (errors.slug) {
                      window.scroll(0, 0)
                      handleSubmit()
                    } else {
                      handleSubmit()
                    }
                  }
                }}
                className='m-2'
              >
                Create
              </Button>

            </div>
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

export default CreateCMSNew
