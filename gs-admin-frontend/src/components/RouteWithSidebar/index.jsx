import React from 'react'

import Sidebar from '../Sidebar'

const RouteWithSidebar = ({ children }) => {
  return (
    <>
      <Sidebar />

      <main className='content mt-3' style={{ marginBottom: '100px' }}>
        {/* <Navbar /> */}
        {children}
      </main>
    </>
  )
}

export default RouteWithSidebar
