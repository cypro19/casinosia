import { Card } from '@themesberg/react-bootstrap'
import RUG from '../react-upload-gallery-master/src/RUG'
import '../react-upload-gallery-master/src/style.scss'
import useUploadGallery from './useUploadGallery'
import React from 'react'
import { DeleteConfirmationModal } from '../ConfirmationModal'
import { toast } from '../Toast'

export default () => {
  const {
    initialState,
    customRequest,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    setImageDelete,
    isHidden
  } = useUploadGallery()

  return (
    <Card className='mt-3'>
      <h3 className='m-2'>Gallery</h3>
      {initialState?.length > 0 &&
        <RUG
          initialState={initialState}
          customRequest={customRequest}
          className='m-3'
          isHidden={isHidden}
          onConfirmDelete={(currentImage) => {
            if (!isHidden({ module: { key: 'ImageGallery', value: 'D' } })) {
              setDeleteModalShow(true)
              setImageDelete(currentImage)
            } else {
              toast('Delete Permission Not Granted', 'error')
            }
          }}
          ssrSupport
          rules={{
            size: 1024
          }}

          accept={['jpg', 'jpeg', 'png']}

          onWarning={(type, rules) => {
            switch (type) {
              case 'accept':
                toast(`Only ${rules.accept.join(', ')} Extensions Allowed`, 'error')
                break

              case 'size':
                toast(`Size of the image must be <= ${rules.size / 1024}MB`, 'error')
                break

              default:
            }
          }}
        />}
      {initialState?.length < 1 &&
        <RUG
          initialState={[]}
          customRequest={customRequest}
          className='m-3'
          ssrSupport
          isHidden={isHidden}
        />}
      {
            deleteModalShow &&
              <DeleteConfirmationModal
                handleDeleteYes={handleDeleteYes}
                setDeleteModalShow={setDeleteModalShow}
                deleteModalShow={deleteModalShow}
              />
          }
    </Card>
  )
}
