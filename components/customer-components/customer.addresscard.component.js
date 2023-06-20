import React from 'react';
import { View,StyleSheet} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Box, Menu, Pressable, Text } from 'native-base';


const AddressComponent = ({deleteAddress,phone,width,selected,item}) => {
 
  return (
    <Box 
   
    style={[styles.cardContainer,{width:width?width:'95%',borderColor:'white'}]}>
  
      <View style={{width:'90%',paddingLeft:10}}>
          <Text style={{fontSize:13,...CommonStyles.fontFamily,paddingLeft:10}}>{item.formatted_address}</Text>
        {
            phone ?
            <View style={styles.flexWrapper}>
              <MaterialCommunityIcons name='phone' size={18} color={Colors.white}/>
            <Text style={{paddingLeft:5,...CommonStyles.fontFamily}}>{phone}</Text>
            </View>
        :
        null
        }
      </View>

      
      <Menu w="190" trigger={triggerProps => {
      return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <MaterialCommunityIcons name='dots-vertical' size={35} color={Colors.white} />
            </Pressable>;
    }}>
      
        <Menu.Item onPress={() => deleteAddress(item._id)}  _text={{color:'danger.600'}} >Eliminar</Menu.Item>
      
      </Menu>
    </Box>
  );
};
const styles = StyleSheet.create({
  cardContainer:{
    width:'95%',
    minHeight:100,
    borderWidth:1,
    borderColor:Colors.white,
    margin:5,
    flexDirection:'row',
    alignItems:'center',
    alignSelf:'center',
    paddingHorizontal:10,
    paddingVertical:10,
    borderRadius:10
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
