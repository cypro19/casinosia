import React from 'react'
import { Tabs, Tab, Row } from '@themesberg/react-bootstrap'

import useRestrictedProviders from './useRestrictedProviders'
import Preloader from '../../../components/Preloader'
import ProvidersList from './components/ProvidersList'
import AddRestrictedProviders from './components/AddRestrictedProviders'
import RemoveRestrictedProviders from './components/RemoveRestrictedProviders'
import useCheckPermission from '../../../utils/checkPermission'

const RestrictedProviders = () => {
  const {
    loading,
    restrictedItemsLimit,
    setRestrictedItemsLimit,
    restrictedItemsPage,
    setRestrictedItemsPage,
    unRestrictedItemsLimit,
    setUnRestrictedItemsLimit,
    setUnRestrictedItemsPage,
    unRestrictedItemsPage,
    restrictedItemsTotalPages,
    unRestrictedItemsTotalPages,
    restrictedItems,
    selectedTab,
    setSelectedTab,
    unRestrictedItems,
    addProvider,
    selectedProviders,
    removeProvider,
    addRestrictedProvider,
    removeRestrictedProvider,
    addDeleteProvider,
    removeDeleteProvider,
    removedProviders
  } = useRestrictedProviders()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? (
          <Preloader />
          )
        : (
          <div className='mt-3'>
            <Tabs
              activeKey={selectedTab}
              onSelect={(tab) => setSelectedTab(tab)}
              className='nav-light'
            >
              <Tab eventKey='restricted-providers' title='Restricted Providers'>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <ProvidersList
                      limit={restrictedItemsLimit}
                      setLimit={setRestrictedItemsLimit}
                      page={restrictedItemsPage}
                      setPage={setRestrictedItemsPage}
                      provider={restrictedItems}
                      totalPages={restrictedItemsTotalPages}
                    />
                  </Row>
                </div>
              </Tab>

              <Tab eventKey='add-providers' title='Add to Restricted Providers'>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <AddRestrictedProviders
                      limit={unRestrictedItemsLimit}
                      setLimit={setUnRestrictedItemsLimit}
                      page={unRestrictedItemsPage}
                      setPage={setUnRestrictedItemsPage}
                      unRestrictedItems={unRestrictedItems}
                      totalPages={unRestrictedItemsTotalPages}
                      addProvider={addProvider}
                      selectedProviders={selectedProviders}
                      removeProvider={removeProvider}
                      addRestrictedProvider={addRestrictedProvider}
                    />
                  </Row>
                </div>
              </Tab>

              {!isHidden({ module: { key: 'RestrictedCountry', value: 'U' } }) &&
                <Tab
                  eventKey='remove-providers'
                  title='Remove from Restricted Providers'
                >
                  <div className='mt-5'>
                    <Row className='mt-3 d-flex'>
                      <RemoveRestrictedProviders
                        limit={restrictedItemsLimit}
                        setLimit={setRestrictedItemsLimit}
                        page={restrictedItemsPage}
                        setPage={setRestrictedItemsPage}
                        restrictedItems={restrictedItems}
                        totalPages={restrictedItemsTotalPages}
                        addDeleteProvider={addDeleteProvider}
                        removedProviders={removedProviders}
                        removeDeleteProvider={removeDeleteProvider}
                        removeRestrictedProvider={removeRestrictedProvider}
                      />
                    </Row>
                  </div>
                </Tab>}
            </Tabs>
          </div>
          )}
    </>
  )
}

export default RestrictedProviders
