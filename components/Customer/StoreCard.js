import {StyleSheet, Text, View,Image,TouchableOpacity} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'

import {deviceWidth} from '../../util/Dimentions';
import CommonStyles from '../../util/styles/styles';
import { base_url } from '../../util/api/api_essentials';
import Colors from '../../util/styles/colors';

export const StoreCard = ({data,goStore,openMaps}) => {
 
  return (
    <View style={styles.card}>
      <View
        style={{
          ...CommonStyles.flexDirectionRow,
          ...CommonStyles.horizontalCenter,
        }}>
        <Image
          source={{uri: `${base_url}/${data?.logo}`}}
          style={styles.img}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goStore}
          style={{paddingLeft: 15}}>
          <Text style={{...CommonStyles.fontFamily, color: 'black'}}>
            {data?.storeName}
          </Text>
          <Text style={{fontWeight: '300', color: 'grey', fontSize: 13}}>
            {'Autoparts store'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={{color: 'grey', fontSize: 13}}>{'Email'}</Text>
        <Text style={{...CommonStyles.fontFamily, color: 'black'}}>
          {data?.email}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={{color: 'grey', fontSize: 13}}>{'Dirección'}</Text>
        <Text style={{...CommonStyles.fontFamily, color: 'black'}}>
          {data?.address}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={{color: 'grey', fontSize: 13}}>{'Ciudad'}</Text>
        <Text style={{...CommonStyles.fontFamily, color: 'black'}}>
          {data?.city}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={{color: 'grey', fontSize: 13}}>{'Estado'}</Text>
        <Text style={{...CommonStyles.fontFamily, color: 'black'}}>
          {data?.state}
        </Text>
      </View>
       
      <TouchableOpacity
      onPress={() => openMaps( parseFloat(data?.location.latitude), parseFloat(data.location.longitude) )}
      style={styles.openMaps}
      >

        <Ionicons name="map" color={Colors.primarySolid} size={20} />
        <Text style={{color: 'grey', fontSize: 13,marginHorizontal:5}} >Abrir Mapa</Text>
      </TouchableOpacity>
      <View style={{flex: 1}}>
       
        <TouchableOpacity
          onPress={goStore}
          style={styles.btnNavigate}>
          <Ionicons name="navigate" color={Colors.white} size={15} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: deviceWidth - 20,
    minHeight: 250,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  titulo:{paddingLeft: 5, marginTop: 15},
  img:{width: 45, height: 45, borderRadius: 45 / 2},
  btnNavigate:{
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 5,
    margin: 10,
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: Colors.brightBlue,
    backgroundColor: Colors.brightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35 / 2,
  },
  openMaps:{
    marginVertical:10,
    flexDirection:'row',
    alignItems:'center',
    // justifyContent:'space-evenly'
  }
});
