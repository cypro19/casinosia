import { Row, Col, Badge, Form } from '@themesberg/react-bootstrap'
import React, { useState } from 'react'
import {
  checkLabels,
  daysLabels,
} from './../components/CreateBonus/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import Parser from 'html-react-parser'
import { formatDateYMD } from '../../../../utils/dateFormatter'

const GeneralDetails = ({ bonusDetail, selectedLang }) => {
  return (
    <>
      <Row>
        <Col sm={4}>
          <Row>
            <Col>
              <h3 className='h6 text-nowrap'>Promotion Title</h3>
            </Col>
            <Col>
              <p>{bonusDetail?.promotionTitle?.[selectedLang]}</p>
            </Col>
          </Row>

          {bonusDetail?.visibleInPromotions && <Row>
            <Col>
              <h3 className='h6 text-nowrap'>Valid on Days</h3>
            </Col>
            <Col>
              {daysLabels?.map((day) => {
                return (
                  <Col
                    key={day}
                    className='d-flex'
                    style={{
                      verticalAlign: 'middle',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <p>{day}</p>
                    {bonusDetail?.validOnDays.includes(day) && (
                      <div
                        className='rounded-circle mt-2 mx-2'
                        style={{
                          width: '10px',
                          height: '10px',
                          background: '#1aa509'
                        }}
                      />
                    )}
                  </Col>
                )
              })}
            </Col>
                                               </Row>}
          <Row>
            <Col>
              <h3 className='h6 text-nowrap'>Terms and Conditions</h3>
            </Col>
            <Col>
              {bonusDetail?.termCondition?.[selectedLang] && Parser(bonusDetail?.termCondition?.[selectedLang])}
            </Col>
          </Row>
        </Col>
        <Col sm={4}>
          <Row>
            <Col>
              <h3 className='h6 text-nowrap'>Bonus Type</h3>
            </Col>
            <Col>
              {/* <p>{bonusType.filter((type)=>)}</p> */}
              <p>{bonusDetail?.bonusType === 'freespins' ? bonusDetail?.isSticky ? 'BONUS FREESPINS' : 'CASH FREESPINS' : bonusDetail?.bonusType === 'joining' ? 'JOINING' : bonusDetail?.bonusType?.toUpperCase()}</p>
            </Col>
          </Row>
          {bonusDetail?.bonusType === 'freespins' &&
            <Row>
              <Col>
                <h3 className='h6 text-nowrap'>Quantity</h3>
              </Col>
              <Col>
                {/* <p>{bonusType.filter((type)=>)}</p> */}
                <p>{bonusDetail?.quantity}</p>
              </Col>
            </Row>}
          {(bonusDetail?.bonusType === 'joining') &&
            <Row>
              <Col>
                <h3 className='h6 text-nowrap'>{bonusDetail?.bonusType === 'joining' ? 'Min Deposit Percentage' : 'Bonus Percentage'}</h3>
              </Col>
              <Col>
                <p>{bonusDetail?.depositBonusPercent}%</p>
              </Col>
            </Row>}
              {bonusDetail?.bonusType === 'deposit' &&
                <Row>
                <Col>
                  <h3 className='h6 text-nowrap'>Wagering Multiplier </h3>
                </Col>
                <Col>
                  <p>{bonusDetail?.wageringMultiplier}</p>
                </Col>
              </Row>}
          <Row>
            <Col>
              <h3 className='h6 text-nowrap'>Days To Clear</h3>
            </Col>
            <Col>
              <p>{bonusDetail?.daysToClear}</p>
            </Col>
          </Row>
          {bonusDetail?.bonusType === 'freespins' &&
            <Row>
              <Col>
                <h3 className='h6 text-nowrap'>Bet Level</h3>
              </Col>
              <Col>
                <p>{bonusDetail?.other?.betLevel}</p>
              </Col>
            </Row>}
          {checkLabels(bonusDetail?.bonusType).map(({ label, value, id }) => {
            return (
              <Row key={label}>
                <Col>
                  <h3 className='h6 text-nowrap'>{label}</h3>
                </Col>
                <Col>
                  <Badge
                    className='mb-3'
                    bg={bonusDetail?.[value] ? 'success' : 'dark'}
                  >
                    <FontAwesomeIcon
                      icon={bonusDetail?.[value] ? faCheck : faTimes}
                    />
                  </Badge>
                </Col>
              </Row>
            )
          })}
        </Col>
        <Col sm={4}>
          <Row>
            <Col>
              <h3 className='h6 text-nowrap'>Code</h3>
            </Col>
            <Col>
              <p>{bonusDetail?.code}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3 className='h6 text-nowrap'>Description</h3>
            </Col>
            <Col>
              <p>{bonusDetail?.description?.[selectedLang]}</p>
            </Col>
          </Row>
          {(bonusDetail?.bonusType !== 'deposit') &&
            <>
              <Row>
                <Col>
                  <h3 className='h6 text-nowrap'>Valid From</h3>
                </Col>
                <Col>
                  <p>{formatDateYMD(bonusDetail?.validFrom)}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3 className='h6 text-nowrap'>Valid To</h3>
                </Col>
                <Col>
                  <p>{formatDateYMD(bonusDetail?.validTo)}</p>
                </Col>
              </Row>
            </>}
            
          <Row>
            <Col>
              <img src={`${bonusDetail?.imageUrl}`} height='200' width='300' alt='img' />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
export default GeneralDetails
