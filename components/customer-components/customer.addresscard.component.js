import React from 'react';
import { View,StyleSheet} from 'react-native';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Box, Menu, Pressable, Text } from 'native-base';


const AddressComponent = ({deleteAddress,phone,width,selected,item,onChangeDefaultaddress}) => {
 
  return (
    <Box 
   
    style={[styles.cardContainer,{width:width?width:'95%',borderColor:'white'}]}>
  
            <Box>
                <RadioButton
                selected={selected}
                onPress={() => onChangeDefaultaddress(item._id)}
                />
               
            </Box>
      <View style={{width:'85%',paddingLeft:5}}>
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

      
      <Menu  trigger={triggerProps => {
      return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <MaterialCommunityIcons name='dots-vertical' size={35} color={Colors.white} />
            </Pressable>;
    }}>
      
        <Menu.Item onPress={() => deleteAddress(item._id)}  _text={{color:'danger.600'}} >
          
        <MaterialCommunityIcons name='delete' size={20} color={Colors.red} />
      
        </Menu.Item>
      
      </Menu>
    </Box>
  );
};

const RadioButton = ({ selected, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.radioButtonContainer}>
      <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
        {selected && <View style={styles.radioButtonInner} >
        <MaterialIcons name='check' color={'white'} size={14} />
          </View>}
      </View>
     
    </Pressable>
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
 flexWrapper:{...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter,paddingLeft:5,paddingTop:5},
 radioButtonContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 5,
},
radioButton: {
  height: 20,
  width: 20,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: Colors.white,
  alignItems: 'center',
  justifyContent: 'center',
},
radioButtonSelected: {
  borderColor: Colors.succes,
},
radioButtonInner: {
  height: 15,
  width:  15,
  borderRadius: 5,
  // backgroundColor: '#007AFF',
  backgroundColor:Colors.succes,
  justifyContent:'center',
  alignItems:'center'
},
radioButtonLabel: {
  marginLeft: 10,
  fontSize: 16,
},
})

export default AddressComponent;
