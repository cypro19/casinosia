import React from 'react'
import { Button, Row, Col, Form } from '@themesberg/react-bootstrap'
import useDemographicReport from '../../hooks/useDemographicReport'
import { SpinnerLoader } from '../../../../../components/Preloader'
import DemographicWithMap from '../../../../../components/DemographicWIthMap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { DateRangePickerWithoutInput } from '../../../../../components/DateRangePicker'
import { downloadFile } from '../../../../../utils/fileDownloader'
import DateOptionsFilter from '../../../../../components/DateOptionsFilter'

export default ({ selectedPortal, selectedClient }) => {
  const {
    options, demogData, formatedData, loadDemogData,
    setState, state, getCsvDownloadUrl, loading, dateOptions, setDateOptions
  } = useDemographicReport({ selectedPortal, selectedClient })


  const MemoizedDemographicWithMap = React.memo(DemographicWithMap)

  return (
    <>
      <Row>
        <Col>
          <h3 className='d-flex'>Demographic Report {loading ? <SpinnerLoader /> : <FontAwesomeIcon onClick={() => loadDemogData()} style={{ fontSize: '18px', color: 'gray', cursor: 'pointer', marginTop: '10px', marginLeft: '10px' }} icon={faRedo} />}</h3>
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
              variant='outline-success'
              size='sm'
              style={{ width: '150px' }}
              disabled={demogData?.length < 1}
              onClick={() => { downloadFile(getCsvDownloadUrl()) }}
            >
              Export Details
            </Button>
          </div>
        </Col>

      </Row>
      <MemoizedDemographicWithMap
        options={options}
        demogData={demogData}
        formatedData={formatedData}
      />

    </>

  )
}
