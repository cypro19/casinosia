import { Button, ButtonGroup, Table } from '@themesberg/react-bootstrap'
import React from 'react'
import { tableHeaders } from './constants'
import { getDateTime } from '../../utils/dateFormatter'
import Trigger from '../OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowCircleUp,
  faCheckSquare,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons'
// import { useSelector } from 'react-redux'
import useCheckPermission from '../../utils/checkPermission'

const UserDocsList = ({
  userDocuments,
  documentLabels,
  updateDocument,
  handleVerify,
  docLabels,
  handleReRequest,
  handleImagePreview
}) => {
  // const { userData } = useSelector((state) => state.fetch)
  const { isHidden } = useCheckPermission()

  return (
    <>
      <Table
        bordered
        striped
        responsive
        hover
        size='sm'
        className='text-center mt-4'
      >
        <thead className='thead-dark'>
          <tr>
            {tableHeaders.map((c) =>
              (
                  <th key={c}>{c}</th>
                  )
            )}
          </tr>
        </thead>

        <tbody>
          {userDocuments &&
            userDocuments?.map(
              ({
                userDocumentId,
                documentUrl,
                documentName,
                status,
                reason,
                updatedAt,
                actionPerformedAt,
                actionee
              }) => {
                return (
                  <tr key={`user-docs-list ${userDocumentId}`}>
                    <td>{userDocumentId}</td>

                    <td>
                      <Trigger message={documentName}>
                        <span
                          style={{
                            width: '130px',
                            cursor: 'pointer'
                          }}
                          className='d-inline-block text-truncate'
                        >
                          {documentName}
                        </span>
                      </Trigger>
                    </td>

                    <td>
                      <span
                        onClick={() => handleImagePreview(documentUrl, documentName)}
                        className='text-link'
                        style={{ cursor: 'pointer' }}
                      >
                        View Here
                      </span>
                    </td>

                    <td>{reason || 'N/A'}</td>
                    <td>{getDateTime(updatedAt)}</td>
                    <td>
                      <Trigger message={actionee || 'NA'}>
                        <span
                          style={{
                            width: '130px',
                            cursor: 'pointer'
                          }}
                          className='d-inline-block text-truncate'
                        >
                          {actionee || 'NA'}
                        </span>
                      </Trigger>
                    </td>
                    <td>{actionPerformedAt ? getDateTime(actionPerformedAt) : 'NA'}</td>

                    {(
                          !status
                            ? (
                              <td>
                                {isHidden({ module: { key: 'Users', value: 'U' } }) && 'Pending'}
                                {!isHidden({ module: { key: 'Users', value: 'U' } }) &&
                                  <ButtonGroup>
                                    <Trigger message='Approve'>
                                      <Button
                                        variant='success'
                                        className='m-1'
                                        size='sm'
                                        onClick={() =>
                                          handleVerify('approved', userDocumentId)}
                                      >
                                        <FontAwesomeIcon icon={faCheckSquare} />
                                      </Button>
                                    </Trigger>

                                    <Trigger message='Reject'>
                                      <Button
                                        variant='danger'
                                        className='m-1'
                                        size='sm'
                                        onClick={() =>
                                          handleVerify('rejected', userDocumentId)}
                                      >
                                        <FontAwesomeIcon icon={faWindowClose} />
                                      </Button>
                                    </Trigger>
                                  </ButtonGroup>}
                              </td>
                              )
                            : status === 1
                              ? (
                                <td>Approved
                                  {!isHidden({ module: { key: 'Users', value: 'U' } }) &&
                                    <Trigger message='Re-Request Document'>
                                      <Button
                                        variant='success'
                                        className='m-1'
                                        size='sm'
                                        onClick={() => handleReRequest(userDocumentId, 'request')}
                                      >
                                        <FontAwesomeIcon icon={faArrowCircleUp} />
                                      </Button>
                                    </Trigger>}
                                </td>
                                )
                              : status === 4
                                ? (
                                  <td>Re-Requested
                                    {!isHidden({ module: { key: 'Users', value: 'U' } }) &&
                                      <Trigger message='Cancel Re-Request Document'>
                                        <Button
                                          variant='danger'
                                          className='m-1'
                                          size='sm'
                                          onClick={() => handleReRequest(userDocumentId, 'cancel')}
                                        >
                                          <FontAwesomeIcon icon={faWindowClose} />
                                        </Button>
                                      </Trigger>}
                                  </td>
                                  )
                                : (
                                  <td>Rejected</td>
                                  )
                        )
                      }
                  </tr>
                )
              }
            )}

          {userDocuments?.length < 1 && (
            <tr>
              <td colSpan={8} className='text-danger text-center'>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}

export default UserDocsList
