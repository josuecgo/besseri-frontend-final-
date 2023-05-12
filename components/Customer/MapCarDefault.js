import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { adjust } from '../../util/Dimentions';
import { Button, Image } from 'native-base';
import { useSelector } from 'react-redux';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';

export const MapCarDefault = ({changeCar}) => {
 
  const {carActive} = useSelector( state => state.user )
  return (
    <Pressable 
    onPress={changeCar}
    style={styles.body}
    >
      <View style={styles.left} >
        <Image
        source={require('../../assets/images/24.png')}
        alt='car'
        style={styles.icon}
        />
        {/* <MaterialIcons
        name="directions-car"
        color={Colors.white} 
        size={25}
        /> */}
       
        <Text style={styles.car} >{carActive?.model?.name} {carActive?.maker?.name}</Text>
   
      
        </View>
     
     
    </Pressable>
  )
}



const styles = StyleSheet.create({
  body:{
    marginVertical:10,
    flexDirection:'row',
    // alignItems:'center',
    justifyContent:'space-between',
    
  },
  left:{
    flexDirection:'row',
    alignItems:'center',
  },
  icon:{
    width:30,
    height:30,
    resizeMode:'contain',
    marginRight:5
  },
  car:{
    fontSize:adjust(14),
    marginLeft:5,
    textAlign:'right',
    textDecorationLine:'underline',
    ...CommonStyles.h2
  }
})