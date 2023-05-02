import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateThemeStart } from '../../../../store/redux-slices/theme'

const useEditTheme = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  let selTheme = location.state
  const { loading } = useSelector((state) => state.theme)
  selTheme = {
    themeId: selTheme.themeId,
    themeName: selTheme.themeName,
    primaryColor: selTheme.primaryColor,
    secondaryColor: selTheme.secondaryColor,
    themeMode: selTheme.themeMode
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
  }
  const [sTheme, setStheme] = useState(selTheme)

  const updateTheme = ({ sTheme, navigate }) =>
    dispatch(updateThemeStart({ sTheme, navigate }))

  return {
    navigate,
    loading,
    sTheme,
    setStheme,
    updateTheme
  }
}

export default useEditTheme
