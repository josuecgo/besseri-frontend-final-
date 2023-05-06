import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Avatar, HStack, Heading } from 'native-base'
import Colors from '../../util/styles/colors'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getCarActive } from '../../util/local-storage/auth_service'
import { addCarActiveToUser } from '../../util/ReduxStore/Actions/CustomerActions/UserInfoActions'

export const MyCarActive = () => {
  const {carActive} = useSelector(state => state.user);
  const dispatch = useDispatch()


  // Lo puedo volver un hook
  const getInfoUser = async() => {
    if (carActive) {
      return
    }
    const carActive = await getCarActive();
    dispatch( addCarActiveToUser(carActive) )
  }
  useEffect(() => {
    getInfoUser()
  }, [])
  return (
    <View>
      <HStack alignItems={'center'} space={2} mx={2} >

        <Avatar size={'lg'} ></Avatar>
        <Heading size={'sm'} color={Colors.white} >{carActive?.maker?.name} {carActive?.model?.name}</Heading>

      </HStack>
    </View>
  )
}

 
const styles = StyleSheet.create({})