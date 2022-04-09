import React from 'react';
import {Text, View,StyleSheet,Image,TouchableOpacity} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const AddressComponent = ({label,addressLine,onPress,phone,info,width,selected}) => {
  return (
    <TouchableOpacity 
    onPress={onPress}
    activeOpacity={1}
    style={[styles.cardContainer,{width:width?width:'95%',borderColor:selected ? Colors.darkPink : 'white'}]}>
    <View style={styles.labelCircle}>
      {
          label == 'Home' ? 
          <Ionicons size={20} name='home-sharp' color={Colors.darkPink}/>
          :
          label == 'Work' ?
          <MaterialIcons size={20} name='work' color={Colors.darkPink}/> 
          :
          null
      }
    </View>
    <View style={{width:'90%',paddingLeft:10}}>
        <Text style={{fontSize:13,...CommonStyles.fontFamily,paddingLeft:10}}>{addressLine}</Text>
       {
           phone ?
           <View style={styles.flexWrapper}>
           <MaterialCommunityIcons name='phone' size={18} color={Colors.dark}/>
           <Text style={{paddingLeft:5,...CommonStyles.fontFamily,color:Colors.dark}}>{phone}</Text>
       </View>
       :
       null
       }
      {
          info ? 
          <View style={styles.flexWrapper}>
          <MaterialCommunityIcons name='information' size={18} color={Colors.dark}/>
          <Text style={{paddingLeft:5,...CommonStyles.fontFamily,color:Colors.dark}}>{info}</Text>
      </View>
      :
      null
      }
    </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  cardContainer:{
    width:'95%',
    minHeight:100,
    borderWidth:2,
    borderColor:Colors.white,
    backgroundColor:'white',
    elevation:1,
    margin:5,
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'center',
    paddingHorizontal:10,
    paddingVertical:10
},
 labelCircle:{
     width:40,
     height:40,
     borderWidth:1,
     borderColor:Colors.darkPink,
     backgroundColor:Colors.lightPink,
     ...CommonStyles.flexCenter,
     borderRadius:40/2
 },
 flexWrapper:{...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter,paddingLeft:5,paddingTop:5}
})

export default AddressComponent;
