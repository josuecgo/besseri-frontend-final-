import React, { useState } from 'react';
import {View,Text, useWindowDimensions,StyleSheet, TouchableOpacity, Linking, Alert, ActivityIndicator} from 'react-native';
import {getFormattedDate} from '../../util/utility-functions';
import personMockImage from '../../assets/images/person-mock-image.jpeg';
import Colors from '../../util/styles/colors';
import GraphComponent from '../../components/vendor-shared/graph.component';
import VendorScreenContainerComponent from '../../components/vendor-shared/vendor-screen-container-component';
import { useDispatch, useSelector } from 'react-redux';
import CommonStyles from '../../util/styles/styles';
import { getStoreEarnings } from '../../util/api/CommonFunctions';
import { getBusinessId, getBusinessProfile, saveBusinessProfile } from '../../util/local-storage/auth_service';
import { setEarnings } from '../../util/ReduxStore/Actions/VendorActions/BusinessProfleActions';
import { showToaster } from '../../util/constants';
import { useEffect } from 'react';
import axios from 'axios';
import { api_statuses, vendor_api_urls } from '../../util/api/api_essentials';
import * as BusinessProfileActions from '../../util/ReduxStore/Actions/VendorActions/BusinessProfleActions';

const VendorDashboardScreen = ({navigation, route}) => {
  const [loader,setLoader] = useState(false);

  const business_profile = useSelector(state => state?.businessActions);
  
  const action_message = useSelector(state => state.businessActions.actionMessage);
  const earnings = useSelector(state => state.businessActions.earnings);
  const [locationData,setLocation] = useState()
  const [businessDetails,setBusinessDetails] = useState(null);
 
  const dispatch = useDispatch();
 
  const paths = [
    {
      cardColor: Colors.terciarySolid,
      fillColor: Colors.terciarySolid,
      path: 'M0 64h6.7c6.6 0 20.3 0 33.3 37.3C53.3 139 67 213 80 213.3c13.3-.3 27-74.3 40-101.3 13.3-27 27-5 40 0 13.3 5 27-5 40-10.7 13.3-5.3 27-5.3 40-16 13.3-10.3 27-32.3 40 0 13.3 31.7 27 117.7 40 160 13.3 42.7 27 42.7 40 26.7 13.3-16 27-48 40-64 13.3-16 27-16 40-42.7 13.3-26.3 27-80.3 40-96C493.3 53 507 75 520 112c13.3 37 27 91 40 96 13.3 5 27-37 40-42.7 13.3-5.3 27 26.7 40 16 13.3-10.3 27-64.3 40-90.6C693.3 64 707 64 720 69.3c13.3 5.7 27 15.7 40 37.4 13.3 21.3 27 53.3 40 80 13.3 26.3 27 48.3 40 21.3 13.3-27 27-101 40-96 13.3 5 27 91 40 128 13.3 37 27 27 40-5.3 13.3-31.7 27-85.7 40-90.7 13.3-5 27 37 40 37.3 13.3-.3 27-42.3 40-58.6 13.3-15.7 27-5.7 40-10.7 13.3-5 27-27 40-21.3 13.3 5.3 27 37.3 40 64 13.3 26.3 27 48.3 40 26.6 13.3-21.3 27-85.3 40-117.3 13.3-32 27-32 40 5.3 13.3 37.7 27 111.7 40 149.4 13.3 37.3 27 37.3 40 0 13.3-37.7 27-111.7 33-149.4l7-37.3v288H0z',
      textColor: Colors.white,
      text: 'Ganancias Totales',
      figure: earnings?.total,
    },
    {
      cardColor: Colors.primarySolid,
      fillColor: Colors.primarySolid,
      path: 'M0,224L6.7,192C13.3,160,27,96,40,106.7C53.3,117,67,203,80,240C93.3,277,107,267,120,272C133.3,277,147,299,160,272C173.3,245,187,171,200,144C213.3,117,227,139,240,154.7C253.3,171,267,181,280,165.3C293.3,149,307,107,320,117.3C333.3,128,347,192,360,186.7C373.3,181,387,107,400,96C413.3,85,427,139,440,149.3C453.3,160,467,128,480,117.3C493.3,107,507,117,520,122.7C533.3,128,547,128,560,122.7C573.3,117,587,107,600,101.3C613.3,96,627,96,640,112C653.3,128,667,160,680,192C693.3,224,707,256,720,229.3C733.3,203,747,117,760,96C773.3,75,787,117,800,154.7C813.3,192,827,224,840,197.3C853.3,171,867,85,880,58.7C893.3,32,907,64,920,101.3C933.3,139,947,181,960,176C973.3,171,987,117,1000,128C1013.3,139,1027,213,1040,224C1053.3,235,1067,181,1080,176C1093.3,171,1107,213,1120,229.3C1133.3,245,1147,235,1160,208C1173.3,181,1187,139,1200,149.3C1213.3,160,1227,224,1240,256C1253.3,288,1267,288,1280,272C1293.3,256,1307,224,1320,202.7C1333.3,181,1347,171,1360,170.7C1373.3,171,1387,181,1400,202.7C1413.3,224,1427,256,1433,272L1440,288L1440,320L1433.3,320C1426.7,320,1413,320,1400,320C1386.7,320,1373,320,1360,320C1346.7,320,1333,320,1320,320C1306.7,320,1293,320,1280,320C1266.7,320,1253,320,1240,320C1226.7,320,1213,320,1200,320C1186.7,320,1173,320,1160,320C1146.7,320,1133,320,1120,320C1106.7,320,1093,320,1080,320C1066.7,320,1053,320,1040,320C1026.7,320,1013,320,1000,320C986.7,320,973,320,960,320C946.7,320,933,320,920,320C906.7,320,893,320,880,320C866.7,320,853,320,840,320C826.7,320,813,320,800,320C786.7,320,773,320,760,320C746.7,320,733,320,720,320C706.7,320,693,320,680,320C666.7,320,653,320,640,320C626.7,320,613,320,600,320C586.7,320,573,320,560,320C546.7,320,533,320,520,320C506.7,320,493,320,480,320C466.7,320,453,320,440,320C426.7,320,413,320,400,320C386.7,320,373,320,360,320C346.7,320,333,320,320,320C306.7,320,293,320,280,320C266.7,320,253,320,240,320C226.7,320,213,320,200,320C186.7,320,173,320,160,320C146.7,320,133,320,120,320C106.7,320,93,320,80,320C66.7,320,53,320,40,320C26.7,320,13,320,7,320L0,320Z',
      textColor: Colors.white,
      text: 'Canceladas',
      figure: earnings?.cancelled,
    },
  ];
  
  const geyMyEarningsAndData = async() => {
    try {
      const businessData = await getBusinessProfile();
      setBusinessDetails(businessData);
      const earnings = await getStoreEarnings(businessData?._id);
      dispatch(setEarnings(earnings));
    } catch(e) {
      console.log({earningsAndData:e})
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
    }
  }
  useEffect(() => {
    geyMyEarningsAndData();
  },[]);
  const createAccount = async() => {
    try {
      setLoader(true);
     const apiCall = await axios.post(vendor_api_urls?.create_stripe_account,{
      //  email:businessDetails?.email,
      email:businessDetails?.email,
      businessId:businessDetails?._id
     });
     setLoader(false);
     if(apiCall?.status == api_statuses?.success) {
       Linking.openURL(apiCall?.data?.link?.url);
       await saveBusinessProfile(apiCall?.data?.profile);
     }
    } catch(e) {
      setLoader(false);
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
    }
  }
  const getWalletDetails = async() => {
    try {
   if(!businessDetails) {
     return
   } else {
    const url = `${vendor_api_urls.get_stripe_account_details}/${businessDetails?.wallet_id}`;
    const apiCall = await axios.get(url);
    if(apiCall.status == api_statuses.success) {
      dispatch(BusinessProfileActions.setWalletDetails(apiCall.data.Data));
    }
    else {
      showToaster('Es necesario configurar tu cuenta de stripe para poder vender')
      return;
    }
   }
    } 
    catch(e) {
      console.log('line 38',e?.response?.data);
      showToaster('Perdón por la interrupción, esta solicitud falló')
    }
  }
  useEffect(() => {
    getWalletDetails();
  },[businessDetails]);

  return (
    <VendorScreenContainerComponent
    date={getFormattedDate()}
    screenHeading="Dashboard"
    business={businessDetails}
    imageSource={personMockImage}>
    <View style={{alignItems:'center'}} >
     {
       business_profile?.wallet?.charges_enabled && businessDetails?.wallet_id ? 
       null
       :
       <View style={styles.actionBg}>
       <Text style={styles.actionText}>{'Configure su cuenta comercial de Stripe para que pueda recibir pagos.'}</Text>
       <TouchableOpacity 
       onPress={createAccount}
       style={styles.actionButton}> 
         {
           loader? 
           <ActivityIndicator size={'small'} color='black'/>
           :
           <Text style={styles.actionButtonText}>Setup</Text>
         }
       </TouchableOpacity>
     </View>
     }
      {paths.map((card, index) => {
        return (
          <GraphComponent
            key={index}
            fillColor={card.fillColor}
            pathString={card.path}
            cardColor={card.cardColor}
            textColor={card.textColor}
            text={card.text}
            earning={card.figure}
          />
        );
      })}
    </View>
  </VendorScreenContainerComponent>
);
};
const styles = StyleSheet.create({
actionBg:{
  width:'100%',
  padding:16,
  borderWidth:1,
  top:10,
  borderRadius:10,
  backgroundColor:Colors.lightRed,
  borderColor:Colors.lightRed
},
actionText:{color:Colors.darker,fontWeight:'300'},
actionButton:{
  paddingHorizontal:10,
  borderWidth:1,
  borderColor:Colors.alertRed,
  backgroundColor:Colors.alertRed,
  ...CommonStyles.flexCenter,
  alignSelf:'flex-end',
  padding:5,
  borderRadius:4
},
actionButtonText:{
  fontWeight:'300'
}
})

export default VendorDashboardScreen;
