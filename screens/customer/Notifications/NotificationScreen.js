import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Text, Pressable, Icon, HStack, Avatar, VStack, Spacer, ScrollView, Divider } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../../../util/styles/styles';
import Colors from '../../../util/styles/colors';

const data = [{
  id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
  fullName: 'Afreen Khan',
  timeStamp: '12:47 PM',
  recentText: 'Good Day!',
  avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
}, {
  id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
  fullName: 'Sujita Mathur',
  timeStamp: '11:11 PM',
  recentText: 'Cheer up, there!',
  avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU'
}, {
  id: '58694a0f-3da1-471f-bd96-145571e29d72',
  fullName: 'Anci Barroco',
  timeStamp: '6:22 PM',
  recentText: 'Good Day!',
  avatarUrl: 'https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg'
}, {
  id: '68694a0f-3da1-431f-bd56-142371e29d72',
  fullName: 'Aniket Kumar',
  timeStamp: '8:56 PM',
  recentText: 'All the best',
  avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU'
}, {
  id: '28694a0f-3da1-471f-bd96-142456e29d72',
  fullName: 'Kiara',
  timeStamp: '12:47 PM',
  recentText: 'I will call today.',
  avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU'
}];
export const NotificationScreen = () => {
  const { notificaciones } = useSelector(state => state.user)
  const [openedRow, setOpenedRow] = useState(null);
  


  const [listData, setListData] = useState(data);

  const closeRow = (rowMap, rowKey) => {
    console.log({rowMap, rowKey});
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
    setOpenedRow(rowKey);
  };

  const renderItem = ({
    item,
    index
  }) => {
    return (
      <Box>
      <Pressable onPress={() => console.log('You touched me')} _dark={{
        bg: Colors.bgColor
      }} _light={{
        bg: Colors.bgColor
      }}>
        <Box pl="4" pr="5" py="2">
          <HStack alignItems="center" space={3}>

            <VStack>
              <Text color="coolGray.800" _dark={{
                color: 'warmGray.50'
              }} bold>
                {item.titulo}
              </Text>
            </VStack>
            <Spacer />
          
          </HStack>
        </Box>
      </Pressable>
      <Divider/>
    </Box>
    )
  };


  const renderHiddenItem = (data, rowMap) => {
   
    return (
      <Box  h={'100%'} justifyContent={'center'} alignItems="center" >
        <TouchableOpacity
          style={{ width: 70, marginLeft: 'auto' }}
          onPress={() => deleteRow(rowMap, data.item.key)}
        >
          <VStack justifyContent={'center'} alignItems="center" space={2}>
            <MaterialCommunityIcons name='delete' size={30}  color={Colors.white}/>
          </VStack>
        </TouchableOpacity>
      </Box>
    )
  };

  return (
    <View style={CommonStyles.screenY} >

      <Box safeArea flex="1">
        <SwipeListView
          data={notificaciones}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-100}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onRowDidOpen={onRowDidOpen}
        />
      </Box>

    </View>
  )
}



const styles = StyleSheet.create({})