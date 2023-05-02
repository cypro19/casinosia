import { combineReducers } from '@reduxjs/toolkit'

import loginReducer from './login'
import playersReducer from './players'
import adminReducer from './admins'
import currencyReducer from './currencies'
import fetchReducer from './fetchData'
import cmsFetchDataReducer from './cmsFetchData'
import adminTUsersReducer from './adminTUsers'
import adminUserReducer from './adminUser'
import superAdminCasinoManagementReducer from './superAdminCasinoManagement'
import superAdminTransactionReducer from './superAdminTransactions'
import tranferFundReducer from './transferFund'
import bonusReducer from './bonus'
import superAdminSettingsReducer from './superAdminSettings'
import dashboardReducer from './dashboard'
import emailTemplateReducer from './emailTemplate'

const appReducer = combineReducers({
  login: loginReducer,
  players: playersReducer,
  admins: adminReducer,
  currencies: currencyReducer,
  cmsFetch: cmsFetchDataReducer,
  adminTUsers: adminTUsersReducer,
  fetch: fetchReducer,
  adminUser: adminUserReducer,
  superAdminCasino: superAdminCasinoManagementReducer,
  superAdminTransactions: superAdminTransactionReducer,
  transferFund: tranferFundReducer,
  bonus: bonusReducer,
  superAdminSettings: superAdminSettingsReducer,
  dashboard: dashboardReducer,
  emailTemplate: emailTemplateReducer
})

export const resetState = () => ({
  type: 'resetState'
})

const rootReducer = (state, action) => {
  if (action.type === 'resetState') {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

export default rootReducer
