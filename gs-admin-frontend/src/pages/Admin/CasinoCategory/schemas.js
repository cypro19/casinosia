import * as Yup from 'yup'

export const casinoCategorySchema = (name) => Yup.object().shape({
  categoryName: validateName(name)
})

const validateName = (name) => {
  const validationObject = {}
  for (const file in name) {
    validationObject[file] = Yup
      .string()
      .required('Category Name Required!').nullable()
  }
  return Yup.object(validationObject)
}
