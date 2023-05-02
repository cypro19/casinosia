import React from 'react'
import {
  Button,
  Row,
  Col,
  Form
} from '@themesberg/react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import useReorderSubCategories from '../hooks/useReorderSubCategories'
import Preloader from '../../../../components/Preloader'

export default () => {
  const {
    loading,
    state, onDragEnd, handleSave, casinoCategories, categoryFilter, setCategoryFilter
  } = useReorderSubCategories()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col sm={8}>
                <h3>Casino SubCategories Reorder</h3>
              </Col>

              <Col>
                <div className='d-flex justify-content-end align-items-center w-100'>
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
                      <option key={c?.masterGameCategoryId} value={c?.masterGameCategoryId}>{c?.name?.EN}</option>
                    ))}
                  </Form.Select>
                </div>
              </Col>

            </Row>

            {categoryFilter
              ? (
                <>
                  <div>
                    <div className='text-right'>
                      <Button
                        variant='success'
                        className='f-right'
                        style={{ marginRight: '10px' }}
                        onClick={() => handleSave()}
                      >
                        Save
                      </Button>
                    </div>

                    <div className='reorder-heading'>
                      {[
                        'ID',
                        'Name',
                        'Status',
                        'Category Name'
                      ].map((h) => (
                        <p key={h}>{h}</p>
                      ))}
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId='list'>
                        {provided => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {state.count > 0 &&
                    state?.rows?.map(
                      ({
                        name,
                        MasterGameCategory: { name: categoryName },
                        isActive,
                        masterGameSubCategoryId,
                        iconColor,
                        iconName
                      }, idx) => {
                        return(
                        <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                          {provided => (
                            <div
                              className='reorder-content'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <p>{masterGameSubCategoryId}</p>
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
                              <p>
                                {categoryName?.EN}
                              </p>

                            </div>
                          )}
                        </Draggable>
                      )})}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                  </div>
                  {state.count === 0 &&
                    <div className='text-danger text-center'>No data found</div>}
                </>
                )
              : <p className='text-center mt-7'> Select Category First </p>}
          </>
          )}
    </>
  )
}
