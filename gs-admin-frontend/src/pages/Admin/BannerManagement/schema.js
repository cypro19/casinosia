import * as Yup from 'yup'

export const uploadBannerSchema = (type) => Yup.object().shape({
  thumbnail: type === 'Create'
    ? Yup.mixed().required('Banner Required').test('File Size',
      'File Size Should be Less Than 1MB', (value) => !value || (value && value.size <= 1024 * 1024))
      .test('FILE_FORMAT', 'Uploaded file has unsupported format.',
        (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)))
    : Yup.mixed().test('File Size',
      'File Size Should be Less Than 1MB', (value) => !value || (value && value.size <= 1024 * 1024))
      .test('FILE_FORMAT', 'Uploaded file has unsupported format.',
        (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)))
})
