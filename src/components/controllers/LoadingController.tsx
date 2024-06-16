import React, {memo, useEffect, useRef} from 'react'
import {useAppStateStore} from '../../stores'
import {LoadingContainer} from '../containers'

const LoadingController = memo(() => {
  const isLoading = useAppStateStore(state => state.isLoading)
  const setIsLoading = useAppStateStore(state => state.setIsLoading)

  const setTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLoading) {
      setTimeoutRef.current = setTimeout(() => {
        setIsLoading(true)
      }, 20000)
    } else if (setTimeoutRef.current) {
      clearTimeout(setTimeoutRef.current)
    }
  }, [isLoading])

  if (isLoading) return <LoadingContainer />
  return null
})

export default LoadingController
