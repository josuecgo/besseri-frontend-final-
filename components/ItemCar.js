import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Box, HStack, Image, Text, VStack } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import { showToaster } from '../util/constants';
import axios from 'axios';
import { customer_api_urls } from '../util/api/api_essentials';
import { useInfoUser } from '../hooks/useInfoUsers';

export const ItemCar = ({ data,handleModalizeDelete,isDisabled }) => {

    const { getUserInfo,activeCar } = useInfoUser()

    const deleteCar = async(item) => {
     
        Alert.alert('Eliminar', `Estas a punto de eliminar ${item?.model?.name}`, [
            {
              text: 'Cancelar',
              onPress: () => {},
              style: 'cancel',
            },
            {text: 'Aceptar', onPress: () => fetchDeleteCar(item)},
        ]);
    }

    const fetchDeleteCar = async(car) => {
        try {

            const apiCall = await axios.delete(`${customer_api_urls.delete_garage}/${car._id}`);

            if (apiCall.data.success) {
                getUserInfo();
                showToaster(apiCall?.data?.message);
            }
        } catch (error) {
            
            showToaster(error)
        }
    }

    const activarCarDefault = (item) => {
        Alert.alert('Activar', `Estas a punto de activar como default ${item?.model?.name}`, [
            {
              text: 'Cancelar',
              onPress: () => {},
              style: 'cancel',
            },
            {text: 'Aceptar', onPress: () => activeCar(item)},
        ]);
    }

   
    return (
        <Box  
        marginX={5} 
        marginY={'10px'}
        borderWidth={'1px'}  
        borderColor={'#DEDEDE'} 
        borderRadius={'5px'} 
        paddingX={'15px'}
        
        >
            <TouchableOpacity
            onLongPress={() => activarCarDefault(data)}
            >
                <HStack space={4} alignItems={'center'} >
                    <Image
                    source={require('../assets/images/iconos/car.png')}
                    alt='car'
                    style={styles.car}
                    resizeMode='contain'
                    />

                    <VStack>
                        <Text  style={CommonStyles.h2} >{data?.maker?.name}</Text>
                        <Text  style={CommonStyles.h2} >{data?.model?.name}</Text>
                        <Text  style={CommonStyles.h2} >{data?.model?.type?.type}</Text>
                        <Text  style={CommonStyles.h2} >{data?.year}</Text>
                    </VStack>
                    
                </HStack>
            </TouchableOpacity>
            

            <TouchableOpacity  
            style={styles.delete}
            onPress={() => deleteCar(data)}
            // justifyContent={'flex-end'}  
            // paddingBottom={'3px'}
            >
                <MaterialIcons name='delete'  color={'white'} size={20}/>
            </TouchableOpacity>
            
        </Box> 
       
           
       
       
    )
}



const styles = StyleSheet.create({
    body:{
        borderWidth:1,
        borderColor:Colors.red,
        marginHorizontal:100,
        width:100,
        height:100,
        backgroundColor:'red'
    },
    car:{
        width:100,
        height:100,
    
    },
    delete:{
        position:'absolute',
        bottom:5,
        right:10
    }
})

//  {/* <Radio isDisabled={isDisabled}  value={data._id} my={1}>
             
//                 <TouchableOpacity
//                 onLongPress={() => handleModalizeDelete(data)}
            
//                 >
//                     <HStack
//                         space={[2, 3]}
//                         justifyContent="center"
//                         alignItems={'center'}
//                         // marginX={30}
//                     >
//                         <MaterialIcons 
//                         name='directions-car'  
//                         size={40} 
                        
//                         />
//                         {/* <VStack> */}
//                         <Text _dark={{
//                             color: "warmGray.50"
//                         }} color="coolGray.800" bold>
//                             {data.model.name}
//                         </Text>
//                         <Text color="coolGray.600" _dark={{
//                             color: "warmGray.200"
//                         }}>
//                         {data.maker.name} {data.year}
//                         </Text>
                    
//                     {/* </VStack> */}
//                     <Spacer />
                
//                 </HStack>
//             </TouchableOpacity>

   
//         </Radio>
//           */}