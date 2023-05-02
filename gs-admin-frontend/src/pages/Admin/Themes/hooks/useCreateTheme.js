import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createThemeStart } from '../../../../store/redux-slices/theme'

const useCreateTheme = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState(false)
  const { loading } = useSelector((state) => state.theme)
  const [sTheme, setStheme] = useState({
    themeName: '',
    themeMode: 'Dark',
    primaryColor: '#000000',
    secondaryColor: '#ffffff'
  })

  const createTheme = ({ sTheme, navigate }) =>
    dispatch(createThemeStart({ sTheme, navigate }))

  return {
    navigate,
    error,
    setError,
    loading,
    sTheme,
    setStheme,
    createTheme
  }
}

export default useCreateTheme
