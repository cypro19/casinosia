import * as Yup from 'yup'

export const fundTransferSchema = Yup.object().shape({
  sourceCurrencyCode: Yup.string().required('Source Currency Required'),
  targetCurrencyCode: Yup.string().required('Target Currency Required'),
  addAmount: Yup.number('Enter Number')
    .min(1, 'Minimum Amount 1 required to deposit')
    .required('Amount Required')
})
