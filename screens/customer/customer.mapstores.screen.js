import React, { useState,useEffect } from "react";
import { FlatList, Image, PermissionsAndroid, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import MapView,{Circle} from "react-native-maps";
import Feather from 'react-native-vector-icons/Feather'
import Colors from '../../util/styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { api_statuses, base_url, customer_api_urls } from "../../util/api/api_essentials";
import axios from "axios";
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from "../../util/constants";
import CommonStyles from '../../util/styles/styles';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Geolocation from "@react-native-community/geolocation";
export default function CustomerMapStores(props) {
  const {width} = useWindowDimensions()
  const [stores,setstores] = useState([]);
  const [location,setLocation] = useState(null);

 

  const getLocationIOS = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
          getStores(position.coords);
      },
      (error) => alert(error.message),
    
    );
    const watchID = Geolocation.watchPosition((position) => {
      const currentLatitude = JSON.stringify(position.coords.latitude);
      const currentLongitude = JSON.stringify(position.coords.longitude);
    //   setCoords({
    //     latitude:currentLatitude,
    //     longitude:currentLongitude
    // })
    });
    setWatchID(watchID);
  }

  const getLocation = async() => {
    if (Platform.OS === 'ios') {
      getLocationIOS();
      return
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Besseri',
          'message': 'Besseri needs location to show you nearby stores'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(position => {
          setLocation(position.coords);
          getStores(position.coords);
        })
      } else {
        console.log("location permission denied")
        showToaster("Location permission denied");
      }
    } catch(e) {
        showToaster('Couldnt get your location')
    }
  }
  const getStores = async(location) => {
    try {
      const apiCall = await axios.post(`${customer_api_urls.get_stores}`,{
        startlat:location?.latitude,
        startlng:location?.longitude,
        range:30
      });
      if(apiCall.status == api_statuses.success) {
        console.log(apiCall.data.data)
       setstores(apiCall.data.data);
      } else {
        showToaster('something went wrong');
      }
    
    } catch(e) {
       showToaster('Something went wrong please try again');
    }
  }
  useEffect(() => {
    getLocation()
  },[]);
  const StoreCard = ({data}) => {
    return (
      <View style={{width:width - 20,minHeight:250,padding:10,borderRadius:10,backgroundColor:'white',alignSelf:'center',marginHorizontal:10}}>
        <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter}}>
          <Image
          source={{uri:`${base_url}/${data?.logo}`}}
          style={{width:45,height:45,borderRadius:45/2}}
          />
          <TouchableOpacity activeOpacity={0.8} 
          onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.STORE_SCREEN,{data:data})}
          style={{paddingLeft:15}}>
            <Text style={{...CommonStyles.fontFamily,color:'black'}}>{data?.storeName}</Text>
            <Text style={{fontWeight:'300',color:'grey',fontSize:13}}>{'Autoparts store'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{paddingLeft:5,marginTop:15}}>
            <Text style={{color:'grey',fontSize:13}}>{'Email'}</Text>
            <Text style={{...CommonStyles.fontFamily,color:'black'}}>{data?.email}</Text>
            </View>

        <View style={{paddingLeft:5,marginTop:10}}>
            <Text style={{color:'grey',fontSize:13}}>{'Address'}</Text>
            <Text style={{...CommonStyles.fontFamily,color:'black'}}>{data?.address}</Text>
            </View>

            <View style={{flex:1}}>
              <TouchableOpacity
                        onPress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.STORE_SCREEN,{data:data})}
              style={{alignSelf:'flex-end',position:'absolute',bottom:5,margin:10,width:35,height:35,borderWidth:1,borderColor:Colors.brightBlue,backgroundColor:Colors.brightBlue,justifyContent:'center',alignItems:'center',borderRadius:35/2}}
              >
                <Ionicons
                name='navigate'
                color={Colors.white}
                size={15}
                />
              </TouchableOpacity>
            </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
    {/*Render our MapView*/}
      {
        location?.latitude && location?.longitude ? 
        <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude:location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Circle 
        radius={600}
        center={{
          latitude:location?.latitude,
          longitude: location?.longitude,
        }}
        fillColor={Colors.primaryColor}
        strokeColor={'#F7E3BD'}
        strokeWidth={10}
        />
        </MapView>
        :
        null
      }
      <View style={{flex:1,width:'100%'}}>
      {/* <View
      style={{
        width:'90%',
        height:55,
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'white',
        alignSelf:'center',
        marginTop:'10%',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
      }}
      >
       <View style={{flexDirection:'row',alignItems:'center'}}>
       <TouchableOpacity
       onPress={() => {
         props.navigation.goBack()
       }}
       >
          <MaterialCommunityIcons
          name='keyboard-backspace'
          color='black'
          size={25}
          style={{paddingLeft:10}}
          />
        </TouchableOpacity>
      <TextInput
       placeholder="Search"
       placeholderTextColor={'black'}
       style={{color:'black',paddingLeft:10,fontSize:15}}
       />
       </View>
       
      </View> */}
      <View style={{flex:1,position:'absolute',bottom:10,alignSelf:'center',paddingLeft:5}}>
        <FlatList
        contentContainerStyle={{flexGrow:1}}
        data={stores}
        horizontal
        keyExtractor={item => item?._id}
        renderItem={itemData => (
          <StoreCard
          data={itemData.item}
          />
        )}
        />
      </View>
      </View>
    </View>
  );
}
//create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});