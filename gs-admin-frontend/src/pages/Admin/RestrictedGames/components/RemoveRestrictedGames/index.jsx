import React from 'react'
import { Button, Row, Col, Form } from '@themesberg/react-bootstrap'

import GamesList from '../GamesList'

const RemoveRestrictedGames = ({
  restrictedItems,
  limit,
  page,
  setLimit,
  setPage,
  totalPages,
  addDeleteGame,
  removedGames,
  removeDeleteGame,
  removeRestrictedGame
}) => {
  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Label>
            <h5>Games you remove will appear here</h5>
          </Form.Label>
        </Col>

        <Col className='text-right'>
          <Button
            variant='success'
            className='f-right'
            disabled={removedGames.count === 0}
            onClick={removeRestrictedGame}
          >
            Submit
          </Button>
        </Col>
      </Row>

      <GamesList
        disablePagination
        games={removedGames}
        hasActions
        hasRemoveGamesAction
        removeGame={removeDeleteGame}
      />

      <Row className='mt-3'>
        <Col xs={4}>
          <Form.Label>
            <h5>Restricted Games</h5>
          </Form.Label>
        </Col>
      </Row>

      <GamesList
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        games={restrictedItems}
        totalPages={totalPages}
        hasActions
        hasAddGamesAction
        addGame={addDeleteGame}
      />
    </>
  )
}

export default RemoveRestrictedGames
