import { Table } from '@themesberg/react-bootstrap'
import React from 'react'
import { useSelector } from 'react-redux'
import PaginationComponent from '../../../../../components/Pagination'

const GamesListEdit = ({
  gameIds,
  casinoGamesData,
  setGameIds,
  page,
  limit,
  setLimit,
  setPage,
  isEdit,
  details
}) => {
  const totalPages = Math.ceil(casinoGamesData?.count / limit)
  const { allProviders } = useSelector((state) => state.superAdminCasino)

  const selectHandler = (e, masterCasinoGameId) => {
    if (gameIds.includes('' + masterCasinoGameId) || gameIds.includes(masterCasinoGameId)) {
      const newObj = []
      for (const ids in gameIds) {
        if (parseInt(gameIds[ids]) !== masterCasinoGameId) {
          newObj.push(gameIds[ids])
        }
      }
      setGameIds(newObj)
    } else {
      const newObj = []
      for (const ids in gameIds) {
        newObj.push(gameIds[ids])
      }
      newObj.push(masterCasinoGameId)
      setGameIds(newObj)
    }
  }

  return (
    <div>
      <Table bordered striped responsive hover size='sm' className='text-center scrollable'>
        <thead className='thead-dark'>
          <tr>
            {[
              'Name',
              'Provider'
            ].map((h) => (<th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {casinoGamesData && casinoGamesData.count > 0
            ? casinoGamesData.rows.map(({ masterCasinoGameId, name, masterCasinoProviderId }, idx) => {
              return (
                <tr key={`${masterCasinoGameId}`}>
                  <td>
                    <input
                      type='checkbox'
                      defaultChecked={gameIds?.includes('' + masterCasinoGameId) || gameIds?.includes(masterCasinoGameId) || gameIds?.includes(String(masterCasinoGameId))}
                      name={masterCasinoGameId}
                      disabled={details}
                      onChange={(e) => { !details && selectHandler(e, masterCasinoGameId) }}

                    />
                    {name}
                  </td>

                  <td>{allProviders?.rows?.find(obj => obj.masterCasinoProviderId === masterCasinoProviderId)?.name}</td>

                </tr>
              )
            })
            : (
              <tr>
                <td colSpan={2} className='text-danger text-center'>
                  No data found
                </td>
              </tr>
              )}

        </tbody>
      </Table>
      {casinoGamesData?.count !== 0 && (
        <PaginationComponent
          page={casinoGamesData?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </div>
  )
}

export default GamesListEdit
