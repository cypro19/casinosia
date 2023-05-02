import * as Yup from 'yup'

export const bonusSchema = (curr, { bonusDetail }) =>
  [Yup.object().shape({
    promotionTitle: Yup.string().required('Promotion Title Required').nullable(),
    bonusType: Yup.string().required('Bonus Type Required').nullable(),
    betLevel: Yup.number().when(['bonusType'], {
      is: (bonusType) => {
        if (bonusType === 'freespins' || bonusType === 'cashfreespins') {
          return true
        } else {
          return false
        }
      },
      then: Yup.number()
        .min(1, 'Minimum value must be 1').required('Bet Level Required')
        .integer('Only Integer Values Allowed')
    }).nullable(),
    termCondition: Yup.string().required('Terms and Conditions Required').nullable(),
    description: Yup.string().required('Description Required').nullable(),
    bonusImage: !bonusDetail
      ? Yup.mixed().required('A file is required').test('File Size',
        'File Size Should be Less Than 1MB', (value) => !value || (value && value.size <= 1024 * 1024))
        .test('FILE_FORMAT', 'Uploaded file has unsupported format.',
          (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type))).nullable()
      : Yup.mixed().test('File Size',
        'File Size Should be Less Than 1MB', (value) => !value || (value && value.size <= 1024 * 1024))
        .test('FILE_FORMAT', 'Uploaded file has unsupported format.',
          (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type))).nullable(),
    validOnDays: Yup.array().when(['visibleInPromotions'], {
      is: (visibleInPromotions) => {
        if (visibleInPromotions) {
          return true
        } else {
          return false
        }
      },
      then: Yup.array().min(1, 'Select At Least One Day').nullable()
    }).nullable(),
    quantity: Yup.number().when(['bonusType'], {
      is: (bonusType) => {
        if (bonusType === 'freespins') {
          return true
        } else {
          return false
        }
      },
      then: Yup.number()
        .min(1, 'Minimum Value Must be One')
        .typeError('Only Numbers Allowed')
        .required('Quantity Required')
        .integer('Only Integer Values Allowed')
    }),
    depositBonusPercent: Yup.number().when(['bonusType'], {
      is: (bonusType) => {
        if (bonusType === 'deposit') {
          return true
        } else {
          return false
        }
      },
      then: Yup.number()
        .min(1, '% Must be greater than or equal to 1')
        .typeError('Bonus Percent must be a Number')
        .required('Bonus Percentage Required').nullable()
    }),

    wageringMultiplier: Yup.number().when(['bonusType'], {
      is: (bonusType) => {
        if(bonusType === 'deposit') return true
        else return false
      },
      then: Yup.number().min(1, 'Minimum Value Must be One').typeError('Only Numbers Allowed').required('Wagering Multiplier Required')
    }),

    daysToClear: Yup.number()
      .min(1, 'Minimum Value Must be One').typeError('Only Numbers Allowed')
      .integer('Only Integer Values Allowed')
      .required('Days To Clear Required')

  }),
  Yup.object().shape({
    currency: Yup.object().when(['bonusType', 'isSticky'], (bonusType, isSticky) => {
        return currencyValidate({ curr, bonusType, isSticky })
    }
    )
  }),
  Yup.object().shape({
  }),
  Yup.object().shape({
  }),
  Yup.object().shape({
    loyaltyLevel: Yup.array()
      .of(
        Yup.object().shape({
          bonusPercentage: Yup.number().typeError('Only Numbers Allowed').required('Value Required.')
            .min(0, 'Must be Greater Than 0')
            .max(9999, 'Must be Less Than 9999'),
          cashback_multiplier: Yup.number().typeError('Only Numbers Allowed').required('Value Required.')
            .min(0, 'Must be Greater Than 0')
            .max(9999, 'Must be Less Than 9999')
        })
      )
  })
  ]

const currencyValidate = ({ curr, bonusType, isSticky }) => {
  const validationObject = {}
  if (bonusType === 'deposit') {
    for (const file in curr) {
      validationObject[file] = Yup.object().shape({
        maxBonusThreshold: Yup.number().typeError('Only Numbers Allowed').required('Required.'),
        minDeposit: Yup.number().typeError('Only Numbers Allowed').required('Required.'),
        maxWinAmount: Yup.number().typeError('Only Numbers Allowed').required('Required.'),
        zeroOutThreshold: Yup.number().typeError('Only Numbers Allowed').required('Required.')
      })
    }
  } else if (bonusType === 'freespins' && (isSticky === 'true' || isSticky)) {
    for (const file in curr) {
      validationObject[file] = Yup.object().shape({
        maxWinAmount: Yup.number().typeError('Only Numbers Allowed').required('Required.'),
        zeroOutThreshold: Yup.number().typeError('Only Numbers Allowed').required('Required.')
      })
    }
  } else {
    for (const file in curr) {
      validationObject[file] = Yup.object().shape({
        maxWinAmount: Yup.number().typeError('Only Numbers Allowed').required('Required.')
      })
    }
  }
  return Yup.object(validationObject)
}
