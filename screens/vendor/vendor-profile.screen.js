import React, { useEffect, useState } from 'react';
import {Dimensions, Text, StyleSheet, TouchableOpacity, View, ScrollView,Linking} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import { ThinlineSeparator,MenuItem, Heading } from '../../components/CommonComponents';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getBusinessProfile} from '../../util/local-storage/auth_service';
import Loader from '../../components/Loader/Loader.component'
import { VENDOR_DETAILS_ROUTES } from '../../util/constants';
import { useSelector } from 'react-redux';
const { width,height } = Dimensions.get('screen');
const VendorProfileScreen = ({navigation}) => {
  const [businessProfileData,setBusinessProfileData] = useState(null);
  const [showLoader,setShowLoader] = useState(false);
  const earnings = useSelector(state => state.businessActions.earnings);
  const commonTextStyle = {
    fontSize:18,
   fontWeight:'bold',
   color:Colors.white
  }
  const getBusinessData = async() => {
    setShowLoader(true);
    const businessData = await getBusinessProfile();
    setBusinessProfileData(businessData);
    setShowLoader(false);
  }
  
  useEffect(() => {
    getBusinessData();
  },[]);
  return (
   <View style={styles.container}>
     <Loader isVisible={showLoader}/>
    <View style={styles.header}> 
    <Text style={commonTextStyle}>{businessProfileData?.storeName}</Text>
    </View>

  <ScrollView contentContainerStyle={{flexGrow:1}}>
  <TouchableOpacity 
   onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_PROFILE_DETAIL,{data:businessProfileData})}
   activeOpacity={0.9} style={styles.profileBtn}>
   <Text style={commonTextStyle}>Business profile</Text>
   </TouchableOpacity>
   <ThinlineSeparator margin={5}/>
   <Heading text='Earnings'/>
   <MenuItem
   label='Todays Earnings'
   value={`${earnings.todays} MXN`}
   icon={
     <MaterialIcons
     name='attach-money'
     color={Colors.white}
     size={25}
     />
   }
   />
    <MenuItem
   label='Cancelled Earnings'
   value={`${earnings?.cancelled} MXN`}
   icon={
     <Entypo
     name='line-graph'
     color={Colors.white}
     size={16}
     />
   }
   />
    <MenuItem
   label='Total Earnings'
   value={`${earnings?.total} MXN`}
   icon={
     <FontAwesome5
     name='coins'
     color={Colors.white}
     size={17}
     />
   }
   />
      <ThinlineSeparator margin={15}/>
      <Heading text='Settings'/>
      <MenuItem
      onPress={() => navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_SETTINGS)}
   label='App Settings'
   icon={
     <AntDesign
     name='setting'
     color={Colors.white}
     size={25}
     />
   }
   />
   
   
    <MenuItem
   label='Account Status'
   value={'Active'}
   icon={
     <MaterialCommunityIcons
     name='progress-alert'
     color={Colors.white}
     size={25}
     />
   }
   />
      <ThinlineSeparator margin={10}/>
   <Heading text='Help & Support'/>
   <MenuItem
   label='Support'
   onPress={() => Linking.openURL('mailto:soporte@besseri.com?subject=Customer Support Ticket')}
   icon={
     <MaterialIcons
     name='support-agent'
     color={Colors.white}
     size={25}
     />
   }
   />
  </ScrollView>
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
   borderColor:Colors.primaryColor,
   backgroundColor:Colors.primaryColor,
   ...CommonStyles.horizontalCenter,
   ...CommonStyles.verticalCenter
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

})
export default VendorProfileScreen;
