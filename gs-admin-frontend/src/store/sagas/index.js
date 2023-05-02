import { spawn } from 'redux-saga/effects'
import loginWatcher from './login'
import playersWatcher from './players'
import adminsWatcher from './admins'
import currenciesWatcher from './currencies'
import cmsFetchDataWatcher from './cmsFetchData'
// import cmsWatcher from './cms'
// import usersWatcher from './users'
import fetchWatcher from './fetchData'
import adminTUsersWatcher from './adminTUsers'
import adminUserWatcher from './adminUser'
import superAdminCasinoManagementWatcher from './superAdminCasinoManagement'
import superAdminTransactionsWatcher from './superAdminTransactions'
import transferFundWatcher from './transferFund'
import bonusWatcher from './bonus'
import superAdminSettingsWatcher from './superAdminSettings'
import dashboardWatcher from './dashboard'
import EmailTemplateWatcher from './emailTemplate'

export default function * rootSaga () {
  yield spawn(loginWatcher)
  yield spawn(playersWatcher)
  yield spawn(adminsWatcher)
  yield spawn(currenciesWatcher)
  yield spawn(cmsFetchDataWatcher)
  yield spawn(fetchWatcher)
  yield spawn(adminTUsersWatcher)
  yield spawn(adminUserWatcher)
  yield spawn(superAdminCasinoManagementWatcher)
  yield spawn(superAdminTransactionsWatcher)
  yield spawn(transferFundWatcher)
  yield spawn(bonusWatcher)
  yield spawn(superAdminSettingsWatcher)
  yield spawn(dashboardWatcher)
  yield spawn(EmailTemplateWatcher)
}
