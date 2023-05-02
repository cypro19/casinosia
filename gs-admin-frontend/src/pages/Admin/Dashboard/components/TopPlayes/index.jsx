import React from 'react'
import { Row, Col, Tabs, Tab, Form } from '@themesberg/react-bootstrap'
import { SpinnerLoader } from '../../../../../components/Preloader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { DateRangePickerWithoutInput } from '../../../../../components/DateRangePicker'
import useTopPlayers from '../../hooks/useTopPlayers'
import Winners from '../../../../../components/TopPlayers/Winners'
import Loosers from '../../../../../components/TopPlayers/Loosers'
import Depositors from '../../../../../components/TopPlayers/Depositors'
import DateOptionsFilter from '../../../../../components/DateOptionsFilter'

export default () => {
  const {
    fetchDetails,
    setState, state, loading, selectedTab, setSelectedTab, playerData, limit,
    setLimit,
    setDateOptions,
    dateOptions
  } = useTopPlayers()

  return (
    <>
      <Row>
        <Col>
          <h3 className='d-flex'>Player Statistics  {loading ? <SpinnerLoader /> : <FontAwesomeIcon onClick={() => fetchDetails()} style={{ fontSize: '18px', color: 'gray', cursor: 'pointer', marginTop: '10px', marginLeft: '10px' }} icon={faRedo} />}</h3>
        </Col>

        <Col xs='auto'>
          <div className='d-flex justify-content-end align-items-center'>
            {dateOptions === 'custom' &&
              <DateRangePickerWithoutInput
                state={state} setState={setState}
              />}

            <Form.Label style={{ width: '100px', marginLeft: '20px', marginTop: '5px', marginRight: '10px' }}>
              Date Options
            </Form.Label>
            <DateOptionsFilter dateOptions={dateOptions} setDateOptions={setDateOptions} />

            <Form.Label style={{ marginLeft: '20px', marginTop: '5px', marginRight: '10px' }}>
              Limit
            </Form.Label>
            <Form.Select
              onChange={(e) => setLimit(e.target.value)}
              value={limit}
              style={{ maxWidth: '65px', marginRight: '10px' }}
              size='sm'
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
              <option value='20'>20</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
            </Form.Select>
          </div>
        </Col>

      </Row>

      <Tabs
        activeKey={selectedTab}
        onSelect={(tab) => setSelectedTab(tab)}
        className='nav-light dashboard'
      >
        <Tab eventKey='winners' title={`TOP ${limit} WINNERS`}>
          <div className='mt-2'>
            <Row className='mt-3 d-flex flex-row-reverse text-right'>
              <Winners tableData={playerData?.topTenWinners || []} />
            </Row>
          </div>
        </Tab>

        <Tab eventKey='loosers' title={`TOP ${limit} LOOSERS`}>
          <div className='mt-2'>
            <Row className='mt-3 d-flex flex-row-reverse text-right'>
              <Loosers tableData={playerData?.topTenLosers || []} />
            </Row>
          </div>
        </Tab>

        <Tab eventKey='depositors' title={`TOP ${limit} DEPOSITORS`}>
          <div className='mt-2'>
            <Row className='mt-3 d-flex flex-row-reverse text-right'>
              <Depositors tableData={playerData?.topTenDepositors || []} />
            </Row>
          </div>
        </Tab>
      </Tabs>

    </>

  )
}
