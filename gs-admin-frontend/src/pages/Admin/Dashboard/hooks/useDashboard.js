import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getElasticHealthStart } from '../../../../store/redux-slices/dashboard'

const useDashboard = () => {
  const { adminPermissions, loading } = useSelector(state => state.admins)
  const { elasticHealth } = useSelector(state => state.dashboard)
  const reportsToShow = ['GameReport', 'KpiReport', 'PlayerStatisticsReport', 'KpiSummaryReport', 'LivePlayerReport', 'PlayerLiabilityReport']
  const permissionKeys = adminPermissions && Object.keys(adminPermissions)
  const dispatch = useDispatch()
  const nonElasticReports = ['LivePlayerReport', 'PlayerStatisticsReport']

  useEffect(() => {
    dispatch(getElasticHealthStart())
  }, [])

  return {
    reportsToShow,
    permissionKeys,
    loading,
    adminPermissions,
    elasticHealth,
    nonElasticReports
  }
}

export default useDashboard
