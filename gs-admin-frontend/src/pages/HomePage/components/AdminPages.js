import React from 'react'
import { Route } from 'react-router-dom'

import PrivateRoute from '../../../components/PrivateRoute'
import { AdminRoutes } from '../../../routes'

// Admin routes
import Admins from '../../Admin/Admins'
import AdminDetails from '../../Admin/AdminDetails'
import Currencies from '../../Admin/Currencies'
import CreateCurrencies from '../../Admin/Currencies/components/CreateCurrencies'
import EditCurrency from '../../Admin/Currencies/components/editCurrency'
import Dashboard from '../../Admin/Dashboard'
import Cms from '../../Admin/CMS'
import Users from '../../Admin/Users'
import UserDetails from '../../Admin/UserDetails'
import CMSDetail from '../../Admin/CMS/components/CmsDetail'
import CasinoProviders from '../../Admin/CasinoProviders'
import CasinoGames from '../../Admin/CasinoGames'
import Countries from '../../Admin/Countries'
import CreateSAdminUser from '../../Admin/Admins/components/CreateSAdminUser'
import EditSAdminUser from '../../Admin/Admins/components/EditSAdminUser'
import TransactionsBanking from '../../Admin/TransactionsBanking'
import Wallet from '../../../components/Sidebar/components/Wallet'
import Deposit from '../../Admin/TransactionsBanking/components'
import Aggregators from '../../Admin/Aggregators'
import CasinoCategory from '../../Admin/CasinoCategory'
import CasinoSubCategory from '../../Admin/CasinoSubCategory'
import RestrictedGames from '../../Admin/RestrictedGames'
import RestrictedProviders from '../../Admin/RestrictedProviders'
import RestrictProviderCountries from '../../Admin/RestrictProviderCountries'
import RestrictGamesCountries from '../../Admin/RestrictGamesCountries'
import CasinoTransactions from '../../Admin/CasinoTransactions'
import CreateCms from '../../Admin/CMS/components/CreateCms'
import EditCms from '../../Admin/CMS/components/EditCms'
import WithdrawRequestList from '../../../components/WithdrawRequestList'
import FormFields from '../../Admin/FormFields'
import CreateBonus from '../../Admin/Bonus/components/CreateBonus'
import BonusManagement from '../../Admin/Bonus'
import EditBonus from '../../Admin/Bonus/components/EditBonus'
import KYCLabels from '../../Admin/KYCLabels'
import BonusDetail from '../../Admin/Bonus/BonusDetail'
import ProfilePage from '../../../components/ProfilePage'
import LoyaltyPoints from '../../../components/LoyaltyPoints'

