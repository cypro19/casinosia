import React from 'react'
import { Tabs, Tab, Row, Col } from '@themesberg/react-bootstrap'
import Overview from './components/Overview'
import Permissions from './components/Permissions'
import useAdminDetails from './hooks/useAdminDetails'
import Hierarchy from '../../../components/Hierarchy'
import Preloader from '../../../components/Preloader'

const AdminDetails = () => {
  const {
    setSelectedTab,
    selectedTab,
    adminDetails,
    loading
    // navigate
  } = useAdminDetails()

  return (
    <>
      {loading && <Preloader />}
      <>
        <Row>
          <Col className='d-flex'>
            <h3>{adminDetails?.SuperadminRole?.name}:&nbsp; </h3>

            <h3>
              <div
                style={{
                  whitespace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {adminDetails &&
                  `${adminDetails?.firstName} ${adminDetails?.lastName}`}
              </div>
            </h3>
          </Col>

        </Row>

        <Tabs
          activeKey={selectedTab}
          onSelect={(tab) => setSelectedTab(tab)}
          className='nav-light'
        >
          <Tab eventKey='overview' title='Overview'>
            <div className='mt-5'>
              <Row className='mt-3 '>
                <Overview adminDetails={adminDetails} />
              </Row>
            </div>
          </Tab>

          {/* <Tab eventKey='wallet' title='Wallet'>
          <div className='mt-5'>
            <Row className='mt-3 '>
              <AdminWallet adminDetails={adminDetails} />
            </Row>
          </div>
        </Tab> */}

          <Tab eventKey='permissions' title='Permissions'>
            <div className='mt-5'>
              <Row className='mt-3 d-flex text-left'>
                <Permissions adminDetails={adminDetails} />
              </Row>
            </div>
          </Tab>
          {adminDetails?.superRoleId !== 3 &&
            <Tab eventKey='usersTree' title='Tree'>
              <div className='mt-5'>
                <Row className='mt-3 d-flex flex-row-reverse text-right'>
                  {adminDetails && adminDetails?.superAdminUserId && (
                    <Hierarchy
                      adminDetails={{
                        name: `${adminDetails?.firstName} ${adminDetails?.lastName}`,
                        id: adminDetails?.superAdminUserId,
                        children: [],
                        isInitial: true,
                        data: { superRoleId: adminDetails?.superRoleId }
                      }}
                    />
                  )}
                </Row>
              </div>
            </Tab>}
          {/* <Tab eventKey='subAdmins' title='SubAdmins'>
          <div className='mt-5'>
            <Row className='mt-3 d-flex flex-row-reverse text-right'>
              <SubAdmins superAdminId={adminId} />
            </Row>
          </div>
        </Tab> */}
        </Tabs>
      </>
    </>
  )
}

export default AdminDetails
