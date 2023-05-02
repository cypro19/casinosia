import React, { useState } from 'react'
import SimpleBar from 'simplebar-react'
import { CSSTransition } from 'react-transition-group'
import { Nav, Button, Navbar } from '@themesberg/react-bootstrap'
import { useSelector } from 'react-redux'
import AdminNavItems from './components/AdminNavItems'
import { getItem } from '../../utils/storageUtils'

export default (props = {}) => {
  const [show, setShow] = useState(false)
  const showClass = show ? 'show' : ''

  let { role, adminRole } = useSelector((state) => state.login)
  const { adminRoleId, adminDetails } = useSelector(state => state.admins)

  if (!role) {
    role = getItem('role')
  }

  const roleData = adminRole?.find(val => val.superRoleId !== 1 && val.superRoleId === parseInt(adminRoleId))?.name
   

  const onCollapse = () => setShow(!show)

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant='dark'
        className='navbar-theme-primary px-4 d-md-none'
      >
        <Navbar.Toggle
          as={Button}
          aria-controls='main-navbar'
          onClick={onCollapse}
        >
          <span className='navbar-toggler-icon' />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames='sidebar-transition'>
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white pb-4`}
        >
          <div className='sidebar-inner px-4 pt-3'>
            <Nav className='flex-column pt-3 pt-md-0'>
              <h5 className='d-flex align-items-center m-auto mb-0'>{role}&nbsp;
                {roleData && <span style={{ fontSize: '15px' }}>({roleData})</span>}
              </h5>
              <h5 className='d-flex align-items-center m-auto mb-0'>
              ({adminDetails?.email && <span style={{ fontSize: '15px', textAlign: 'center' }}>{adminDetails.email}</span>})
              </h5>
              
              <hr />

                <AdminNavItems setShow={setShow} />
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  )
}
