import { View, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Button } from 'native-base'
import ImageCropPicker from 'react-native-image-crop-picker';
import { ButtonIconoInput } from './button/ButtonIconoInput';
import Colors from '../util/styles/colors';

export const UploadImages = ({onChange,form,deleteImg}) => {
  const {imgs} = form;

  const pickProductImg1 = () => {
    ImageCropPicker.openPicker({
      
      width: 300,
      height: 400,
      maxFiles:3,
      mediaType:'photo',
      compressImageQuality:0.5,
      compressImageMaxHeight:400,
      compressImageMaxWidth:300
      
    }).then((image) => {
      
      onChange('imgs',image)
     
    });
  };

  
 
  return (
    <View style={styles.content}>

      <View style={styles.imgContent} >
      {
        imgs.map((img) => (
          <View
          key={img.path}
          >
            <View style={styles.deleteImg} >
              <ButtonIconoInput 
              name={'delete'} 
              color={Colors.alertRed} 
              size={20} 
              onPress={() => deleteImg('imgs',img)}
              />
            </View>
           
             <Image
              source={{uri:img.path}}
              style={styles.img}
              />
          </View>
         
        ))
      }
      </View>

      {
        imgs.length < 3 && (
          <Button onPress={pickProductImg1} variant={'ghost'} >Subir imagen</Button>
        )
      }

      
    </View>
  )
}

const styles = StyleSheet.create({
  content:{
    // backgroundColor:'red'

  },
  imgContent:{
    justifyContent:'center',
    flexDirection:'row',
   
  },
  deleteImg:{
    // backgroundColor:'red',
    position:'absolute',
    right:0,
    top:-15,
    // width:100,
    height:50,
    zIndex:99
  },
  img:{
    width:70,
    height:70,
    marginHorizontal:5,
  }
})