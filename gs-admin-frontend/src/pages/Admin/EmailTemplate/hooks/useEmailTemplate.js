import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllemailTemplatesStart, getImageGalleryStart } from '../../../../store/redux-slices/emailTemplate'
import useCheckPermission from '../../../../utils/checkPermission'
import { getLanguagesStart } from '../../../../store/redux-slices/login'

const useEmailTemplate = () => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [lang, setLang] = useState('EN')
  const [templateData, setTemplateData] = useState('')
  const { languages } = useSelector(state => state.login)
  const { isHidden } = useCheckPermission()
  const setModalData = (template) => {
    setTemplateData(template)
    setShow(true)
  }

  const { emailTemplate, emailTemplates, loading, emailTemplateOrder } = useSelector((state) => state.emailTemplate)

  useEffect(() => {
    dispatch(getAllemailTemplatesStart({}))
    dispatch(getLanguagesStart({ limit: '', pageNo: '' }))
    !isHidden({ module: { key: 'ImageGallery', value: 'R' } }) &&
      dispatch(getImageGalleryStart())
  }, [])

  return {
    emailTemplate,
    emailTemplates,
    loading,
    show,
    setShow,
    setModalData,
    templateData,
    isHidden,
    emailTemplateOrder,
    lang,
    setLang,
    languages
  }
}

export default useEmailTemplate
