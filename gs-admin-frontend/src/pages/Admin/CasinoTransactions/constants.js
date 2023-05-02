export const tableHeaders = [
  'ID',
  'User Email',
  'Game Name',
  'Action Type',
  'Amount',
  'Bonus Money',
  'Currency Code',
  'Status',
  'Created At'
]

export const transactionType = [
  { label: 'All', value: 'all' },
  { label: 'Bet', value: 'bet' },
  { label: 'Win', value: 'win' },
  { label: 'RollBack', value: 'rollback' },
  { label: 'Pre RollBack', value: 'rollbackbeforebetwin' },
  { label: 'Free Spin', value: 'freespins' }
]

export const statusType = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Complete', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'RollBack', value: 'rollback' }
]