import CreateEmailTemplate from '../../EmailTemplate'
import EmailTemplate from '../../Admin/EmailTemplate'
import EditEmailTemplate from '../../Admin/EmailTemplate/editEmailTemplate'
import Languages from '../../Admin/Languages'
import ImageGallery from '../../Admin/ImageGallery'
import BannerManagement from '../../Admin/BannerManagement'
import AdminSignin from '../../Admin/AdminSignin'
import ReorderCategory from '../../Admin/CasinoCategory/components/ReorderCategory'
import ReorderSubCategory from '../../Admin/CasinoSubCategory/components/ReorderSubCategory'
import GameReorder from '../../Admin/GameReorder'
import AddSubCategoryGames from '../../Admin/AddSubCategoryGames'
import CreateCMSNew from '../../Admin/CMS/components/CreateCMSNew'
const AdminPages = () => (
  <>
    <Route
      path={AdminRoutes.DefaultRoute}
      element={<AdminSignin />}
    />

    <Route
      path={AdminRoutes.adminRoute}
      element={<AdminSignin />}
    />

    <Route
      path={AdminRoutes.Wallet}
      element={
        <PrivateRoute>
          <Wallet />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Admins}
      element={
        <PrivateRoute module={{ Admins: 'R' }}>
          <Admins />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.ReorderCategory}
      element={
        <PrivateRoute module={{ CasinoManagement: 'U' }}>

          <ReorderCategory />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.ReorderSubCategory}
      element={
        <PrivateRoute module={{ CasinoManagement: 'U' }}>

          <ReorderSubCategory />
        </PrivateRoute>
      }
    />
 
    <Route
      path={AdminRoutes.GameReorder}
      element={
        <PrivateRoute isWithoutCard>
          <GameReorder />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.AdminDetails}
      element={
        <PrivateRoute module={{ Admins: 'R' }}>
          <AdminDetails />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Currencies}
      element={
        <PrivateRoute module={{ Currencies: 'R' }}>
          <Currencies />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.AddSubCategoryGames}
      element={
        <PrivateRoute module={{ CasinoManagement: 'U' }}>

          <AddSubCategoryGames />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Languages}
      element={
        <PrivateRoute module={{ Currencies: 'R' }}>
          <Languages />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CMSDetail}
      element={
        <PrivateRoute module={{ CMS: 'R' }}>
          <CMSDetail />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CreateCurrencies}
      element={
        <PrivateRoute module={{ Currencies: 'C' }}>
          <CreateCurrencies />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CasinoGames}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <CasinoGames />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CMS}
      element={
        <PrivateRoute module={{ CMS: 'R' }}>
          <Cms />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CreateCMS}
      element={
        <PrivateRoute module={{ CMS: 'C' }}>
          <CreateCMSNew />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Users}
      element={
        <PrivateRoute module={{ Users: 'R' }}>
          <Users />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.UserDetails}
      element={
        <PrivateRoute module={{ Users: 'R' }}>
          <UserDetails />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.EditCurrency}
      element={
        <PrivateRoute module={{ Currencies: 'U' }}>
          <EditCurrency />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Dashboard}
      element={
        <PrivateRoute isWithoutCard>
          <Dashboard />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CasinoProviders}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <CasinoProviders />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Countries}
      element={
        <PrivateRoute module={{ RestrictedCountry: 'R' }}>
          <Countries />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CreateSAdminUser}
      element={
        <PrivateRoute module={{ Admins: 'C' }}>
          <CreateSAdminUser />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.EditSAdminUser}
      element={
        <PrivateRoute module={{ Admins: 'U' }}>
          <EditSAdminUser />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.TransactionsBanking}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <TransactionsBanking />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Deposit}
      element={
        <PrivateRoute module={{ Users: 'AB' }}>
          <Deposit />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Withdraw}
      element={
        <PrivateRoute module={{ Users: 'AB' }}>
          <Deposit />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Aggregators}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <Aggregators />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CasinoCategory}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <CasinoCategory />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CasinoSubCategory}
      element={
        <PrivateRoute module={{ CasinoManagement: 'R' }}>
          <CasinoSubCategory />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.RestrictedGames}
      element={
        <PrivateRoute module={{ RestrictedCountry: 'U' }}>
          <RestrictedGames />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.RestrictedProviders}
      element={
        <PrivateRoute module={{ RestrictedCountry: 'U' }}>
          <RestrictedProviders />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.RestrictedProviderCountries}
      element={
        <PrivateRoute module={{ CasinoManagement: 'U' }}>
          <RestrictProviderCountries />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.RestrictedGameCountries}
      element={
        <PrivateRoute module={{ CasinoManagement: 'U' }}>
          <RestrictGamesCountries />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CasinoTransactions}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <CasinoTransactions />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.EditCMS}
      element={
        <PrivateRoute module={{ CMS: 'U' }}>
          <EditCms />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.WithdrawRequests}
      element={
        <PrivateRoute module={{ Transactions: 'R' }}>
          <WithdrawRequestList type='SAdmin' />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.FormFields}
      element={
        <PrivateRoute module={{ RegistrationField: 'R' }}>
          <FormFields />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.CreateBonus}
      element={
        <PrivateRoute module={{ Bonus: 'C' }}>
          <CreateBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.Bonus}
      element={
        <PrivateRoute module={{ Bonus: 'R' }}>
          <BonusManagement />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditBonus}
      element={
        <PrivateRoute module={{ Bonus: 'U' }}>
          <EditBonus />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.BonusDetail}
      element={
        <PrivateRoute module={{ Bonus: 'R' }}>
          <BonusDetail />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.KYCLabels}
      element={
        <PrivateRoute module={{ KycLabel: 'R' }}>
          <KYCLabels />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.CreateEmailTemplate}
      element={
        <PrivateRoute module={{ EmailTemplate: 'C' }}>
          <CreateEmailTemplate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EmailTemplate}
      element={
        <PrivateRoute module={{ EmailTemplate: 'R' }}>
          <EmailTemplate />
        </PrivateRoute>
      }
    />
    <Route
      path={AdminRoutes.EditEmailTemplate}
      element={
        <PrivateRoute module={{ EmailTemplate: 'U' }}>
          <EditEmailTemplate />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Profile}
      element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.Loyalty}
      element={
        <PrivateRoute module={{ LoyaltyProgram: 'R' }}>
          <LoyaltyPoints />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.ImageGallery}
      element={
        <PrivateRoute module={{ ImageGallery: 'R' }}>
          <ImageGallery />
        </PrivateRoute>
      }
    />

    <Route
      path={AdminRoutes.BannerManagement}
      element={
        <PrivateRoute>
          <BannerManagement />
        </PrivateRoute>
      }
    />
  </>
)

export default AdminPages
