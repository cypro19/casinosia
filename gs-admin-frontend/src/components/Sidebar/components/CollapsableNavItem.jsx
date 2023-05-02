import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, Nav } from '@themesberg/react-bootstrap'
import { useLocation } from 'react-router-dom'

const CollapsableNavItem = (props) => {
  const location = useLocation()
  const { pathname } = location
  const { eventKey, title, children = null, Icon, isUniIcon } = props
  const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : ''

  return (
    <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
      <Accordion.Item eventKey={eventKey}>
        <Accordion.Button
          as={Nav.Link}
          className='d-flex justify-content-between align-items-center'
        >
          <span>
            <span className='sidebar-icon'>
              {/* <FontAwesomeIcon icon={Icon} />{' '} */}
              {isUniIcon ? <span className='sidebar-icon'>
                <Icon />
              </span> : 
                <span className='sidebar-icon'><FontAwesomeIcon icon={Icon} />{'  '}</span>}
            </span>
            <span className='sidebar-text'>{title}</span>
          </span>
        </Accordion.Button>
        <Accordion.Body className='multi-level'>
          <Nav className='flex-column'>{children}</Nav>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default CollapsableNavItem
