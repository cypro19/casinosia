import React from 'react'
import { Button, Row, Col, Form } from '@themesberg/react-bootstrap'

import GamesList from '../GamesList'

const AddRestrictedGames = ({
  unRestrictedItems,
  limit,
  page,
  setLimit,
  setPage,
  totalPages,
  addGame,
  selectedGames,
  removeGame,
  addRestrictedGames
}) => {
  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Label>
            <h5>Games you add will appear here</h5>
          </Form.Label>
        </Col>

        <Col className='text-right'>
          <Button
            variant='success'
            className='f-right'
            disabled={selectedGames.count === 0}
            onClick={addRestrictedGames}
          >
            Submit
          </Button>
        </Col>
      </Row>

      <GamesList
        disablePagination
        games={selectedGames}
        hasActions
        hasRemoveGamesAction
        removeGame={removeGame}
      />

      <Row className='mt-3'>
        <Col xs={4}>
          <Form.Label>
            <h5>Unrestricted Games</h5>
          </Form.Label>
        </Col>
      </Row>

      <GamesList
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        games={unRestrictedItems}
        totalPages={totalPages}
        hasActions
        hasAddGamesAction
        addGame={addGame}
      />
    </>
  )
}

export default AddRestrictedGames
