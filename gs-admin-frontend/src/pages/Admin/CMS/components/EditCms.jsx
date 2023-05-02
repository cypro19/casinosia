import React from 'react'
import useCmsDetails from '../hooks/useCmsDetails'
import CreateCms from './CreateCms'
import Preloader from '../../../../components/Preloader'

const EditCms = () => {
  const { cmsByPageIdData, loading } = useCmsDetails()

  return (
    loading
      ? <Preloader />
      : (
        <>
          <CreateCms cmsData={cmsByPageIdData} />
        </>
        )
  )
}

export default EditCms
