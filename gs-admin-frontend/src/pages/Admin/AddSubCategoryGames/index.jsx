import React from 'react'
import { Button, Row, Col } from '@themesberg/react-bootstrap'

import useAddGames from './hooks/useAddGames'
import Preloader from '../../../components/Preloader'
import AddedGamesTable from './components/AddedGamesTable'
import GamesList from './components/GamesList'

const AddSubCategoryGames = () => {
  const {
    loading,
    page,
    limit,
    search,
    setLimit,
    setPage,
    setSearch,
    totalPages,
    masterGames,
    selectedGames,
    addGame,
    removeGame,
    addGamesToSubCategory,
    subCategoryName,
    selectedProvider,
    setSelectedProvider,
    getProviderName
  } = useAddGames()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            <Row>
              <Col sm={8}>
                <h3>Add Games: {subCategoryName?.EN}</h3>
              </Col>

              <Col className='text-right mb-2'>
                <Button
                  variant='success'
                  size='sm'
                  disabled={selectedGames?.length === 0}
                  onClick={addGamesToSubCategory}
                >
                  Create
                </Button>
              </Col>
            </Row>

            <AddedGamesTable selectedGames={selectedGames} removeGame={removeGame} />

            <GamesList
              page={page}
              limit={limit}
              search={search}
              setLimit={setLimit}
              setPage={setPage}
              setSearch={setSearch}
              totalPages={totalPages}
              masterGames={masterGames}
              addGame={addGame}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
              getProviderName={getProviderName}
            />
          </>
          )}
    </>

  )
}

export default AddSubCategoryGames
