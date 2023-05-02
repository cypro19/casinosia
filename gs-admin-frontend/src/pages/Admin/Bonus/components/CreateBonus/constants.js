export const checkLabels = (bonusType) => {
  switch (bonusType) {
    case 'freespins':
      return [
        { label: 'Active', value: 'isActive', message: 'If True Status is Active else In-Active' },
        { label: 'Visible In Promotions', value: 'visibleInPromotions', message: 'If true visible in promotion else not' }
      ]
    case 'joining':
      return [
        { label: 'Active', value: 'isActive', message: 'If True Status is Active else In-Active' },
      ]

    case 'deposit':
      return [
        { label: 'Active', value: 'isActive', message: 'If True Status is Active else In-Active' },
        { label: 'Visible In Promotions', value: 'visibleInPromotions', message: 'If true visible in promotion else not' }
      ]

    default:
      return [
        { label: 'Active', value: 'isActive', message: 'If True Status is Active else In-Active' },
      ]
  }
}

export const daysLabels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

export const convertAmountOptions = [
  { label: 'Max Bonus Claimed', value: 'maxBonusThreshold' },
  { label: 'Min Deposit', value: 'minDeposit' },
  { label: 'Max Win Amount', value: 'maxWinAmount' },
  { label: 'Zero Out Threshold', value: 'zeroOutThreshold' },
  { label: 'Min Wallet Balance', value: 'minBalance' },
  { label: 'Amount', value: 'amount' }
]

export const bonusType = [
  { label: 'JOINING', value: 'joining', id: 1 },
  { label: 'FREESPINS', value: 'freespins', id: 2 },
  { label: 'DEPOSIT', value: 'deposit', id: 4 }
]

export const tabLabels = [
  'general', 'currency', 'games', 'loyalty'
]
