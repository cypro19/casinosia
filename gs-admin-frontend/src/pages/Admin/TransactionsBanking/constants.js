export const tableHeaders = [
  { label: 'ID', value: 'transactionBankingId' },
  { label: 'Transaction ID', value: 'paymentTransactionId' },
  { label: 'Actionee', value: 'actioneeEmail' },
  { label: 'Payment Provider', value: 'paymentProvider' },
  { label: 'Amount', value: 'amount' },
  { label: 'Action Type', value: 'transactionType' },
  { label: 'Actionee Type', value: 'actioneeType' },
  { label: 'Currency Code', value: 'currencyCode' },
  { label: 'Status', value: 'status' },
  { label: 'Created At', value: 'createdAt' }
]

export const transactionType = [
  { label: 'Deposit', value: 'deposit' },
  { label: 'Withdraw', value: 'withdraw' },
  { label: 'Add Money', value: 'addMoney' },
  { label: 'Remove Money', value: 'removeMoney' },
  { label: 'Bonus', value: 'bonus' },
  { label: 'Bonus To Cash', value: 'bonusToCash' },
  { label: 'Bonus Forfiet', value: 'bonusForfeit' },
  { label: 'Bonus Expired', value: 'bonusExpired' },
  { label: 'Bonus Zeroed Out', value: 'bonusZeroedOut' }
]

export const statusType = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 0 },
  { label: 'Complete', value: 1 },
  { label: 'Failed', value: 2 }
]
