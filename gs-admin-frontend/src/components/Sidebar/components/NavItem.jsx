import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Nav, Badge, Image } from '@themesberg/react-bootstrap'

const NavItem = (props) => {
  const location = useLocation()
  const { pathname } = location
  const {
    title,
    link,
    target,
    external,
    Icon,
    image,
    badgeText,
    setShow,
    badgeBg = 'secondary',
    badgeColor = 'primary',
    isUniIcon = false
  } = props
  const classNames = badgeText
    ? 'd-flex justify-content-start align-items-center justify-content-between'
    : ''
  const navItemClassName = link === pathname ? 'active' : ''
  const linkProps = external ? { href: link } : { as: Link, to: link }

  return (
    <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
      <Nav.Link {...linkProps} target={target} className={classNames}>
        <span>
          {Icon
            ? (
              isUniIcon ? <span className='sidebar-icon'>
                <Icon />
              </span> : 
                <span className='sidebar-icon'><FontAwesomeIcon icon={Icon} />{'  '}</span>
              )
            : null}
          {image
            ? (
              <Image
                src={image}
                width={20}
                height={20}
                className='sidebar-icon svg-icon'
              />
              )
            : null}

          <span className='sidebar-text'>{title}</span>
        </span>
        {badgeText
          ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className='badge-md notification-count ms-2'
            >
              {badgeText}
            </Badge>
            )
          : null}
      </Nav.Link>
    </Nav.Item>
  )
}

export default NavItem
