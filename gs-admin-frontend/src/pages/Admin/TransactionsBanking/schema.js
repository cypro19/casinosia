import * as Yup from 'yup'

export const depostSchema =
  Yup.object().shape({
    sourceCurrencyCode: Yup.string()
      .required('Source Currency is Required'),
    targetCurrencyCode: Yup.string()
      .required('Target Currency is Required'),
    // toOwnerId: Yup.string()
    //   .required('Target Email is Required'),
    addAmount: Yup.string()
      .required('Amount is Required'),
    toOwnerType: Yup.string()
      .required('Target type is Required')
  })
