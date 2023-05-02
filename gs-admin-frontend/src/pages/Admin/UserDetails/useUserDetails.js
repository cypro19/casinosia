import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getBonusStart } from '../../../store/redux-slices/bonus'
import { getUserDocumentStart, getUserStart, verifyUserDocumentStart } from '../../../store/redux-slices/fetchData'
import { getDocumentLabelStart, updateDocumentStart } from '../../../store/redux-slices/superAdminSettings'
import { getDocumentLabel } from '../../../utils/apiCalls'
import { formatDateYMD } from '../../../utils/dateFormatter'

const useUserDetails = () => {
  const [selectedTab, setSelectedTab] = useState('overview')
  const { userData, loading } = useSelector((state) => state.fetch)
  const { documentLabels } = useSelector(state => state.superAdminSettings)
  const { bonusList } = useSelector((state) => state.admins)
  const { bonusDetail } = useSelector((state) => state.bonus)
  const { userId } = useParams()
  const dispatch = useDispatch()
  const { userDocuments } = useSelector(state => state.fetch)
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState('')
  const [userDocumentId, setUserDocumentId] = useState('')
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [enable, setEnable] = useState(false)
  const [docLabels, setDocLabels] = useState('')
  const [title, setTitle] = useState('')
  const [imagePreviewModalShow, setImagePreviewModalShow] = useState(false)
  const [imageUrl, setImageUrl] = useState({ name: '', preview: [] })
  const [showModal, setShowModal] = useState(false)
  const [freespinModal, setFreeSpinModal] = useState(false)
  const [showManageMoneyModal, setShowManageMoneyModal] = useState(false)
  const [selectedBonus, setSelectedBonus] = useState()
  const [bonusAmount, setBonusAmount] = useState()

  const handleClose = () => {
    setShowReasonModal(false)
    setEnable(false)
  }
  useEffect(() => {
    dispatch(getUserStart({ userId }))
    dispatch(getUserDocumentStart({ userId }))
    dispatch(getDocumentLabelStart({ userId: parseInt(userId) }))
  }, [userId])

  const handleYes = (reason, request) => {
    if (request === 'request' || request === 'cancel') {
      dispatch(updateDocumentStart({ data: { documentLabelId: userDocumentId, reason, userId: parseInt(userId), reRequested: true }, isRequested: (request === 'request') }))
    } else {
      dispatch(verifyUserDocumentStart({ userId, data: { userDocumentId, reason, status, userId: parseInt(userId) } }))
    }
    setShow(false)
    setShowReasonModal(false)
    setStatus('')
  }

  const handleVerify = (modalStatus, userDocumentId) => {
    setStatus(modalStatus)
    setUserDocumentId(userDocumentId)
    if (modalStatus === 'approved') {
      setShow(true)
      setShowReasonModal(false)
    } else {
      setShow(false)
      setShowReasonModal(true)
    }
    setTitle('Rejecting')
  }

  useEffect(() => {
    if (!docLabels) {
      async function fetchData () {
        await getDocumentLabel('').then((res) => {
          setDocLabels(res?.data?.data?.documentLabel)
        })
      }
      fetchData()
    }
  }, [])

  useEffect(() => {
    if (!selectedBonus && bonusList?.length > 0) {
      setSelectedBonus(bonusList?.[0])
    }
    if (selectedBonus) {
      dispatch(getBonusStart({ bonusId: selectedBonus?.bonusId}))
    }
  }, [bonusList, selectedBonus?.bonusId])

  const updateDocument = ({ documentLabelId, isRequested }) => {
    dispatch(updateDocumentStart({ data: { documentLabelId, userId: parseInt(userId) }, isRequested }))
  }

  const handleReRequest = (docId, myStatus) => {
    setStatus('')
    if (myStatus === 'cancel') {
      setShow(true)
      setShowReasonModal(false)
    } else {
      setShow(false)
      setShowReasonModal(true)
    }
    setUserDocumentId(docId)
    setTitle('Re-Requesting')
  }

  const handleImagePreview = (documentUrl, name) => {
    setImageUrl({ name, preview: documentUrl })
    setImagePreviewModalShow(true)
  }

  const showStyle = (data) => (data ? 'text-success' : 'text-danger')
  const printData = (data) => (data ? 'Yes' : 'No')

  const basicInfo = [
    { label: 'ID', value: userId },
    { label: 'Email', value: userData?.email },
    { label: 'Email Verified', value: printData(userData?.isEmailVerified), subValue: showStyle(userData?.isEmailVerified) },
    { label: 'KYC Status', value: userData?.kycStatus },
    { label: 'Full Name', value: `${userData?.firstName} ${userData?.lastName}` },
    { label: 'User Name', value: userData?.username },
    { label: 'Gender', value: userData?.gender },
    { label: 'Date Of Birth', value: formatDateYMD(userData?.dateOfBirth) },
    { label: 'Phone Number', value: userData?.phone },
    { label: 'Address', value: userData?.address + ', ' + userData?.city + ', ' + userData?.zipCode },
    { label: 'Country Code', value: userData?.countryCode },
    { label: 'Status', value: userData?.isActive ? 'Active' : 'In -Active', subValue: showStyle(userData?.isActive) },
    {
      label: 'Tags',
      value: userData?.tags
        ? userData?.tags?.length < 1 ? 'N/A' : userData?.tags?.join(', ')
        : 'N/A'
    }
  ]
  return {
    bonusList,
    selectedTab,
    userData,
    loading,
    userDocuments,
    documentLabels,
    show,
    status,
    showReasonModal,
    title,
    imagePreviewModalShow,
    imageUrl,
    enable,
    docLabels,
    showModal,
    selectedBonus,
    bonusDetail,
    bonusAmount,
    basicInfo,
    freespinModal,
    showManageMoneyModal,
    setBonusAmount,
    setSelectedBonus,
    setShowModal,
    setSelectedTab,
    handleVerify,
    updateDocument,
    setShow,
    handleYes,
    handleClose,
    setEnable,
    handleReRequest,
    setImagePreviewModalShow,
    handleImagePreview,
    setImageUrl,
    setShowManageMoneyModal,
    setFreeSpinModal
  }
}

export default useUserDetails
