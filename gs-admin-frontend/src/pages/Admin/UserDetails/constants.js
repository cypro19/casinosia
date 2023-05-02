export const reasonOptions = [
  'Image Not Visible Properly',
  'Not A Valid Document',
  'Document Validation Expired',
  'Add Custom Reason'
]

export const tableHeaders = [
  { label: 'Id', value: 'userBonusId' },
  { label: 'Promotion Title', value: 'promotionTitle' },
  { label: 'Bonus Type', value: 'bonusType' },
  { label: 'Valid Till', value: 'validTo' },
  { label: 'Is Expired', value: 'isExpired' },
  { label: 'Status', value: 'isActive' },
  { label: 'Cancelled By', value: 'cancelledBy' },
  { label: 'Updated At', value: 'updatedAt' },
  { label: 'Action', value: 'action' }
]

export const bonusStatus = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Forfeited', value: 'FORFEITED' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Completed', value: 'COMPLETED' }
]

export const bonusTypes = [
  { label: 'All', value: '' },
  { label: 'DEPOSIT', value: 'deposit', id: 0 },
  { label: 'JOINING', value: 'joining', id: 1 },
  { label: 'FREESPINS', value: 'freespins', id: 2 }
]
