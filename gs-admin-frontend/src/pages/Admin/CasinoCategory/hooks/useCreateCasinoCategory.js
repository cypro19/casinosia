import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveLanguagesStart } from '../../../../store/redux-slices/login'
import { createCasinoCategoryStart, updateCasinoCategoryStart } from '../../../../store/redux-slices/superAdminCasinoManagement'

const useCreateCasinoCategory = () => {
  const dispatch = useDispatch()
  const [createName, setCreateName] = useState({ EN: '' })
  const { activeLanguages: languages } = useSelector(state => state.login)
  const [language, setLanguage] = useState('EN')
  useEffect(() => {
    if(!languages) dispatch(getActiveLanguagesStart({limit: '', pageNo: '', active: true}))
  }, [])
  const { loading } = useSelector((state) => state.superAdminCasino)

  const updateCasinoCategory = (data) =>
    dispatch(
      updateCasinoCategoryStart(data)
    )

  const createCasinoCategory = (data) =>
    dispatch(
      createCasinoCategoryStart(data)
    )

  return {
    loading,
    updateCasinoCategory,
    createCasinoCategory,
    language,
    setLanguage,
    createName,
    setCreateName,
    languages 
  }
}

export default useCreateCasinoCategory
