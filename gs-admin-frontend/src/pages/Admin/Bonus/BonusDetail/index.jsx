import {
  faCheck,
  faCopy,
  faEdit,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Tabs,
  Tab,
  Row,
  Col,
  Button,
  ButtonGroup,
  Badge,
  Form
} from '@themesberg/react-bootstrap'
import React from 'react'
import Trigger from '../../../../components/OverlayTrigger'
import Preloader from '../../../../components/Preloader'
import { convertAmountOptions } from '../components/CreateBonus/constants'
import useBonusDetail from '../components/hooks/useBonusDetail'
import GeneralDetails from './generalDetail'
import useCheckPermission from '../../../../utils/checkPermission'
import Games from '../components/CreateBonus/Games'
import LoyaltyPoint from '../../../../components/LoyaltyPoints/LoyaltyPoint'

const BonusDetail = () => {
  const {
    selectedTab,
    setSelectedTab,
    bonusDetail,
    loading,
    bonusId,
    navigate,
    pageNo,
    setPageNo,
    limit,
    setLimit,
    totalPages,
    gameIds,
    setGameIds,
    casinoGamesData,
    search,
    setSearch,
    selectedProvider,
    setSelectedProvider,
    gamesLimit,
    gamesPageNo,
    setGamesLimit,
    setGamesPageNo,
    wagerSearch,
    setWagerSearch,
    selectedLang,
    setSelectedLang
  } = useBonusDetail()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading && !bonusDetail && bonusDetail?.bonusId !== bonusId
        ? (
          <Preloader />
          )
        : (
          <>
            <Row>
              <Col className='d-flex'>
                <Col>
                  {' '}
                  <h3>Bonus Details</h3>
                </Col>
                <Col className='d-flex justify-content-end '>
                  <Row className='m-1 align-items-center'>
                    <Col>
                      <h3 className='h6 text-nowrap'>Language</h3>
                    </Col>
                    <Col>
                      <Form.Select
                        size='sm'
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                      >
                        <option value='EN'>EN</option>
                        {bonusDetail && bonusDetail?.promotionTitle &&
                        Object?.keys(bonusDetail?.promotionTitle)?.map(key => {
                          return (
                            key !== 'EN' && bonusDetail?.promotionTitle?.[key] && <option key={key} value={key}>{key}</option>
                          )
                        })}
                      </Form.Select>
                    </Col>
                  </Row>
                  <ButtonGroup>
                    <Trigger message='Edit'>
                      <Button
                        className='m-1'
                        size='sm'
                        variant='info'
                        disabled={bonusDetail?.claimedCount}
                        onClick={() =>
                          navigate(`/admin/edit-bonus/${bonusId}`)}
                        hidden={isHidden({ module: { key: 'Bonus', value: 'U' } })}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </Trigger>
                  </ButtonGroup>
                </Col>
              </Col>
            </Row>
            <Tabs
              key={selectedTab}
              activeKey={selectedTab}
              className='nav-light'
              onSelect={(k) => setSelectedTab(k)}
            >
              <Tab eventKey='general' title='General'>
                <div className='mt-5'>
                  <GeneralDetails bonusDetail={bonusDetail} selectedLang={selectedLang} />
                </div>
              </Tab>
              {bonusDetail?.bonusType !== 'joining' && (
                <Tab eventKey='currency' title='Currency'>
                  <div className='mt-5'>
                    <Row>
                      <h3>Currencies</h3>
                      {bonusDetail?.currency &&
                      Object.keys(bonusDetail.currency).length > 0 &&
                      Object.keys(bonusDetail.currency).map((key, index) => (
                        <Row key={index} className='g-2 mb-2'>
                          <Col sm={bonusDetail?.bonusType === 'freespins' && 5} className='d-flex '>
                            <Col className='px-1 text-center'>
                              {index < 1 && (
                                <label htmlFor='currency' style={{ fontSize: '14px' }}>Currency</label>
                              )}
                              <p>{key}</p>
                            </Col>
                            {Object.keys(bonusDetail.currency[key]).map(
                              (currKey, currIndex) => {
                                const hide = ((bonusDetail?.bonusType === 'deposit')
                                  ? (currKey === 'minBalance')
                                  : ((bonusDetail?.bonusType === 'freespins' || bonusDetail?.bonusType === 'cashfreespins'))
                                      ? ((false) ? (currKey !== 'maxWinAmount' && currKey !== 'zeroOutThreshold') : currKey !== 'maxWinAmount')
                                      : currKey === 'minBalance')
                                return (
                                  currKey !== 'minBonusThreshold' && <Col
                                    className='px-1 text-center'
                                    key={currIndex}
                                    hidden={hide}
                                                                     >
                                    {index < 1 && (
                                      <label htmlFor={currKey} style={{ fontSize: '14px' }}>
                                        {
                                          convertAmountOptions?.find(
                                            (val) => val.value === currKey
                                          )?.label
                                        }
                                      </label>
                                    )}

                                    <Form.Control
                                      value={bonusDetail.currency[key][currKey]}
                                      hidden={hide}
                                      disabled
                                    />
                                  </Col>
                                )
                              }
                            )}
                          </Col>
                        </Row>
                      ))}

                      <Col />
                    </Row>
                  </div>
                </Tab>
              )}

              {bonusDetail?.bonusType === 'joining' && (
                <Tab eventKey='currency' title='Currency'>
                  <div className='mt-5'>
                    <Row>
                      <h3>Currencies</h3>
                      {bonusDetail?.currency &&
                      Object.keys(bonusDetail.currency).length > 0 &&
                      Object.keys(bonusDetail.currency).map((key, index) => (
                        <Row key={index} className='g-2 mb-2'>
                          <Col sm={bonusDetail?.bonusType === 'freespins' && 5} className='d-flex '>
                            <Col className='px-1 text-center'>
                              {index < 1 && (
                                <label htmlFor='currency' style={{ fontSize: '14px' }}>Currency</label>
                              )}
                              <p>{key}</p>
                            </Col>
                            {Object.keys(bonusDetail.currency[key]).map(
                              (currKey, currIndex) => {
                                let newCurrKey = currKey;
                                let hide = ((bonusDetail?.bonusType === 'deposit')
                                  ? (currKey === 'minDeposit')
                                  : ((bonusDetail?.bonusType === 'freespins' || bonusDetail?.bonusType === 'cashfreespins'))
                                      ? ((bonusDetail?.isSticky === 'true' || bonusDetail?.isSticky) ? (currKey !== 'maxWinAmount' && currKey !== 'zeroOutThreshold') : currKey !== 'maxWinAmount')
                                      : currKey === 'minBalance')
                                if(bonusDetail?.bonusType === 'joining' && currKey === 'maxWinAmount') hide = false
                                else hide = true
                                if(bonusDetail?.bonusType === 'joining') newCurrKey = 'amount'
                                return (
                                  currKey !== 'minBonusThreshold' && <Col
                                    className='px-1 text-center'
                                    key={currIndex}
                                    hidden={hide}
                                                                     >
                                    {index < 1 && (
                                      <label htmlFor={newCurrKey} style={{ fontSize: '14px' }}>
                                        {
                                          convertAmountOptions?.find(
                                            (val) => val.value === newCurrKey
                                          )?.label
                                        }
                                      </label>
                                    )}

                                    <Form.Control
                                      value={bonusDetail.currency[key][currKey]}
                                      hidden={hide}
                                      disabled
                                    />
                                  </Col>
                                )
                              }
                            )}
                          </Col>
                        </Row>
                      ))}

                      <Col />
                    </Row>
                  </div>
                </Tab>
              )}

              {bonusDetail?.bonusType === 'freespins' && (
                <Tab
                  eventKey='games'
                  title='Games'
                >
                  <div className='mt-5'>
                    <Games
                      gameIds={gameIds}
                      setGameIds={setGameIds}
                      setLimit={setGamesLimit}
                      setPageNo={setGamesPageNo}
                      setSearch={setSearch}
                      search={search}
                      totalPages={totalPages}
                      limit={gamesLimit}
                      pageNo={gamesPageNo}
                      loading={loading}
                      casinoGamesData={casinoGamesData}
                      selectedProvider={selectedProvider}
                      setSelectedProvider={setSelectedProvider}
                      setSelectedTab={setSelectedTab}
                      details
                    />
                  </div>
                </Tab>
              )}
            </Tabs>
          </>
          )}
    </>
  )
}
export default BonusDetail
