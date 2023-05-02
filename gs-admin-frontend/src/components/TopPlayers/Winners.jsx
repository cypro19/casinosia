import React from 'react'
import { Table } from '@themesberg/react-bootstrap'
import { countryFilter } from '../../utils/countryFilter'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Winners = ({ tableData }) => {
  const navigate = useNavigate()
  const { adminPermissions } = useSelector(state => state.admins)
  return (

    <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
      <thead className='thead-dark'>
        <tr>
          {[
            'Rank',
            'Country',
            'UserName',
            'Loyalty Level',
            'Amount',
            'Website'
          ].map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {tableData && tableData.length > 0
          ? tableData.map(({ userId, amount, countryCode, username, name, level }, idx) => {
            const { countryImage, countryName } = countryFilter(countryCode)
            return (
              <tr key={`top-winners ${userId}`}>
                <td>
                  {idx + 1}
                </td>
                <td style={{ textAlign: 'left' }}>
                  <img width='25px' src={countryImage} alt={countryImage} />
                  &nbsp; {countryName}
                </td>
                <td
                  style={{ cursor: 'pointer', color: 'blue' }} onClick={() => {
                    adminPermissions.Users && navigate(`${`/admin/user-details/${userId}`}`)
                  }}
                >
                  {username || 'NA'}
                </td>
                <td>{level}</td>
                <td style={{ color: '#4CAF50' }}>{amount ? `€ ${amount}` : '0.00'}</td>
                <td>{name || 'NA'}</td>
              </tr>
            )
          })
          : (
            <tr>
              <td colSpan={7} className='text-danger text-center'>
                No data found
              </td>
            </tr>
            )}
      </tbody>
    </Table>
  )
}

export default Winners
