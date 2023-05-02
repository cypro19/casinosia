import { Card, Col, Row } from '@themesberg/react-bootstrap'
import React from 'react'
import ResponsibleGaming from '../../../../components/ResponsibleGaming'

const Overview = ({ basicInfo, userLimits, user }) => {
  return (
    <Row>
      <Col className='col-padding'>
        <Card className='card-overview'>
          <h4 className='h4-overview'>Basic Info <hr className='h4-hr' /></h4>
          <div className='div-overview'>
            {basicInfo?.map(({ label, value, subValue }) => {
              return (
                <div key={label} className='d-flex justify-content-between m-1'>
                  <h6>{label}</h6>
                  <span className={subValue}>{value || 'NA'}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </Col>
      <Col>
        <ResponsibleGaming
          userLimits={userLimits}
          user={user}
          currencyCode={user?.currencyCode}
        />
      </Col>
    </Row>
  )
}

export default Overview
