import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveLanguagesStart } from '../../../../store/redux-slices/login'
import {
  createSubCategoryStart,
  updateSubCategoryStart
} from '../../../../store/redux-slices/superAdminCasinoManagement'

const useCreateSubCategory = (editIconName, editIconColor) => {
  const dispatch = useDispatch()

  const [myIconName, setMyIconName] = useState('FaAndroid')
  const [myIconColor, setMyIconColor] = useState('red')
  const [createName, setCreateName] = useState({ EN: '' })
  const { activeLanguages: languages } = useSelector(state => state.login)
  const [language, setLanguage] = useState('EN')

  useEffect(() => {
    if (editIconName && editIconColor) {
      setMyIconColor(editIconColor)
      setMyIconName(editIconName)
    }
  }, [editIconColor, editIconName])
  useEffect(() => {
    if(!languages) dispatch(getActiveLanguagesStart({limit: '', pageNo: '', active: true}))
  }, [])

  const { loading, gameCategory: casinoCategories } = useSelector((state) => state.superAdminCasino)

  const updateCasinoMenu = (data) =>
    dispatch(
      updateSubCategoryStart(data)
    )

  const createCasinoMenu = (data) =>
    dispatch(
      createSubCategoryStart(data)
    )

  return {
    myIconName,
    myIconColor,
    setMyIconName,
    setMyIconColor,
    loading,
    updateCasinoMenu,
    createCasinoMenu,
    casinoCategories,
    language,
    setLanguage,
    createName,
    setCreateName,
    languages
  }
}

export default useCreateSubCategory
