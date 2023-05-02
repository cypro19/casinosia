import * as Yup from 'yup'

export const editGamesSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, 'Name must be less than 50 characters')
    .required('Game Name Required'),
  description: Yup.string()
    .max(1000, 'Description must be less than 1000 characters').nullable(),
  thumbnail: Yup.mixed()
    .test('File Size',
      'File Size Should be Less Than 1MB',
      (value) => !value || (value && value.size <= 1024 * 1024))
    .test('FILE_FORMAT', 'Uploaded file has unsupported format.',
      (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg']
        .includes(value.type)))
})
