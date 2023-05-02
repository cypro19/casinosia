import * as Yup from 'yup'

export const providerSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[A-Za-z0-9 ]+$/, 'Only Alpha-Numeric Values Allowed')
    .required('Provider Name Required'),
  masterGameAggregatorId: Yup.string()
    .required('Aggregator Required'),
  thumbnail: Yup.mixed().required('A file is required')
    .test('File Size',
      'File Size Should be Less Than 1MB',
      (value) => !value || (value && value.size <= 1024 * 1024))
    .test('FILE_FORMAT', 'Uploaded file has unsupported format.',
      (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg']
        .includes(value.type)))
})

export const editproviderSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[A-Za-z0-9 ]+$/, 'Only Alpha-Numeric Values Allowed')
    .required('Provider Name Required'),
  thumbnail: Yup.mixed()
    .test('File Size',
      'File Size Should be Less Than 1MB',
      (value) => !value || (value && value.size <= 1024 * 1024))
    .test('FILE_FORMAT', 'Uploaded file has unsupported format.',
      (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg']
        .includes(value.type)))
})
