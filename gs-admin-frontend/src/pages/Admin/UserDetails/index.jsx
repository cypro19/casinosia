import React from 'react'
import { Tabs, Tab, Row, Col, Button, Modal, Form, Table } from '@themesberg/react-bootstrap'
import Overview from './components/Overview'
import UserWallet from './components/UserWallet'
import useUserDetails from './useUserDetails'
import Preloader from '../../../components/Preloader'
import CasinoTransactions from './components/CasinoTransactions'
import TransactionBanking from './components/TransactionBanking'
import Settings from './components/Settings'
import GameReport from './components/GameReport'
import useCheckPermission from '../../../utils/checkPermission'
import YourBonuses from './components/YourBonuses'
import { formatDate } from '../../../utils/dateFormatter'
import FreeSpinBonusModal from '../../../components/FreeSpinBonusModal/FreeSpinBonusModal'
import ManageMoney from '../../../components/ManageMoney'

const UserDetails = () => {
  const {
    selectedTab,
    bonusList,
    show,
    userData,
    loading,
    userDocuments,
    documentLabels,
    status,
    showReasonModal,
    enable,
    docLabels,
    title,
    imagePreviewModalShow,
    imageUrl,
    showModal,
    selectedBonus,
    bonusDetail,
    bonusAmount,
    basicInfo,
    freespinModal,
    showManageMoneyModal,
    setShowModal,
    setSelectedTab,
    updateDocument,
    handleVerify,
    setShow,
    handleYes,
    handleClose,
    setEnable,
    handleReRequest,
    setImagePreviewModalShow,
    setShowManageMoneyModal,
    handleImagePreview,
    setImageUrl,
    setFreeSpinModal
  } = useUserDetails()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? (
          <Preloader />
          )
        : (
          <>
            <Row>
              <Col className='d-flex'>
                <h3>Player:&nbsp;</h3>
                <h3>
                  <div className='d-flex'>
                    {userData && userData?.firstName}{' '}
                    {userData && userData?.lastName}
                  </div>
                </h3>
              </Col>
              <Col className='d-flex justify-content-end'>
                <Button
                  className='m-2'
                  size='sm'
                  variant='success'
                  hidden={isHidden({ module: { key: 'Bonus', value: 'Issue' } })}
                  onClick={() => setFreeSpinModal(true)}
                >
                  Issue Freespins
                </Button>

                <Button
                  className='m-2'
                  size='sm'
                  variant='success'
                  hidden={isHidden({ module: { key: 'Users', value: 'AB' } })}
                  onClick={() => setShowManageMoneyModal(true)}
                >
                  Manage Wallet
                </Button>
              </Col>
            </Row>
            <Tabs
              activeKey={selectedTab}
              onSelect={(tab) => setSelectedTab(tab)}
              className='nav-light'
              mountOnEnter
              unmountOnExit
            >
              <Tab eventKey='overview' title='Overview'>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <Overview
                      basicInfo={basicInfo}
                      userLimits={userData?.userLimit}
                      user={userData}
                    />
                  </Row>
                </div>
              </Tab>

              <Tab eventKey='wallet' title='Wallet'>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex flex-row-reverse text-right'>
                    <UserWallet myUserData={userData} />
                  </Row>
                </div>
              </Tab>

              {!isHidden({ module: { key: 'Transactions', value: 'R' } }) &&
                <Tab eventKey='casino-transactions' title='Bet History'>
                  <div className='mt-5'>
                    <Row className='mt-3 d-flex flex-row-reverse '>
                      <CasinoTransactions />
                    </Row>
                  </div>
                </Tab>}

              {!isHidden({ module: { key: 'Transactions', value: 'R' } }) &&
                <Tab eventKey='transactions-banking' title='Transactions'>
                  <div className='mt-5'>
                    <Row className='mt-3 d-flex flex-row-reverse '>
                      <TransactionBanking />
                    </Row>
                  </div>
                </Tab>}

              <Tab eventKey='settings' title='KYC Settings'>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex flex-row-reverse '>
                    <Settings
                      userDocuments={userDocuments}
                      documentLabels={documentLabels}
                      updateDocument={updateDocument}
                      handleVerify={handleVerify}
                      show={show}
                      setShow={setShow}
                      handleYes={handleYes}
                      status={status}
                      showReasonModal={showReasonModal}
                      handleClose={handleClose}
                      enable={enable}
                      setEnable={setEnable}
                      docLabels={docLabels}
                      handleReRequest={handleReRequest}
                      title={title}
                      imagePreviewModalShow={imagePreviewModalShow}
                      setImagePreviewModalShow={setImagePreviewModalShow}
                      handleImagePreview={handleImagePreview}
                      imageUrl={imageUrl}
                      setImageUrl={setImageUrl}
                    />
                  </Row>
                </div>
              </Tab>

              {!isHidden({ module: { key: 'GameReport', value: 'R' } }) &&
                <Tab eventKey='game-report' title='Game Report'>
                  <div className='mt-5'>
                    <Row className='mt-3 d-flex flex-row-reverse '>
                      <GameReport />
                    </Row>
                  </div>
                </Tab>}

              {!isHidden({ module: { key: 'Bonus', value: 'R' } }) &&
                <Tab eventKey='your-bonuses' title='Your Bonuses'>
                  <div className='mt-5'>
                    <YourBonuses
                      currencyCode={userData?.currencyCode}
                    />
                  </div>
                </Tab>}

            </Tabs>
          </>
          )}

      {freespinModal &&
        <FreeSpinBonusModal
          show={freespinModal}
          setShow={setFreeSpinModal}
        />}

      <ManageMoney
        show={showManageMoneyModal}
        handleClose={setShowManageMoneyModal}
        user={userData}
      />
    </>
  )
}

export default UserDetails
