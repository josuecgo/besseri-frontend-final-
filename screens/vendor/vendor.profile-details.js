import React, { useEffect, useState } from 'react';
import {Dimensions, Image,Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import { ThinlineSeparator,MenuItem, Heading, OrderCard } from '../../components/CommonComponents';

import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getBusinessProfile} from '../../util/local-storage/auth_service';
import Loader from '../../components/Loader/Loader.component'
import {useRoute} from '@react-navigation/native';
import { base_url } from '../../util/api/api_essentials';
import { adjust, deviceHeight } from '../../util/Dimentions';


import { HeaderBackground } from '../../components/Background/HeaderBackground';
import { VENDOR_DETAILS_ROUTES } from '../../util/constants';

const VendorProfileDetailScreen = ({navigation, route}) => {
  const [showLoader,setShowLoader] = useState(false);
  const {params} = useRoute();
  const [business,setBusiness] = useState(null);
  
  const commonTextStyle = {
    fontSize:16,
   color:Colors.darker,
   ...CommonStyles.fontFamily,
   paddingLeft:15
  }
  const getBusinessData = async() => {
    const profile = await getBusinessProfile();
    setBusiness(profile);
  }
  useEffect(() => {
    navigation.addListener('focus', () => {
      getBusinessData();
    });
    
  },[]);
  
  return (
    <View style={[styles.container]}>
     <Loader isVisible={showLoader}/>
     <HeaderBackground/>
    <View
      style={styles.header}
    > 
      <View style={{flexDirection:'row'}} >
        <TouchableOpacity onPress={() => navigation.pop()}>
            <MaterialCommunityIcons name='keyboard-backspace' color={Colors.white} size={30}/>
        </TouchableOpacity>
        {/* <TouchableOpacity>
            <AntDesign name='setting' color={Colors.white} size={27}/>
        </TouchableOpacity> */}

        
      </View>

      <View>
        <Text style={{color:Colors.white, fontSize:adjust(17)}} >Perfil</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_EDIT_PROFILE,{business})}>
        <AntDesign name='setting' color={Colors.white} size={27}/>
      </TouchableOpacity>
    
    </View>

    <View>
     <Image
     source={{uri:`${base_url}/${business?.logo}`}}
     style={styles.profileBgBanner}
     />
    
    </View>

    <View style={styles.bottomBodyWrapper}>
        <Text style={styles.storeNameText}>{business?.storeName}</Text>
        <View>
          <ThinlineSeparator margin={15} width={'95%'}/>
          <Heading
           text='Datos de contacto'
          />
          <Text style={commonTextStyle}>{business?.email}</Text>
          <ThinlineSeparator margin={15} width={'95%'}/>
          <Heading text='Dirección del sitio'/>
          
          <View style={styles.locationBox}>
            <Entypo name='location-pin' color='red' size={30}/>
            <Text style={CommonStyles.fontWeight300}>{business?.address}</Text>
          </View> 

           

        </View>
    </View>


  
   
   </View>
  );
};
const styles = StyleSheet.create({
 container:{
   flex:1,
   backgroundColor:Colors.white,
   
 },
 header:{
   width:'100%',
   height:Platform.OS == 'ios' ? deviceHeight *0.15 : deviceHeight * 0.10,   
   ...CommonStyles.flexDirectionRow,
   ...CommonStyles.justifySpaceBetween,
   ...CommonStyles.horizontalCenter,
   paddingHorizontal:10

 },
 profileBtn:{
   width:'95%',
   height:55,
   borderWidth:1,
   borderColor:Colors.brightBlue,
   backgroundColor:Colors.brightBlue,
   ...CommonStyles.verticalCenter,
   ...CommonStyles.horizontalCenter,
   borderRadius:3,
   alignSelf:'center',
   margin:10
 },
 profileBgBanner:{
     width:'90%',
     height:130,
     borderWidth:1,
     borderColor:Colors.white,
     backgroundColor:Colors.bgColor,
     alignSelf:'center',
     borderRadius:20,
     top:20
 },
 profileImg:{
     width:100,
     height:100,
     borderWidth:1,
     borderColor:'transparent',
     borderRadius:100/2,
    //  position:'absolute',
    //  bottom:-40,
     alignSelf:'center',
     resizeMode:'cover'
 },
 storeNameText:{
     fontSize:adjust(17),
     ...CommonStyles.fontFamily,
     textAlign:'center'
 },
 bottomBodyWrapper:{
     marginTop:'11%'
 },
 description:{
    fontSize:13,fontWeight:'300',width:'90%',padding:5,alignSelf:'center',textAlign:'center'
 },
ordersCardsWrapper : {
  ...CommonStyles.flexDirectionRow,
  ...CommonStyles.justifySpaceBetween,
  paddingHorizontal:10
 },
 locationBox:{...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter,width:'80%',paddingLeft:5}
})

export default VendorProfileDetailScreen;
