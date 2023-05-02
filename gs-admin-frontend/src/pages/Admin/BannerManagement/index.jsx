import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, Button, Col, Row, Table } from '@themesberg/react-bootstrap'
import React from 'react'
import Preloader from '../../../components/Preloader'
import EditUploadBanner from './EditUploadBanner'
import useBannerManagement from './useBannerManagement'
import Trigger from '../../../components/OverlayTrigger'
import { bannerType } from './constants'

export default () => {
  const {
    loading,
    handleCreateEdit,
    type,
    data,
    setShow,
    show,
    createUpdate,
    dispatch,
    SABanners
  } = useBannerManagement()

  return (
    <>
      {
        loading
          ? <Preloader />
          : (
            <>
              <Row>
                <Col>
                  <h3>Banner Management</h3>
                </Col>

                <Col xs='auto'>
                  <div className='d-flex justify-content-end align-items-center'>
                    <Button
                      variant='success'
                      size='sm'
                      onClick={() => handleCreateEdit('Create', {})}
                    >
                      Upload
                    </Button>
                  </div>
                </Col>
              </Row>

              <Accordion>
                    <Accordion.Item
                    >
                      <Accordion.Body>
                        <Table bordered striped responsive hover size='sm' className='text-center mt-2'>
                          <thead className='thead-dark'>
                            <tr>
                              {['Pages', 'Banner Preview', 'Action'].map((h) => (
                                <th key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {SABanners && Object.keys(SABanners)?.map((key, indx) => {
                              return (
                                <tr key={indx}>
                                  <td>{bannerType?.map((item) => {
                                    if (key === item?.value) {
                                      return item?.label
                                    }
                                    return null
                                  })}
                                  </td>
                                  <td>
                                    <span
                                      style={{
                                        cursor: 'pointer'
                                      }}
                                      className='text-link'
                                      onClick={() => window.open(SABanners[key])}
                                    >
                                      Banner Preview
                                    </span>
                                  </td>
                                  <td>
                                    <Trigger message='Update Banner'>
                                      <Button
                                        size='sm'
                                        variant='warning'
                                        onClick={() => {
                                          handleCreateEdit('Update',
                                            {
                                              thumbnail: SABanners[key],
                                              bannerType: key
                                            })
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                      </Button>
                                    </Trigger>
                                  </td>
                                </tr>
                              )
                            })}

                            {(!SABanners || SABanners?.length === 0) && (
                              <tr>
                                <td colSpan={4} className='text-danger text-center'>
                                  No data found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
              </Accordion>

              {SABanners?.length === 0 && <div className='text-center text-danger mt-5'>No Data Found</div>}

            </>
            )
     }
      <EditUploadBanner
        type={type}
        data={data}
        show={show}
        setShow={setShow}
        createUpdate={createUpdate}
        dispatch={dispatch}
        SABanners={SABanners}
      />
    </>
  )
}
