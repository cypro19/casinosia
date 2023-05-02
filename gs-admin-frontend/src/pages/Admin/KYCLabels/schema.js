import * as Yup from 'yup'

export const KYCSchema = (name) => Yup.object().shape({
  name: validateName(name)
})

const validateName = (name) => {
  const validationObject = {}
  for (const file in name) {
    validationObject[file] = Yup.string()
      .required('Label Name Required!').nullable()
  }
  return Yup.object(validationObject)
}
