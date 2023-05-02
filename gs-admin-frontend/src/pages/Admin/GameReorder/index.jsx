import React from 'react'
import {
  Button,
  Row,
  Col,
  Table,
  Form,
  Card
} from '@themesberg/react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './GameReorder.scss'
import useGameReorder from './hooks/useGameReorder'
import PaginationComponent from '../../../components/Pagination'
import Preloader from '../../../components/Preloader'
import { toast } from '../../../components/Toast'

export default () => {
  const {
    loading,
    reOrderedGame,
    onDragEnd,
    handleSave,
    navigate,
    casinoGames,
    handRemoveGame,
    handleAddGame,
    casinoCategories,
    categoryFilter,
    setCategoryFilter,
    totalPages,
    setLimit,
    setPage,
    limit,
    page,
    setCasinoCategoryId,
    subCategories,
    casinoCategoryId,
    setReorderedGame
  } = useGameReorder()
  return (
    <>
      {loading && <Preloader />}
      <Row>
        <Col sm={8}>
          <h3>Game Reorder</h3>
        </Col>
        <Col>
          <div className='text-right mb-3'>
            <Button
              variant='success mt-1'
              size='sm'
              onClick={() => handleSave()}
              disabled={reOrderedGame?.count === 0}
            >
              Update
            </Button>
          </div>
        </Col>
      </Row>
      <div className='game-reordering-container'>
        <Card className='p-2 game-reordering-subcontainer'>
          <Row>
            <Col>
              <div className='d-flex justify-content-start align-items-center w-100'>
                <Form.Label style={{ marginBottom: '0', marginRight: '15px' }}>
                  Category
                </Form.Label>

                <Form.Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  size='sm'
                  style={{ maxWidth: '230px' }}
                >
                  <option value=''>Select Category</option>
                  {casinoCategories && casinoCategories?.rows?.map((c) => (
                    <option key={c?.masterGameCategoryId} value={c?.masterGameCategoryId}>{c?.name.EN}</option>
                  ))}
                </Form.Select>

                {categoryFilter &&
                  <>
                    <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginLeft: '15px' }}>
                      Sub Category
                    </Form.Label>
                    <Form.Select
                      style={{ marginBottom: '0', marginRight: '15px', maxWidth: '230px' }}
                      // value={casinoCategoryId}
                      size='sm'
                      onChange={(e) => {
                        setCasinoCategoryId(e.target.value)
                        if (reOrderedGame.rows) {
                          // toast(e.response.data.message, 'error')
                          setReorderedGame({ rows: [], count: 0 })
                        }
                      }}
                    >
                      <option value=''>All</option>

                      {subCategories && subCategories?.rows?.map((c) => (
                        <option key={c?.masterGameSubCategoryId} value={c?.masterGameSubCategoryId}>{c?.name?.EN}</option>
                      ))}
                    </Form.Select>
                  </>}

              </div>
            </Col>
          </Row>
          <div style={{ overflow: 'auto' }}>
            {casinoCategoryId
              ? (
                <>
                  <Table bordered striped hover size='sm' className='text-center mt-4'>
                    <thead className='thead-dark'>
                      <tr>
                        <th>Order ID</th>
                        <th>Game Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {casinoGames?.rows?.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td className='text-left'>{idx + 1}</td>
                            <td>{item.name}</td>
                            <td>
                              <Button
                                className='m-1'
                                size='sm'
                                variant='success'
                                onClick={() => handleAddGame(item)}
                              >+
                              </Button>
                            </td>
                          </tr>
                        )
                      })}

                      {casinoGames?.count === 0 && (
                        <tr><td className='text-danger' colSpan={10}>No Data Found.</td></tr>
                      )}
                    </tbody>

                  </Table>
                  {/* {casinoGames?.count !== 0 &&
                    <PaginationComponent
                      page={casinoGames?.count < page ? setPage(1) : page}
                      totalPages={totalPages}
                      setPage={setPage}
                      limit={limit}
                      setLimit={setLimit}
                    />} */}
                </>
                )
              : <p className='text-danger text-center mt-7'> Select Category & Sub Category First </p>}
          </div>
        </Card>
        <Card className='p-2 game-reordering-subcontainer'>
          {reOrderedGame?.count !== 0
            ? <div className='game-reorder'>
              <div className='game-reorder-heading'>
                {[
                  'ID',
                  'Game Name',
                  'Action'
                ].map((h, idx) => (
                  <p className={`game-heading-${idx}`} key={h}>{h}</p>
                ))}
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='list'>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {/* <QuoteList quotes={state.quotes} /> */}
                      {reOrderedGame?.rows?.map(
                        (item, idx) => (
                          <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                            {provided => (
                              <div
                                className='game-reorder-content'
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <p className='game-id'>{idx + 1}</p>
                                <p className='game-name'>{item.name}</p>
                                <Button
                                  className='m-1 game-button'
                                  size='sm'
                                  variant='danger'
                                  onClick={() => handRemoveGame(item)}
                                >X
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            : <p className='text-danger text-center mt-7'>Game Not Selected</p>}
        </Card>

      </div>

    </>
  )
}
