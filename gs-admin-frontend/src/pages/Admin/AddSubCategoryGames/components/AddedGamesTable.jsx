import React from 'react'
import {
  Button,
  Col,
  Table,
  ButtonGroup,
  Form
} from '@themesberg/react-bootstrap'

import Trigger from '../../../../components/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMinusSquare
} from '@fortawesome/free-solid-svg-icons'

const AddedGamesTable = ({ selectedGames, removeGame }) => {
  return (
    <>
      <Col xs={4}>
        <Form.Label>
          <h5>Games you add will appear here</h5>
        </Form.Label>
      </Col>

      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {[
              'Id',
              'Name',
              'Actions'
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {selectedGames?.length > 0 &&
                    selectedGames.map(
                      ({
                        masterCasinoGameId,
                        name
                      }) => {
                        return (
                          <tr key={masterCasinoGameId}>

                            <td>{masterCasinoGameId}</td>

                            <td>
                              <Trigger message={name}>
                                <span
                                  style={{
                                    width: '300px',
                                    cursor: 'pointer'
                                  }}
                                  className='d-inline-block text-truncate'
                                >
                                  {name}
                                </span>
                              </Trigger>
                            </td>

                            <td>
                              <ButtonGroup>
                                <Trigger message='Remove this Game'>
                                  <Button
                                    className='m-1'
                                    size='sm'
                                    variant='danger'
                                    onClick={() => removeGame(masterCasinoGameId)}
                                  >
                                    <FontAwesomeIcon icon={faMinusSquare} />
                                  </Button>
                                </Trigger>
                              </ButtonGroup>
                            </td>
                          </tr>
                        )
                      }
                    )}

          {selectedGames?.length === 0 &&
                      (
                        <tr>
                          <td
                            colSpan={3}
                            className='text-danger text-center'
                          >
                            Add Games to view
                          </td>
                        </tr>
                      )}
        </tbody>
      </Table>
    </>
  )
}

export default AddedGamesTable
