import { faImages } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Row, Tab, Tabs } from '@themesberg/react-bootstrap'
import React from 'react'
import { DeleteConfirmationModal, GalleryModal } from '../../../components/ConfirmationModal'
import EditEmailTemplate from '../../../components/EditEmailTemplate'
import Trigger from '../../../components/OverlayTrigger'
import Preloader from '../../../components/Preloader'
import useEditEmailTemplate from './hooks/useEditEmailTemplate'

export default () => {
  const {
    emailTemplate,
    loading,
    updateTemplate,
    dynamicKeys,
    galleryModal,
    setGalleryModal,
    isHidden,
    setIsTestTemplateModalVisible,
    isTestTemplateModalVisible,
    testEmailTemplateHandler,
    testEmail,
    setTestEmail,
    testTemplateLoading,
    selectedTab,
    setSelectedTab,
    languages,
    deleteEmailTemplate,
    show,
    setShow,
    handleDeleteYes
  } = useEditEmailTemplate()
  return (
    <>
      {loading
        ? (
          <Preloader />
          )
        : (
          <>
            <Row className='mb-2'>
              <Col sm={8}>
                <h3>{`Email Template : ${emailTemplate?.label}`}</h3>
              </Col>
              <Col className='d-flex justify-content-end align-items-center'>
                <Trigger message='Gallery'>
                  <Button
                    hidden={isHidden({ module: { key: 'ImageGallery', value: 'R' } })}
                    onClick={() => setGalleryModal(true)}
                    variant='secondary'
                  >
                    <FontAwesomeIcon icon={faImages} />
                  </Button>
                </Trigger>
              </Col>
            </Row>
            <Tabs
              activeKey={selectedTab}
              onSelect={(tab) => setSelectedTab(tab)}
              className='nav-light'
            >
              <Tab eventKey='EN' title='EN' tabClassName={selectedTab !== 'EN' ? 'email' : 'email-active'}>
                <div className='mt-5'>
                  <EditEmailTemplate
                    dynamicKeys={dynamicKeys}
                    isHidden={isHidden}
                    setGalleryModal={setGalleryModal}
                    emailTemplate={emailTemplate}
                    setIsTestTemplateModalVisible={setIsTestTemplateModalVisible}
                    isTestTemplateModalVisible={isTestTemplateModalVisible}
                    updateTemplate={updateTemplate}
                    galleryModal={galleryModal}
                    testTemplateLoading={testTemplateLoading}
                    testEmailTemplateHandler={testEmailTemplateHandler}
                    testEmail={testEmail}
                    setTestEmail={setTestEmail}
                    selectedTab={selectedTab}
                    deleteEmailTemplate={deleteEmailTemplate}
                  />
                </div>
              </Tab>
              {languages?.count > 0 && languages?.rows?.map(({ code }) => {
                return code !== 'EN' && (
                  <Tab
                    eventKey={code}
                    title={code}
                    key={code}
                    tabClassName={selectedTab !== code ? emailTemplate?.templateCode?.[code] !== undefined ? 'email' : '' : 'email-active'}
                  >
                    <div className='mt-5'>
                      <EditEmailTemplate
                        dynamicKeys={dynamicKeys}
                        isHidden={isHidden}
                        setGalleryModal={setGalleryModal}
                        emailTemplate={emailTemplate}
                        setIsTestTemplateModalVisible={setIsTestTemplateModalVisible}
                        isTestTemplateModalVisible={isTestTemplateModalVisible}
                        updateTemplate={updateTemplate}
                        galleryModal={galleryModal}
                        testTemplateLoading={testTemplateLoading}
                        testEmailTemplateHandler={testEmailTemplateHandler}
                        testEmail={testEmail}
                        setTestEmail={setTestEmail}
                        selectedTab={selectedTab}
                        deleteEmailTemplate={deleteEmailTemplate}
                      />
                    </div>
                  </Tab>
                )
              })}
            </Tabs>
          </>
          )}

      {show &&
        <DeleteConfirmationModal
          handleDeleteYes={handleDeleteYes}
          setDeleteModalShow={setShow}
          deleteModalShow={show}
        />}

      {galleryModal &&
        <GalleryModal
          galleryModal={galleryModal}
          setGalleryModal={setGalleryModal}
        />}
    </>
  )
}
