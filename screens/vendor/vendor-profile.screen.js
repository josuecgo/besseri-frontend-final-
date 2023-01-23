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
import { MAIN_ROUTES, VENDOR_DETAILS_ROUTES } from '../../util/constants';
import { useSelector } from 'react-redux';
import { deviceHeight } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';
import TopHeader from '../../components/Background/TopHeader';
import { useContext } from 'react';
import { ChatContext } from '../../util/context/Chat/ChatContext';
import { Badge } from '../../components/Badge';


const VendorProfileScreen = ({navigation}) => {
  const [businessProfileData,setBusinessProfileData] = useState(null);
  const [showLoader,setShowLoader] = useState(false);
  const earnings = useSelector(state => state.businessActions.earnings);
  const { newsChats  } = useContext(ChatContext);
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

  const goChatsScreen = () => {

    navigation.navigate(MAIN_ROUTES.CHATSCREEN);

    
  }
  
  useEffect(() => {
    navigation.addListener('focus', () => {
      getBusinessData();
    });
  },[]);

  return (
    <View style={[styles.container]}>
    <Loader isVisible={showLoader} />
    
    <TopHeader>
      <Text style={commonTextStyle} >{businessProfileData?.storeName}</Text>
    </TopHeader>
    

    

    <ScrollView contentContainerStyle={{flexGrow: 1,marginHorizontal:10}}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_PROFILE_DETAIL, {
            data: businessProfileData,
          })
        }
        activeOpacity={0.9}
        style={styles.profileBtn}>
        <Text style={commonTextStyle}>Perfil de trabajo</Text>
      </TouchableOpacity>
      <ThinlineSeparator margin={5} borderWidth={0.2}  borderColor={Colors.textPrimary} />
      <MenuItem
        label="Chats"
        value={<Badge count={newsChats} />}
        icon={
          <MaterialIcons name="chat" color={Colors.white} size={20} />
        }
        onPress={goChatsScreen}
      />
      
      <ThinlineSeparator margin={5} borderWidth={0.2} />
      <Heading text="Ganancias" />
      <MenuItem
        label="Ganancias de hoy"
        value={ moneda(earnings?.todays) + ` MXN`}
        icon={
          <MaterialIcons name="attach-money" color={Colors.white} size={25} />
        }
      />
      <MenuItem
        label="Ganancias canceladas"
        value={ moneda(earnings?.cancelled) +` MXN`}
        icon={<Entypo name="line-graph" color={Colors.white} size={16} />}
      />
      <MenuItem
        label="Ganancias Totales"
        value={ moneda(earnings?.total) +  ` MXN`}
        icon={<FontAwesome5 name="coins" color={Colors.white} size={17} />}
      />
      <ThinlineSeparator margin={15}  borderWidth={0.2} />
      <Heading text="Ajustes" />
      <MenuItem
        onPress={() =>
          navigation.navigate(VENDOR_DETAILS_ROUTES.VENDOR_SETTINGS)
        }
        label="App Settings"
        icon={<AntDesign name="setting" color={Colors.white} size={25} />}
      />

      <MenuItem
        label="Estado de la cuenta"
        value={'Active'}
        icon={
          <MaterialCommunityIcons
            name="progress-alert"
            color={Colors.white}
            size={25}
          />
        }
      />
      <ThinlineSeparator margin={5} borderWidth={0.2} />
      <Heading text="Servicio de asistencia" />
      <MenuItem
        label="Soporte"
        onPress={() =>
          Linking.openURL(
            'mailto:soporte@besseri.com?subject=Customer Support Ticket',
          )
        }
        icon={
          <MaterialIcons
            name="support-agent"
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
  container: {
      flex: 1,
      // backgroundColor: Colors.white,
      
  },
  header: {
      width: '100%',
      height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
      //  borderWidth:1,
      ...CommonStyles.horizontalCenter,
      justifyContent:'center'
  },
  profileBtn: {
      width: '95%',
      height: 55,
      borderWidth: 1,
      borderColor: Colors.brightBlue,
      backgroundColor: Colors.brightBlue,
      ...CommonStyles.verticalCenter,
      ...CommonStyles.horizontalCenter,
      borderRadius: 3,
      alignSelf: 'center',
      margin: 10,
  },
});
export default VendorProfileScreen;
