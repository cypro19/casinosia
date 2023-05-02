import React from 'react'
import { Button, Row, Col, Form } from '@themesberg/react-bootstrap'

import ProvidersList from '../ProvidersList'

const RemoveRestrictedGames = ({
  restrictedItems,
  limit,
  page,
  setLimit,
  setPage,
  totalPages,
  addDeleteProvider,
  removedProviders,
  removeDeleteProvider,
  removeRestrictedProvider
}) => {
  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Label>
            <h5>Providers you remove will appear here</h5>
          </Form.Label>
        </Col>

        <Col className='text-right'>
          <Button
            variant='success'
            className='f-right'
            disabled={removedProviders.count === 0}
            onClick={removeRestrictedProvider}
          >
            Submit
          </Button>
        </Col>
      </Row>

      <ProvidersList
        disablePagination
        provider={removedProviders}
        hasActions
        hasRemoveGamesAction
        removeProvider={removeDeleteProvider}
      />

      <Row className='mt-3'>
        <Col xs={4}>
          <Form.Label>
            <h5>Restricted Providers</h5>
          </Form.Label>
        </Col>
      </Row>

      <ProvidersList
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        provider={restrictedItems}
        totalPages={totalPages}
        hasActions
        hasAddGamesAction
        addProvider={addDeleteProvider}
      />
    </>
  )
}

export default RemoveRestrictedGames
