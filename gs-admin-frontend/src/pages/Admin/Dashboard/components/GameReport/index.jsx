import React from 'react'
import { Row, Col, Tabs, Tab, Form, Button } from '@themesberg/react-bootstrap'
import { SpinnerLoader } from '../../../../../components/Preloader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { DateRangePickerWithoutInput } from '../../../../../components/DateRangePicker'
import useGameReport from '../../hooks/useGameReport'
import DateOptionsFilter from '../../../../../components/DateOptionsFilter'
import GameReportTable from '../../../../../components/GameReportTable'
import { downloadFile } from '../../../../../utils/fileDownloader'

export default () => {
  const {
    fetchDetails,
    setState, state, loading, selectedTab, setSelectedTab, gameReport,
    setDateOptions,
    dateOptions,
    getCsvDownloadUrl
  } = useGameReport()

  return (
    <>
      <Row>
        <Col>
          <h3 className='d-flex'>Game Report  {loading ? <SpinnerLoader /> : <FontAwesomeIcon onClick={() => fetchDetails()} style={{ fontSize: '18px', color: 'gray', cursor: 'pointer', marginTop: '10px', marginLeft: '10px' }} icon={faRedo} />}</h3>
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
            <Button
              variant='success'
              size='sm'
              style={{ width: '150px' }}
              disabled={gameReport?.length < 1}
              onClick={() => { downloadFile(getCsvDownloadUrl()) }}
            >
              Export Details
            </Button>
          </div>
        </Col>

      </Row>

      <Tabs
        activeKey={selectedTab}
        onSelect={(tab) => setSelectedTab(tab)}
        className='nav-light dashboard'
      >
        <Tab eventKey='game' title='GAME'>
          <div className='mt-2'>
            <Row className='mt-3 d-flex flex-row-reverse text-right'>
              <GameReportTable tableData={gameReport || []} />
            </Row>
          </div>
        </Tab>

        <Tab eventKey='provider' title='PROVIDER'>
          <div className='mt-2'>
            <Row className='mt-3 d-flex flex-row-reverse text-right'>
              <GameReportTable tableData={gameReport || []} />
            </Row>
          </div>
        </Tab>
      </Tabs>

    </>

  )
}
