import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import LoaderComponent from '../../components/Loader/Loader.component';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../util/styles/colors';
import {adjust, deviceHeight} from '../../util/Dimentions';
import {HeaderBackground} from '../../components/Background/HeaderBackground';
import CommonStyles from '../../util/styles/styles';
import InputFieldComponent from '../../components/input-field/input-field.component';
import { useForm } from '../../hooks/useForm';
import ButtonComponent from '../../components/button/button.component';
import { api_statuses, vendor_api_urls } from '../../util/api/api_essentials';
import axios from 'axios';
import { saveBusinessProfile } from '../../util/local-storage/auth_service';

export const EditProfile = ({navigation, route}) => {
    const [showLoader, setShowLoader] = useState(false);
    const {business} = route.params;
    let km = Math.round(business?.kmFree * 1.609)
    const {form, onChange} = useForm({
      id:business?._id,
      address: business?.address ,
      city: business?.city ,
      country: business?.country ,
      email : business?.email ,
      kmFree: km.toString(),
      logo : business?.logo ,
      state: business?.state ,
      storeName: business?.storeName ,
      account_id: business?.account_id 
  })

    
    
    const data = [
    {
        value: form.address,
        label: 'Direccion',
        inp: 'address',
        id: 1,
    },
    {
        value: form.city,
        label: 'Ciudad',
        inp:'city',
        id: 2,
    },
    {
        value: form.state,
        label: 'Estado',
        inp:'state',
        id: 3,
    },
    {
        value: form.country,
        label: 'País',
        inp:'country',
        id: 4,
    },
    {
        value: form.email,
        label: 'Email',
        inp:'email',
        id: 5,
    },
    {
        value: form.storeName,
        label: 'Tienda',
        inp:'storeName',
        id: 6,
    }
    ];
    
    const onChangeForm = async() => {
      try {
        
        const url = `${vendor_api_urls.edit_business_profile}/${form.account_id}`;
        let k = form.kmFree / 1.609
        const apiCall = await axios.put(url,{
          ...form,
          kmFree:parseFloat(k).toFixed(1)
        });
        
        if (apiCall.status == api_statuses.success) {
          await saveBusinessProfile(apiCall.data.data.store);
          navigation.goBack();
          
        }
      } catch (error) {
        // console.log(error);
      }
      
    }

    
    
    return (
    <>
      <View style={[styles.container]}>
        <LoaderComponent isVisible={showLoader} />
        <HeaderBackground />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <MaterialCommunityIcons
              name="keyboard-backspace"
              color={Colors.white}
              size={30}
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.textHeader}>Editar Perfil</Text>
          </View>

          <View style={{width: 20, height: 10}} />
        </View>

        <View style={styles.bottomBodyWrapper}>
          {data.map(item => (
            <View key={item.id}>
              <InputFieldComponent
              onChangeText={inputText => {
                onChange(inputText, item.inp);
              }}
              placeholderText={item.label}
              value={item.value}
              returnType="next"
              />
            </View>
          ))}

            <InputFieldComponent
              onChangeText={inputText => {
                onChange(inputText, 'kmFree');
              }}
              placeholderText={'Kilometros gratis'}
              value={form.kmFree}
              returnType="next"
              
            />
        </View>
        <ButtonComponent 
        buttonText={'Editar'}
        borderRadius={0}
        handlePress={onChangeForm}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.1,
    ...CommonStyles.flexDirectionRow,
    ...CommonStyles.justifySpaceBetween,
    ...CommonStyles.horizontalCenter,
    paddingHorizontal: 10,
  },
  textHeader: {
    color: Colors.white,
    fontSize: adjust(17),
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
  profileBgBanner: {
    width: '90%',
    height: 130,
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.bgColor,
    alignSelf: 'center',
    borderRadius: 20,
    top: 20,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 100 / 2,
    position: 'absolute',
    bottom: -40,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  storeNameText: {
    fontSize: 17,
    ...CommonStyles.fontFamily,
    textAlign: 'center',
  },
  bottomBodyWrapper: {
    marginTop: '11%',
  },
  description: {
    fontSize: 13,
    fontWeight: '300',
    width: '90%',
    padding: 5,
    alignSelf: 'center',
    textAlign: 'center',
  },
  ordersCardsWrapper: {
    ...CommonStyles.flexDirectionRow,
    ...CommonStyles.justifySpaceBetween,
    paddingHorizontal: 10,
  },
  locationBox: {
    ...CommonStyles.flexDirectionRow,
    ...CommonStyles.horizontalCenter,
    width: '80%',
    paddingLeft: 5,
  },
});
