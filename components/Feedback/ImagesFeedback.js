import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Image, Text } from 'native-base';
import { base_url } from '../../util/api/api_essentials';
import { deviceHeight, deviceWidth } from '../../util/Dimentions';
import Modal from "react-native-modal";


export const ImagesFeedback = ({ imgs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState('');

  const zoomImage = (item) => {
    setImage(item)
    setIsOpen(true)
  }

  return (
    <View style={styles.content} >
      {
        imgs?.map((item) => (
          <TouchableOpacity
            key={item.filename}
            onPress={() => zoomImage(item)}
          >
            <Image

              source={{ uri: `${base_url}/${item?.path}` }}
              alt="Image"
              resizeMode="cover"
              style={styles.img}
            />
          </TouchableOpacity>

        ))
      }

      <Modal 
      isVisible={isOpen}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      onSwipeComplete={() => setIsOpen(false)}
      swipeDirection="left"
      
      >
        <View style={{ flex: 1,alignItems:'center',justifyContent:'space-between'}}>
          <View style={{flex:1}} />
          <Image

            source={{ uri: `${base_url}/${image?.path}` }}
            alt="Image"
            resizeMode="contain"
          
            style={styles.zoom}
            />
            <View style={{flex:1}} />
            <Button variant={'outline'} onPress={() => setIsOpen(false) } >Close</Button>
        </View>
      </Modal>
    </View>
  )
}



const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    marginVertical: 10,

    // backgroundColor:'red',
    // flexGrow:1
  },
  img: {
    width: deviceWidth * 0.20,
    height: deviceWidth * 0.18,
    borderRadius: 10,
    marginHorizontal: 5
  },
  zoom:{
    width: deviceWidth  ,
    height: deviceHeight * 0.7 ,
  }
})