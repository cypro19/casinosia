import React from 'react'
import UserDocsList from '../../../../components/UserDocsList/UserDocsList'
import { ApproveRejectModal } from '../../../../components/ConfirmationModal'
import Reason from './Reason'
import { ImagePreviewModal } from '../../../../components/ImagePreviewModal'

const Settings = ({
  userDocuments,
  handleVerify,
  documentLabels,
  updateDocument,
  show,
  setShow,
  handleYes,
  handleClose,
  showReasonModal,
  status,
  enable,
  setEnable,
  docLabels,
  handleReRequest,
  title,
  imagePreviewModalShow,
  setImagePreviewModalShow,
  handleImagePreview,
  imageUrl,
  setImageUrl
}) => {
  return (
    <>
      <UserDocsList
        userDocuments={userDocuments}
        documentLabels={documentLabels}
        updateDocument={updateDocument}
        handleVerify={handleVerify}
        docLabels={docLabels}
        handleReRequest={handleReRequest}
        handleImagePreview={handleImagePreview}
      />
      {show &&
        <ApproveRejectModal
          show={show}
          setShow={setShow}
          handleYes={handleYes}
          status={status}
        />}
      {showReasonModal &&
        <Reason
          show={showReasonModal}
          handleYes={handleYes}
          handleClose={handleClose}
          title={title}
          enable={enable}
          setEnable={setEnable}
        />}
      {imagePreviewModalShow &&
        <ImagePreviewModal
          imagePreviewModalShow={imagePreviewModalShow}
          setImagePreviewModalShow={setImagePreviewModalShow}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />}
    </>
  )
}

export default Settings
