import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './store'

// core styles
import './scss/volt.scss'

// vendor styles
import 'react-datetime/css/react-datetime.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import HomePage from './pages/HomePage'
import { setupInterceptors } from './utils/axios'
import { Toaster } from 'react-hot-toast'

window.Buffer = window.Buffer || require("buffer").Buffer;
setupInterceptors()

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <Toaster 
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          border: '1px solid #1c2144',
          color: '#1c2144',
          padding: '16px',
        },
        // success: {
        //   duration: 3000,
        // },
        // error: {
        //   duration: 3000,
        // },
      }}
    />
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  </Provider>
)
