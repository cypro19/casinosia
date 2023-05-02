import React from 'react'
import {
  Button,
  Row,
  Col,
  Table
} from '@themesberg/react-bootstrap'
import PaginationComponent from '../../../components/Pagination'
import useThemesListing from './hooks/useThemesListing'
import Trigger from '../../../components/OverlayTrigger'
import Preloader from '../../../components/Preloader'
import useCheckPermission from '../../../utils/checkPermission'

const Themes = () => {
  const {
    navigate,
    page,
    setPage,
    data,
    totalPages,
    getThemeById,
    limit,
    setLimit,
    loading
  } = useThemesListing()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col sm={8}>
                <h3>Themes</h3>
              </Col>

              <Col>
                <div className='text-right mb-2'>
                  <Button
                    variant='outline-success'
                    size='sm'
                    className='f-right'
                    onClick={() => {
                      navigate('/admin/create-theme')
                    }}
                    hidden={isHidden({ module: { key: 'Themes', value: 'C' } })}
                  >
                    Create
                  </Button>
                </div>
              </Col>
            </Row>

            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
              <thead className='thead-dark'>
                <tr>
                  <th>
                    <b>Id</b>
                  </th>
                  <th>
                    <b>Name</b>
                  </th>
                  {!isHidden({ module: { key: 'Themes', value: 'U' } }) &&
                    <th>
                      <b>Action</b>
                    </th>}
                </tr>
              </thead>

              <tbody>
                {Boolean(data) &&
                      data?.rows?.map(({ themeId, themeName }) => {
                        return (
                          <tr key={themeId}>
                            <td>{themeId}</td>
                            <td>
                              <Trigger message={themeName}>
                                <span
                                  style={{
                                    width: '100px',
                                    cursor: 'pointer'
                                  }}
                                  className='d-inline-block text-truncate'
                                >
                                  {themeName}
                                </span>
                              </Trigger>
                            </td>
                            {!isHidden({ module: { key: 'Themes', value: 'U' } }) &&
                              <td>
                                <Button
                                  variant='warning'
                                  className='f-right'
                                  size='sm'
                                  onClick={() => {
                                    const selData = getThemeById(themeId)
                                    navigate(
                                    `/admin/edit-theme/${themeId}`,
                                    {
                                      state: selData
                                    }
                                    )
                                  }}
                                  hidden={isHidden({ module: { key: 'Themes', value: 'U' } })}
                                >
                                  Edit
                                </Button>
                              </td>}
                          </tr>
                        )
                      })}

                {data?.count === 0 &&
                      (
                        <tr>
                          <td
                            colSpan={3}
                            className='text-danger text-center'
                          >
                            No data found
                          </td>
                        </tr>
                      )}
              </tbody>
            </Table>

            {data?.count !== 0 &&
              (
                <PaginationComponent
                  page={data?.count < page ? setPage(1) : page}
                  totalPages={totalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              )}
          </>
          )}
    </>
  )
}

export default Themes
