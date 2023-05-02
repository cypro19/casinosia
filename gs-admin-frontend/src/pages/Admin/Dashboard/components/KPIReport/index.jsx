import React from 'react'
import { Row, Col, Button, Form, Tabs, Tab } from '@themesberg/react-bootstrap'
import { SpinnerLoader } from '../../../../../components/Preloader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { DateRangePickerWithoutInput } from '../../../../../components/DateRangePicker'
import useKPIReport from '../../hooks/useKPIReport'
import { downloadFile } from '../../../../../utils/fileDownloader'
import KPIReportTable from '../../../../../components/KPIReportTable'
import DateOptionsFilter from '../../../../../components/DateOptionsFilter'

export default () => {
  const {
    loadKPIReport,
    loading,
    setState,
    state,
    getCsvDownloadUrl,
    KPIReport,
    dateOptions,
    setDateOptions,
    selectedTab, setSelectedTab
  } = useKPIReport()

  return (
    <>
      <Row>
        <Col>
          <h3 className='d-flex'>KPI Report {loading ? <SpinnerLoader /> : <FontAwesomeIcon onClick={() => loadKPIReport()} style={{ fontSize: '18px', color: 'gray', cursor: 'pointer', marginTop: '10px', marginLeft: '10px' }} icon={faRedo} />}</h3>
        </Col>

        <Col xs='auto'>
          <div className='d-flex justify-content-end align-items-center'>
            {dateOptions === 'custom' &&
              <DateRangePickerWithoutInput
                state={state} setState={setState}
              />}

            <Form.Label style={{ marginLeft: '20px', marginTop: '5px', marginRight: '10px' }}>
              Date Options
            </Form.Label>
            <DateOptionsFilter dateOptions={dateOptions} setDateOptions={setDateOptions} />

            <Button
              variant='success'
              size='sm'
              style={{ width: '150px' }}
              disabled={!KPIReport || Object.keys(KPIReport) < 1}
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
              <KPIReportTable KPIReport={KPIReport || []} />
            </Row>
          </div>
        </Tab>

        <Tab eventKey='provider' title='PROVIDER'>
          <div className='mt-2'>
            <Row className='mt-3 d-flex flex-row-reverse text-right'>
              <KPIReportTable KPIReport={KPIReport || []} />
            </Row>
          </div>
        </Tab>
      </Tabs>
    </>

  )
}
