import React from 'react';
import { Text, View, StyleSheet,TouchableOpacity, ScrollView } from 'react-native';

import Colors from '../../../util/styles/colors';
import CommonStyles from '../../../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { HeaderBackground } from '../../../components/Background/HeaderBackground';
import { deviceHeight } from '../../../util/Dimentions';
import { Orders } from '../../../components/Customer/Orders';




const CustomerOrdersViewScreen = (props) => {

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bgColor }}>
      <HeaderBackground/>
        <View style={styles.header}>
            <TouchableOpacity style={{alignSelf:'flex-start'}}>
                <MaterialCommunityIcons
                onPress={() => props?.navigation?.goBack()}
                name='keyboard-backspace'
                color={Colors.white}
                size={25}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Mis pedidos</Text>
        </View>
      
    
      <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:'5%'}}> 

         <View style={{flex:1}} >
          <Orders
          
          navigation={props.navigation}
          />
      
          </View>
      </ScrollView>
     
    </View>
  );
};
const styles = StyleSheet.create({
  placeOrderText: { ...CommonStyles.fontFamily, fontSize: 20 },
  placeOrderTextDetail: { fontSize: 13, fontWeight: '300', width: '90%', alignSelf: 'center', textAlign: 'center', color: Colors.dark },
  placeOrderWrapper: { justifyContent: 'center', alignItems: 'center', bottom: 40 },
  header:{
    width:'100%',
    height:Platform.OS == 'ios' ? deviceHeight *0.15 : deviceHeight * 0.10, 
    
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent:'center'
},
headerText:{...CommonStyles.fontFamily,color:Colors.white,fontSize:20,position:'absolute'},
})
export default CustomerOrdersViewScreen;
