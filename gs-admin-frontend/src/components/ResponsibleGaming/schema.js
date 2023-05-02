import * as Yup from 'yup'

export const limitsSchema = ({ minimum, currLabel, label }) => Yup.object().shape({
  limit: Yup.number()
    .positive('Limit must be positive number')
    .integer('Limit must be an integer')
    .min(minimum + 1, `${currLabel} Must Be Greater Than ${label} (${minimum})`)
    .required('Limit Required')
})

export const setDisableUserlimitsSchema = () => Yup.object().shape({
  limit: Yup.number()
    .positive('Time Period must be positive number')
    .integer('Time Period must be an integer')
    .required('Time Period Required')
})

export const selfExclusionSchema = () => Yup.object().shape({
  days: Yup.number()
    .positive('Month must be positive number')
    .integer('Month must be an integer')
    .required('Month Required')
})
