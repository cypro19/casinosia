import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '../../../../components/Toast'
import {
  deleteEmailTemplateLanguageStart,
  getDynamicKeysStart,
  getemailTemplateStart,
  getEmailTypesStart,
  getImageGalleryStart,
  testEmailTemplateStart,
  updateEmailTemplateStart
} from '../../../../store/redux-slices/emailTemplate'
import useCheckPermission from '../../../../utils/checkPermission'
import { getActiveLanguagesStart } from '../../../../store/redux-slices/login'

const useEditEmailTemplate = () => {
  const { emailTemplateId } = useParams()
  const [requiredKeyData, setRequiredKeyData] = useState({})
  const [galleryModal, setGalleryModal] = useState(false)
  const { isHidden } = useCheckPermission()
  const [isTestTemplateModalVisible, setIsTestTemplateModalVisible] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [selectedTab, setSelectedTab] = useState('EN')
  const { activeLanguages: languages } = useSelector(state => state.login)
  const [show, setShow] = useState(false)
  const [data, setData] = useState({})

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { emailTemplate, loading, dynamicKeys, testTemplateLoading, emailTypes } = useSelector(
    (state) => state.emailTemplate
  )

  const getTemplateKeys = (template) => {
    const mainKeys = []
    const keys = template.match(/{{{ *[A-Za-z0-9]* *}}}/g)
    if (keys) {
      keys.forEach((key) => {
        mainKeys.push(key.replaceAll('{', '').replaceAll('}', '').trim())
      })
      return [...new Set(mainKeys)]
    } else {
      return []
    }
  }

  const updateTemplate = ({ data }) => {
    const allKeys = dynamicKeys.map((item) => item.key)
    const requiredKeys = dynamicKeys
      .filter((item) => item.required === true)
      .map((item) => item.key)
    const templateKeys = getTemplateKeys(data.templateCode)
    if (templateKeys.length || requiredKeys.length) {
      if (allKeys.some((r) => templateKeys.includes(r))) {
        if (requiredKeys.every((v) => templateKeys.includes(v))) {
          dispatch(
            updateEmailTemplateStart({
              data: {
                ...emailTemplate,
                ...data,
                dynamicData: templateKeys,
                emailTemplateId
              },
              navigate,
            })
          )
        } else {
          toast('Please Use All Required Dynamic Keys', 'error')
        }
      } else {
        toast('Invalid Dynamic Keys', 'error')
      }
    } else {
      dispatch(
        updateEmailTemplateStart({
          data: {
            ...emailTemplate,
            ...data,
            dynamicData: templateKeys,
            emailTemplateId
          },
          navigate,
        })
      )
    }
  }

  useEffect(() => {
    if (Object.keys(dynamicKeys).length) {
      let tempDataAll = {}
      let tempData = {}
      dynamicKeys.forEach((item) => {
        tempDataAll = { ...tempDataAll, [item.key]: item.description }
        if (item.required) {
          tempData = { ...tempData, [item.key]: item.description }
        }
      })
      setRequiredKeyData(tempData)
    }
  }, [dynamicKeys])

  useEffect(() => {
    dispatch(getemailTemplateStart({ emailTemplateId }))
    dispatch(getEmailTypesStart())
  }, [])

  useEffect(() => {
    if (emailTemplate && Object.keys(emailTemplate).length) {
      emailTypes && dispatch(
        getDynamicKeysStart({ type: emailTemplate.type, emailTypes })
      )
    }
  }, [emailTemplate, emailTypes])

  useEffect(() => {
    dispatch(getActiveLanguagesStart({ limit: '', pageNo: '', active: true }))
    !isHidden({ module: { key: 'ImageGallery', value: 'R' } }) && dispatch(getImageGalleryStart())
  }, [])

  const deleteEmailTemplate = ({ data }) => {
    setData(data)
    setShow(true)
  }

  const handleDeleteYes = () => {
    dispatch(deleteEmailTemplateLanguageStart({ data, emailTemplateId }))
    setSelectedTab('EN')
    setShow(false)
  }

  const testEmailTemplateHandler = (e) => {
    e.preventDefault()
    dispatch(
      testEmailTemplateStart({
        data: { templateCode: btoa(emailTemplate?.templateCode), testEmail, dynamicData: requiredKeyData },
        setIsTestTemplateModalVisible,
        setTestEmail
      })
    )
  }

  return {
    emailTemplate,
    loading,
    updateTemplate,
    dynamicKeys,
    galleryModal,
    setGalleryModal,
    isHidden,
    isTestTemplateModalVisible,
    setIsTestTemplateModalVisible,
    testEmailTemplateHandler,
    testEmail,
    setTestEmail,
    testTemplateLoading,
    selectedTab,
    setSelectedTab,
    languages,
    deleteEmailTemplate,
    show,
    setShow,
    handleDeleteYes,
    requiredKeyData,
    setRequiredKeyData
  }
}

export default useEditEmailTemplate
