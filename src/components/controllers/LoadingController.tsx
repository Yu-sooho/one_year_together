import React, {memo, useEffect} from 'react'
import {useAppStateStore} from '../../stores'
import {LoadingContainer} from '../containers'

const LoadingController = memo(() => {
  const isLoading = useAppStateStore(state => state.isLoading)
  if (isLoading) return <LoadingContainer />
  return null
})

export default LoadingController
