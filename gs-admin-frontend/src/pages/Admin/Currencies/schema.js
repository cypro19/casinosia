import * as Yup from 'yup'

export const createCurrencySchema = () => Yup.object().shape({
  name: Yup.string()
    .matches(/^[aA-zZ\s]+$/, 'Enter only alphabets')
    .min(3, 'Name should be of more than 3 characters')
    .max(50, 'Name Cannot be of more than 50 characters')
    .required('Name cannot be Empty'),
  code: Yup.string()
    .matches(/^[aA-zZ\s]+$/, 'Enter only alphabets')
    .max(3, 'Code Cannot be of more than 3 characters')
    .required('Code cannot be Empty'),
  symbol: Yup.string()
    .max(5, 'Symbol Cannot be of more than 5 characters')
    .required('Symbol cannot be Empty'),
  exchangeRate: Yup.number('Only enter numbers')
    .typeError('Exchange rate must be a number')
    .positive('Exchange rate must be a positive number')
    .required('Exchange Rate cannot be Empty'),
  loyaltyPoint: Yup.number('Only enter numbers')
    .typeError('Loyalty Point must be a number')
    .positive('Loyalty Point must be Greater Than Zero')
    .required('Loyalty Point cannot be Empty'),
  type: Yup.string()
    .required('Type cannot be Empty')
})
