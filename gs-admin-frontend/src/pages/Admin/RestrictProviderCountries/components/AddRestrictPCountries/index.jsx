import React from 'react'
import { Button, Row, Col, Form } from '@themesberg/react-bootstrap'

import CountriesList from '../CountriesList'

const AddRestrictPCountries = ({
  unRestrictedCountries,
  limit,
  page,
  setLimit,
  setPage,
  totalPages,
  addCountries,
  selectedCountries,
  removeCountries,
  addRestrictedCountries
}) => {
  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Label>
            <h5>Countries you add will appear here</h5>
          </Form.Label>
        </Col>

        <Col className='text-right'>
          <Button
            variant='success'
            className='f-right'
            disabled={selectedCountries.count === 0}
            onClick={addRestrictedCountries}
          >
            Submit
          </Button>
        </Col>
      </Row>

      <CountriesList
        disablePagination
        countries={selectedCountries}
        hasActions
        hasRemoveGamesAction
        removeCountries={removeCountries}
      />

      <Row className='mt-3'>
        <Col xs={4}>
          <Form.Label>
            <h5>Unrestricted Countries</h5>
          </Form.Label>
        </Col>
      </Row>

      <CountriesList
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        countries={unRestrictedCountries}
        totalPages={totalPages}
        hasActions
        hasAddGamesAction
        addCountries={addCountries}
      />
    </>
  )
}

export default AddRestrictPCountries
