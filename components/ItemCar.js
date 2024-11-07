import { Alert, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, Checkbox, HStack, Image, Switch, Text, VStack } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import { showToaster } from '../util/constants';
import axios from 'axios';
import { customer_api_urls } from '../util/api/api_essentials';
import { useInfoUser } from '../hooks/useInfoUsers';

export const ItemCar = ({ data, carActive, isDisabled }) => {
   
    const { getUserInfo, activeCar } = useInfoUser();
    

    

    const deleteCar = async (item) => {
        Alert.alert('Eliminar', `Estas a punto de eliminar ${item?.model?.name}`, [
            {
                text: 'Cancelar',
                onPress: () => {},
                style: 'cancel',
            },
            { text: 'Aceptar', onPress: () => fetchDeleteCar(item) },
        ]);
    };

    const fetchDeleteCar = async (car) => {
        try {
            if (data._id === carActive._id) {
                showToaster('No puedes quedarte sin vehículo principal, cambia de vehículo principal.')
                return
            }
            const apiCall = await axios.delete(`${customer_api_urls.delete_garage}/${car._id}`);

            if (apiCall.data.success) {
                getUserInfo();
                showToaster(apiCall?.data?.message);
            }
        } catch (error) {
            showToaster(error);
        }
    };

    const activarCarDefault = (item) => {
        Alert.alert('Activar', `Estas a punto de activar como default ${item?.model?.name}`, [
            {
                text: 'Cancelar',
                onPress: () => {},
                style: 'cancel',
            },
            { text: 'Aceptar', onPress: () => activeCar(item) },
        ]);
    };

    const handleSwitchChange = () => {
                
        if (data._id === carActive?._id) {
            showToaster('No puedes quedarte sin vehículo principal')
            return
        }
        activarCarDefault(data);
    };

    return (
        <Box
            marginX={5}
            marginY={'10px'}
            borderWidth={'1px'}
            borderColor={carActive?._id === data?._id ? Colors.succes : '#DEDEDE'}
            borderRadius={'5px'}
            paddingX={'15px'}

        >
            <HStack space={4} alignItems={'center'}>
                <Image
                    source={require('../assets/images/iconos/car.png')}
                    alt='car'
                    style={styles.car}
                    resizeMode='contain'
                />

                <VStack>
                    <Text style={CommonStyles.h2}>{data?.maker?.name}</Text>
                    <Text style={CommonStyles.h2}>{data?.model?.name}</Text>
                    <Text style={CommonStyles.h2}>{data?.model?.type?.type}</Text>
                    <Text style={CommonStyles.h2}>{data?.year}</Text>
                </VStack>
            </HStack>

            <Box style={styles.checkbox}>
                <RadioButton
                selected={carActive?._id === data?._id}
                onPress={() => handleSwitchChange(data)}
                />
               
            </Box>

            <TouchableOpacity
                style={styles.delete}
                onPress={() => deleteCar(data)}
            >
                <MaterialIcons name='delete' color={'white'} size={20} />
            </TouchableOpacity>
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
    car: {
        width: 100,
        height: 100,
    },
    delete: {
        position: 'absolute',
        bottom: 5,
        right: 10,
    },
    checkbox: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
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
});
