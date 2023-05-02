import React from 'react'
import { Tabs, Tab, Row } from '@themesberg/react-bootstrap'

import Preloader from '../../../components/Preloader'
import RemoveRestrictPCountries from './components/RemoveRestrictPCountries'
import AddRestrictPCountries from './components/AddRestrictPCountries'
import CountriesList from './components/CountriesList'
import useProviderCountries from './useProviderCountries'

const RestrictProviderCountries = ({ game }) => {
  const {
    selectedTab,
    setSelectedTab,
    loading,
    restrictedCountries,
    restrictedCountriesLimit,
    restrictedCountriesPage,
    restrictedCountriesTotalPages,
    setRestrictedCountriesLimit,
    setRestrictedCountriesPage,
    unRestrictedCountries,
    unRestrictedCountriesLimit,
    unRestrictedCountriesPage,
    unRestrictedCountriesTotalPages,
    setUnRestrictedCountriesLimit,
    setUnRestrictedCountriesPage,
    addCountries,
    selectedCountries,
    removeCountries,
    addRestrictedCountries,
    addDeleteCountries,
    removedCountries,
    removeDeleteCountries,
    removeRestrictedCountries
  } = useProviderCountries(game)

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
              <Tab eventKey='restricted-countries' title='Restricted Countries'>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <CountriesList
                      limit={restrictedCountriesLimit}
                      setLimit={setRestrictedCountriesLimit}
                      page={restrictedCountriesPage}
                      setPage={setRestrictedCountriesPage}
                      countries={restrictedCountries}
                      totalPages={restrictedCountriesTotalPages}
                    />
                  </Row>
                </div>
              </Tab>

              <Tab
                eventKey='add-restricted-countries'
                title='Add to Restricted Countries'
              >
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <AddRestrictPCountries
                      limit={unRestrictedCountriesLimit}
                      setLimit={setUnRestrictedCountriesLimit}
                      page={unRestrictedCountriesPage}
                      setPage={setUnRestrictedCountriesPage}
                      unRestrictedCountries={unRestrictedCountries}
                      totalPages={unRestrictedCountriesTotalPages}
                      addCountries={addCountries}
                      selectedCountries={selectedCountries}
                      removeCountries={removeCountries}
                      addRestrictedCountries={addRestrictedCountries}
                    />
                  </Row>
                </div>
              </Tab>

              <Tab
                eventKey='remove-restricted-countries'
                title='Remove from Restricted Countries'
              >
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <RemoveRestrictPCountries
                      limit={restrictedCountriesLimit}
                      setLimit={setRestrictedCountriesLimit}
                      page={restrictedCountriesPage}
                      setPage={setRestrictedCountriesPage}
                      restrictedCountries={restrictedCountries}
                      totalPages={restrictedCountriesTotalPages}
                      addDeleteCountries={addDeleteCountries}
                      removedCountries={removedCountries}
                      removeDeleteCountries={removeDeleteCountries}
                      removeRestrictedCountries={removeRestrictedCountries}
                    />
                  </Row>
                </div>
              </Tab>
            </Tabs>
          </div>
          )}
    </>
  )
}

export default RestrictProviderCountries
