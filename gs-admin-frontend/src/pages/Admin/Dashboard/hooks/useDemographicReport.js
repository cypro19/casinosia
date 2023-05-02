import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import map from '@highcharts/map-collection/custom/world.geo.json'
import { getLoginToken } from '../../../../utils/storageUtils'
import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import { getDemographicReportStart } from '../../../../store/redux-slices/dashboard'
import { countryFilter } from '../../../../utils/countryFilter'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const useDemographicReport = ({ selectedPortal, selectedClient }) => {
  const dispatch = useDispatch()
  const { demogLoading: loading, demogData } = useSelector((state) => state.dashboard)
  const [formatedData, setFormatedData] = useState([])
  const [dateOptions, setDateOptions] = useState('today')
  const isInitialRender = useDidMountEffect()

  const getColor = (value) => {
    if (value <= 1000) {
      return '#b4ecff'
    } else if (value <= 100000) {
      return 'rgb(0, 217, 255)'
    } else {
      return '#00a2ff'
    }
  }

  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(0),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  const formatDataHandler = (list) => {
    const data = []

    list && list.map((item) => {
      const { countryName } = countryFilter(item.country_code)
      const row = {
        z: item.signUpCount,
        code: item.country_code,
        countryName,
        color: getColor(item.signUpCount)
      }
      data.push(row)
      return null
    })

    setFormatedData(data)
  }

  useEffect(() => {
    if (demogData) formatDataHandler(demogData)
  }, [demogData])

  const loadDemogData = () => {
    dispatch(getDemographicReportStart({
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      dateOptions
    }))
  }

  useEffect(() => {
    loadDemogData()
  }, [state, selectedClient, selectedPortal])

  useEffect(() => {
    if (dateOptions !== 'custom' && !isInitialRender) {
      loadDemogData()
    }
  }, [dateOptions])

  const getCsvDownloadUrl = () =>
  `${process.env.REACT_APP_API_URL}/api/admin/get-demographic-report?startDate=${formatDateYMD(state.map(a => a.startDate))}&endDate=${formatDateYMD(state.map(a => a.endDate))}&dateOptions=${dateOptions}&csvDownload=true&token=${getLoginToken()}`

  const options = {
    chart: {
      map
    },

    title: {
      text: ''
    },
    series: [
      {
        name: 'Signups Report',
        data: formatedData,
        joinBy: ['iso-a2', 'code'],
        tooltip: {
          pointFormat: '{point.properties.hc-a2}: {point.countryName} Users'
        }
      }
    ]
  }

  return {
    options,
    demogData,
    formatedData,
    loadDemogData,
    loading,
    setState,
    state,
    getCsvDownloadUrl,
    dateOptions,
    setDateOptions
  }
}

export default useDemographicReport
