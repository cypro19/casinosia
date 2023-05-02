import React from 'react'
import { Tabs, Tab, Row } from '@themesberg/react-bootstrap'

import useRestrictedGames from './useRestrictedGames'
import Preloader from '../../../components/Preloader'
import GamesList from './components/GamesList'
import AddRestrictedGames from './components/AddRestrictedGames'
import RemoveRestrictedGames from './components/RemoveRestrictedGames'
import useCheckPermission from '../../../utils/checkPermission'

const RestrictedGames = () => {
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
    addGame,
    selectedGames,
    removeGame,
    addRestrictedGames,
    addDeleteGame,
    removeDeleteGame,
    removeRestrictedGame,
    removedGames
  } = useRestrictedGames()
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
              <Tab eventKey='restricted-games' title='Restricted Games'>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <GamesList
                      limit={restrictedItemsLimit}
                      setLimit={setRestrictedItemsLimit}
                      page={restrictedItemsPage}
                      setPage={setRestrictedItemsPage}
                      games={restrictedItems}
                      totalPages={restrictedItemsTotalPages}
                    />
                  </Row>
                </div>
              </Tab>

              <Tab eventKey='add-games' title='Add to Restricted Games'>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <AddRestrictedGames
                      limit={unRestrictedItemsLimit}
                      setLimit={setUnRestrictedItemsLimit}
                      page={unRestrictedItemsPage}
                      setPage={setUnRestrictedItemsPage}
                      unRestrictedItems={unRestrictedItems}
                      totalPages={unRestrictedItemsTotalPages}
                      addGame={addGame}
                      selectedGames={selectedGames}
                      removeGame={removeGame}
                      addRestrictedGames={addRestrictedGames}
                    />
                  </Row>
                </div>
              </Tab>

              {!isHidden({ module: { key: 'RestrictedCountry', value: 'U' } }) &&
                <Tab eventKey='remove-games' title='Remove from Restricted Games'>
                  <div className='mt-5'>
                    <Row className='mt-3 d-flex'>
                      <RemoveRestrictedGames
                        limit={restrictedItemsLimit}
                        setLimit={setRestrictedItemsLimit}
                        page={restrictedItemsPage}
                        setPage={setRestrictedItemsPage}
                        restrictedItems={restrictedItems}
                        totalPages={restrictedItemsTotalPages}
                        addDeleteGame={addDeleteGame}
                        removedGames={removedGames}
                        removeDeleteGame={removeDeleteGame}
                        removeRestrictedGame={removeRestrictedGame}
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

export default RestrictedGames
