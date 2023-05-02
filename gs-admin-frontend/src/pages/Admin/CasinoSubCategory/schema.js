import * as Yup from 'yup'

export const createSubCategorySchema = (name) => Yup.object().shape({
  subCategoryName: validateName(name),
  masterGameCategoryId: Yup.string().required('Category is required')
})

const validateName = (name) => {
  const validationObject = {}
  for (const file in name) {
    validationObject[file] = Yup
      .string()
      .required('Sub Category Name Required').nullable()
  }
  return Yup.object(validationObject)
}
