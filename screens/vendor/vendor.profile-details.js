import React, { useEffect, useState } from 'react';
import {Dimensions, Image,Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import { ThinlineSeparator,MenuItem, Heading, OrderCard } from '../../components/CommonComponents';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getBusinessProfile} from '../../util/local-storage/auth_service';
import Loader from '../../components/Loader/Loader.component'
import {useRoute} from '@react-navigation/native';
import { base_url } from '../../util/api/api_essentials';
const { width,height } = Dimensions.get('screen');
const VendorProfileDetailScreen = ({navigation, route}) => {
  const [showLoader,setShowLoader] = useState(false);
  const {params} = useRoute();
  const [business,setBusiness] = useState(null);
  const profile = params.data;
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
    getBusinessData()
  },[]);
  return (
   <View style={styles.container}>
     <Loader isVisible={showLoader}/>
    <View style={styles.header}> 
    <TouchableOpacity onPress={() => navigation.pop()}>
        <MaterialCommunityIcons name='keyboard-backspace' color={Colors.darker} size={30}/>
    </TouchableOpacity>
    <TouchableOpacity>
        <AntDesign name='setting' color={Colors.darker} size={27}/>
    </TouchableOpacity>
    </View>

    <View style={styles.profileBgBanner}>
     <Image
     source={{uri:`${base_url}/${business?.logo}`}}
     style={styles.profileImg}
     />
    </View>

    <View style={styles.bottomBodyWrapper}>
        <Text style={styles.storeNameText}>{profile?.storeName}</Text>
        {/* <Text style={styles.description}>We are an autoparts selling company, selling autoparts since 1990, we have proven that we provide quality product in a resonable price, our return policies and customer trust is known in world.</Text> */}
        <View>
            {/* <ThinlineSeparator margin={15} width={'95%'}/>
           <View style={styles.ordersCardsWrapper}>
           <OrderCard
            label='Pending'
            count='5'
            />
            <OrderCard
            label='Current'
            count='5'
            />
            <OrderCard
            label='Cancelled'
            count='5'
            />
           </View> */}
           <ThinlineSeparator margin={15} width={'95%'}/>
           <Heading
           text='Contact Info'
           />
           <Text style={commonTextStyle}>{profile?.email}</Text>
           <ThinlineSeparator margin={15} width={'95%'}/>
           <Heading text='Location & Address'/>
          
          <View style={styles.locationBox}>
           <Entypo name='location-pin' color='red' size={30}/>
           <Text style={CommonStyles.fontWeight300}>{profile?.address}</Text>
          </View> 

           

        </View>
    </View>


  
   
   </View>
  );
};
const styles = StyleSheet.create({
 container:{
   flex:1,
   backgroundColor:Colors.white
 },
 header:{
   width:'100%',
   height:65,
   borderWidth:1,
   borderColor:Colors.white,
   backgroundColor:Colors.white,
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
     borderColor:Colors.primaryColor,
     backgroundColor:Colors.primaryColor,
     alignSelf:'center',
     borderRadius:20
 },
 profileImg:{
     width:100,
     height:100,
     borderWidth:1,
     borderColor:'transparent',
     borderRadius:100/2,
     position:'absolute',
     bottom:-40,
     alignSelf:'center',
     resizeMode:'cover'
 },
 storeNameText:{
     fontSize:17,
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
