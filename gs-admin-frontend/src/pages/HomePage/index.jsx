import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import AdminPages from './components/AdminPages'

import { AdminRoutes, CommonRoutes } from '../../routes'
import NotFound from '../NotFound'
import AdminSignIn from '../Admin/AdminSignin'
import { getItem } from '../../utils/storageUtils'

export default () => {
  let { role } = useSelector((state) => state.login)

  if (!role) {
    role = getItem('role')
  }

  return (
    <Routes>
      {/* Public Routes without sidebar */}
      <Route
        path={AdminRoutes.AdminSignin}
        element={<AdminSignIn />}
      />

      {AdminPages()}
      <Route path={CommonRoutes.NotFound} element={<NotFound />} />


      <Route
        path='*'
        element={<Navigate replace to={CommonRoutes.NotFound} />}
      />
    </Routes>
  )
}
