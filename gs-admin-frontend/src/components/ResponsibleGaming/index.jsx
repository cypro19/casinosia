import { faEdit, faRedo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card } from '@themesberg/react-bootstrap'
import React from 'react'
import Trigger from '../OverlayTrigger'
import DailyLimit from './DailyLimit'
import './style.css'
import useResponsibleGaming from './useResponsibleGaming'
import useCheckPermission from '../../utils/checkPermission'
import SelfExclusion from './SelfExclusion'
import { ResetConfirmationModal } from '../ConfirmationModal'

export default ({ userLimits, user = {}, currencyCode }) => {
  const {
    limitLabels,
    setLimit,
    setLimitModal,
    limitModal,
    limit,
    updateLimit,
    exclusionModal,
    setExclusionModal,
    setDisableUser,
    resetModal,
    setResetModal,
    handleYes,
    data,
    setData
  } = useResponsibleGaming({ userLimits })

  const { isHidden } = useCheckPermission()

  return (
    <>
      <Card className='card-overview'>
        <h4 className='h4-overview'>Limits <hr className='h4-hr' /></h4>
        <div className='div-overview limit'>
          {limitLabels?.map(({ label, value, minimum }) => {
            return (
              <div key={label}>
                <h6>{label}</h6>
                <div>
                  <span>{value || 'Not Set'}</span>
                  <Trigger message='Set Limit'>
                    <Button
                      variant='warning'
                      size='sm'
                      onClick={() => {
                        setLimit({ label, value, minimum })
                        setLimitModal(true)
                      }}
                      hidden={isHidden({ module: { key: 'Users', value: 'SR' } })}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </Trigger>

                  <Trigger message='Reset Limit'>
                    <Button
                      variant='danger'
                      size='sm'
                      disabled={!value}
                      onClick={() => {
                        setData(label)
                        setResetModal(true)
                      }}
                      hidden={isHidden({ module: { key: 'Users', value: 'SR' } })}
                    >
                      <FontAwesomeIcon icon={faRedo} />
                    </Button>
                  </Trigger>
                </div>
              </div>
            )
          })}

          <div key='Take A Break'>
            <h6>Take A Break</h6>
            <div>
              <span>{user?.selfExclusion
                ? `${Math.ceil((Math.abs(new Date(user?.selfExclusion) - new Date())) / (1000 * 60 * 60 * 24))} Days`
                : 'Not Set'}
              </span>
              <Trigger message='Set Take A Break'>
                <Button
                  variant='warning'
                  size='sm'
                  onClick={() => {
                    setLimit({
                      label: 'Take A Break',
                      name: 'Time Period',
                      value: user?.selfExclusion ? Math.ceil((Math.abs(new Date(user?.selfExclusion) - new Date())) / (1000 * 60 * 60 * 24)) : ''
                    })
                    setLimitModal(true)
                  }}
                  hidden={isHidden({ module: { key: 'Users', value: 'SR' } })}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </Trigger>

              <Trigger message='Reset Take A Break'>
                <Button
                  variant='danger'
                  size='sm'
                  disabled={!user?.selfExclusion}
                  onClick={() => {
                    setData('Take A Break')
                    setResetModal(true)
                  }}
                  hidden={isHidden({ module: { key: 'Users', value: 'SR' } })}
                >
                  <FontAwesomeIcon icon={faRedo} />
                </Button>
              </Trigger>
            </div>
          </div>

          <div key='Self Exclusion'>
            <h6>Self Exclusion</h6>
            <div>
              <span>{userLimits?.isSelfExclusionPermanent
                ? 'Permanent'
                : userLimits?.selfExclusion
                  ? `${Math.ceil((Math.abs(new Date(userLimits?.selfExclusion) - new Date())) / (1000 * 60 * 60 * 24 * 30))} Months (${userLimits?.selfExclusionType?.toUpperCase()})`
                  : 'Not Set'}
              </span>
              <Trigger message='Set Self Exclusion'>
                <Button
                  variant='warning'
                  size='sm'
                  onClick={() => {
                    setLimit({
                      type: 'SELF_EXCLUSION',
                      days: userLimits?.isSelfExclusionPermanent
                        ? -1
                        : userLimits?.selfExclusion ? Math.ceil((Math.abs(new Date(userLimits?.selfExclusion) - new Date())) / (1000 * 60 * 60 * 24 * 30)) : ''
                    })
                    setExclusionModal(true)
                  }}
                  hidden={isHidden({ module: { key: 'Users', value: 'SR' } })}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </Trigger>

              <Trigger message='Reset Self Exclusion'>
                <Button
                  variant='danger'
                  size='sm'
                  disabled={!userLimits?.isSelfExclusionPermanent && !userLimits?.selfExclusion}
                  onClick={() => {
                    setData('Self Exclusion')
                    setResetModal(true)
                  }}
                  hidden={isHidden({ module: { key: 'Users', value: 'SR' } })}
                >
                  <FontAwesomeIcon icon={faRedo} />
                </Button>
              </Trigger>
            </div>
          </div>
          <div key='Session Limit'>
            <h6>Session Limit</h6>
            <div>
              <span>{userLimits?.timeLimit || 'Not Set'}</span>
              <Trigger message='Set Limit'>
                <Button
                  variant='warning'
                  size='sm'
                  onClick={() => {
                    setLimit({ label: 'Session Limit', name: 'Time Period', value: userLimits?.timeLimit || '' })
                    setLimitModal(true)
                  }}
                  hidden={isHidden({ module: { key: 'Users', value: 'SR' } })}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </Trigger>

              <Trigger message='Reset Limit'>
                <Button
                  variant='danger'
                  size='sm'
                  disabled={!userLimits?.timeLimit}
                  onClick={() => {
                    setData('Session Limit')
                    setResetModal(true)
                  }}
                  hidden={isHidden({ module: { key: 'Users', value: 'SR' } })}
                >
                  <FontAwesomeIcon icon={faRedo} />
                </Button>
              </Trigger>
            </div>
          </div>
        </div>
      </Card>
      {limitModal &&
        <DailyLimit
          show={limitModal}
          setShow={setLimitModal}
          limit={limit}
          updateLimit={(limit?.label === 'Take A Break' || limit?.label === 'Session Limit') ? setDisableUser : updateLimit}
          currencyCode={currencyCode}
        />}

      {exclusionModal &&
        <SelfExclusion
          show={exclusionModal}
          setShow={setExclusionModal}
          limit={limit}
          updateLimit={setDisableUser}
        />}

      {resetModal &&
        <ResetConfirmationModal
          show={resetModal}
          setShow={setResetModal}
          handleYes={handleYes}
          data={data}
        />}
    </>
  )
}
