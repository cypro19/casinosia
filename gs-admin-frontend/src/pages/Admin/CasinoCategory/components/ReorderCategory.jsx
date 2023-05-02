import React from 'react'
import {
  Button,
  Row,
  Col
} from '@themesberg/react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import useReorderCategories from '../hooks/useReorderCategories'
import Preloader from '../../../../components/Preloader'

export default () => {
  const {
    loading,
    state, onDragEnd, handleSave
  } = useReorderCategories()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col sm={8}>
                <h3>Casino Categories Reorder</h3>
              </Col>

              <Col>
                <div className='text-right mb-3'>
                  <Button
                    variant='success'
                    onClick={() => handleSave()}
                  >
                    Save
                  </Button>
                </div>
              </Col>
            </Row>

            <div className='reorder-heading'>
              {[
                'ID',
                'Name',
                'Status'
              ].map((h) => (
                <p key={h}>{h}</p>
              ))}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='list'>
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {/* <QuoteList quotes={state.quotes} /> */}
                    {state.count > 0 &&
                    state?.rows?.map(
                      ({

                        name,
                        masterGameCategoryId,
                        isActive

                      }, idx) => (
                        <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                          {provided => (
                            <div
                              className='reorder-content'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <p>{masterGameCategoryId}</p>
                              <p>
                                {name?.EN}
                              </p>

                              <p>
                                {isActive
                                  ? (
                                    <span className='text-success'>Active</span>
                                    )
                                  : (
                                    <span className='text-danger'>In Active</span>
                                    )}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {state.count === 0
              ? <p className='text-danger text-center'>No data found</p>
              : null}
          </>
          )}
    </>
  )
}
