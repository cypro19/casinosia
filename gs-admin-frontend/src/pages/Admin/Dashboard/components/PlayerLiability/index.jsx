import React from 'react'
import { Row, Col, Button, Form } from '@themesberg/react-bootstrap'
import { SpinnerLoader } from '../../../../../components/Preloader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { DateRangePickerWithoutInput } from '../../../../../components/DateRangePicker'
import usePlayerLiability from '../../hooks/usePlayerLiability'
import { downloadFile } from '../../../../../utils/fileDownloader'
import PortalLiabilityTable from '../../../../../components/PortalLiabilityTable'
import DateOptionsFilter from '../../../../../components/DateOptionsFilter'

export default () => {
  const {
    loadPlayerLiabilities,
    loading,
    setState,
    state,
    getCsvDownloadUrl,
    playerLiabilityData,
    dateOptions,
    setDateOptions
  } = usePlayerLiability()

  return (
    <>
      <Row>
        <Col>
          <h3 className='d-flex'>Player Liability {loading ? <SpinnerLoader /> : <FontAwesomeIcon onClick={() => loadPlayerLiabilities()} style={{ fontSize: '18px', color: 'gray', cursor: 'pointer', marginTop: '10px', marginLeft: '10px' }} icon={faRedo} />}</h3>
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
              disabled={playerLiabilityData?.length < 1}
              onClick={() => { downloadFile(getCsvDownloadUrl()) }}
            >
              Export Details
            </Button>
          </div>
        </Col>

      </Row>

      <PortalLiabilityTable playerLiabilityData={playerLiabilityData} />
    </>

  )
}
