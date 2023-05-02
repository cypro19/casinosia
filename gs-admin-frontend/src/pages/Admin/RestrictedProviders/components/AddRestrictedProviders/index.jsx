import React from 'react'
import { Button, Row, Col, Form } from '@themesberg/react-bootstrap'

import ProvidersList from '../ProvidersList'

const AddRestrictedProviders = ({
  unRestrictedItems,
  limit,
  page,
  setLimit,
  setPage,
  totalPages,
  addProvider,
  selectedProviders,
  removeProvider,
  addRestrictedProvider
}) => {
  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Label>
            <h5>Providers you add will appear here</h5>
          </Form.Label>
        </Col>

        <Col className='text-right'>
          <Button
            variant='success'
            className='f-right'
            disabled={selectedProviders.count === 0}
            onClick={addRestrictedProvider}
          >
            Submit
          </Button>
        </Col>
      </Row>

      <ProvidersList
        disablePagination
        provider={selectedProviders}
        hasActions
        hasRemoveGamesAction
        removeProvider={removeProvider}
      />

      <Row className='mt-3'>
        <Col xs={4}>
          <Form.Label>
            <h5>Unrestricted Providers</h5>
          </Form.Label>
        </Col>
      </Row>

      <ProvidersList
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        provider={unRestrictedItems}
        totalPages={totalPages}
        hasActions
        hasAddGamesAction
        addProvider={addProvider}
      />
    </>
  )
}

export default AddRestrictedProviders
