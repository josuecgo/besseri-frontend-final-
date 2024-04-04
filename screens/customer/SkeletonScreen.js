import { View } from 'react-native'
import React from 'react'
import { Skeleton, VStack, Center } from 'native-base';
import CommonStyles from '../../util/styles/styles'
import LoaderComponent from '../../components/Loader/Loader.component';

export const SkeletonScreen = () => {
  return (
    <View style={CommonStyles.screenY} >
      <Center w="350">
      <VStack w="90%" maxW="400" borderWidth="1" space={8} overflow="hidden" rounded="md" _dark={{
      borderColor: 'coolGray.500'
    }} _light={{
      borderColor: 'coolGray.200'
    }}
    py={10}>
        {/* <Skeleton h="40" /> */}
        <Skeleton.Text px="4" />
        <Skeleton.Text px="4" />
        <Skeleton.Text px="4" />
        <Skeleton.Text px="4" />
        {/* <Skeleton px="4" my="4" rounded="md" startColor="primary.100" /> */}
      </VStack>
      {/* <LoaderComponent isVisible={true} /> */}
    </Center>
    </View>
  )
}

 