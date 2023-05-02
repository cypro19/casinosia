import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLanguage,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { Button, Col } from '@themesberg/react-bootstrap'

import { AdminRoutes } from '../../../routes'
import { faWindows } from '@fortawesome/free-brands-svg-icons'
import { removeLoginToken } from '../../../utils/storageUtils'
import CollapsableNavItem from './CollapsableNavItem'
import NavItem from './NavItem'
import { SANavItems } from '../constants'
import { resetState } from '../../../store/redux-slices'
import { toast } from '../../Toast'
import { UilChart, UilUser, UilLanguage, UilSignout } from '@iconscout/react-unicons'

const AdminNavItems = ({ setShow }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { wallets } = useSelector((state) => state.login)
  const { adminPermissions, adminRoleId } = useSelector((state) => state.admins)

  const primaryWallet = wallets && wallets?.rows?.find((w) => w.currencyCode === 'EUR')

  return (
    <div className='mt-2'>
      {primaryWallet && (
        <div className='text-center mt-3 mb-3'>
          <Col>
            {primaryWallet?.currencyCode} : {primaryWallet?.amount}
          </Col>
        </div>
      )}

      <NavItem
        title='Dashboard'
        link={AdminRoutes.Dashboard}
        setShow={setShow}
        Icon = {UilChart}
        isUniIcon={true}
      />

      <NavItem
        title='Profile'
        link={AdminRoutes.Profile}
        setShow={setShow}
        Icon = {UilUser}
        isUniIcon={true}
      />

      {adminRoleId === 1 &&
        <NavItem
          title='Languages'
          link={AdminRoutes.Languages}
          setShow={setShow}
          Icon = {UilLanguage}
          isUniIcon={true}
        />
      }

      {SANavItems.map(({ label, value, isCollapsible = false, options }, index) =>
        adminPermissions && Object.keys(adminPermissions).includes(label) &&
          (!isCollapsible
            ? (
              <NavItem
                key={index}
                title={value.title}
                link={value.link}
                Icon={value.Icon}
                setShow={setShow}
                isUniIcon={value?.isUniIcon || false}
              />
              )
            : (
              <CollapsableNavItem
                key={index}
                eventKey={value.eventKey}
                title={value.title}
                Icon={value.Icon}
                isUniIcon={value?.isUniIcon || false}
                setShow={setShow}
              >
                {options?.map(({ value }, indx) => (
                  <NavItem
                    key={indx}
                    title={value.title}
                    link={value.link}
                    Icon={value.Icon}
                    setShow={setShow}
                    isUniIcon={value?.isUniIcon || false}
                  />
                ))}
              </CollapsableNavItem>
              ))
      )}

      <Button
        className='signout'
        variant='light'
        onClick={() => {
          removeLoginToken()
          dispatch(resetState())
          toast("You have been logged out.", "success", "logoutToast")
          navigate(AdminRoutes.AdminSignin)
        }}
      >
        <UilSignout />
        {/* Bootstrap class isn't working here */}
        <span style={{ marginLeft: '4px' }}>Logout</span>
      </Button>
    </div>
  )
}

export default AdminNavItems
