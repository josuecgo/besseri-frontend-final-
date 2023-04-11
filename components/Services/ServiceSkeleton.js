
import React from 'react'
import { Center, Skeleton, VStack } from 'native-base'

export const ServiceSkeleton = () => {
  return (
    <Center w="100%">
      <Skeleton px="4" my="4" rounded="2xl"  />
    <VStack 
    w="90%" maxW="400"  space={8} overflow="hidden" rounded="lg" 
    >
      
      <Skeleton.Text px="4" />
     
    </VStack>
  </Center>
  )
}

