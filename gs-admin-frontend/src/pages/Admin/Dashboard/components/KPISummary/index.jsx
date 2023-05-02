import React from 'react'
import { Row, Col, Button } from '@themesberg/react-bootstrap'
import { SpinnerLoader } from '../../../../../components/Preloader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { DateRangePickerWithoutInput } from '../../../../../components/DateRangePicker'
import useKPISummary from '../../hooks/useKPISummary'
import { downloadFile } from '../../../../../utils/fileDownloader'
import KPISummaryTable from '../../../../../components/KPISummaryTable'

export default () => {
  const {
    loadKPISummary,
    loading,
    setState,
    state,
    getCsvDownloadUrl,
    KPISummary
  } = useKPISummary()

  return (
    <>
      <Row>
        <Col>
          <h3 className='d-flex'>KPI Summary {loading ? <SpinnerLoader /> : <FontAwesomeIcon onClick={() => loadKPISummary()} style={{ fontSize: '18px', color: 'gray', cursor: 'pointer', marginTop: '10px', marginLeft: '10px' }} icon={faRedo} />}</h3>
        </Col>

        <Col xs='auto'>
          <div className='d-flex justify-content-end align-items-center'>
            <DateRangePickerWithoutInput
              state={state} setState={setState}
            />

            <Button
              variant='success'
              size='sm'
              style={{ width: '150px' }}
              disabled={KPISummary?.length < 1}
              onClick={() => { downloadFile(getCsvDownloadUrl()) }}
            >
              Export Details
            </Button>
          </div>
        </Col>

      </Row>

      <KPISummaryTable KPISummary={KPISummary} />
    </>

  )
}
