import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Box, HStack, Image, Text, VStack } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';

export const ItemCar = ({ data,handleModalizeDelete,isDisabled }) => {

  
    return (
        <Box  marginX={5} borderWidth={'1px'}  borderColor={'#DEDEDE'} borderRadius={'5px'} paddingX={'15px'}>
            <HStack space={4} alignItems={'center'} >
                <Image
                source={require('../assets/images/iconos/car.png')}
                alt='car'
                style={styles.car}
                resizeMode='contain'
                />

                <VStack>
                    <Text  style={CommonStyles.h2} >{data.maker.name}</Text>
                    <Text  style={CommonStyles.h2} >{data.model.name}</Text>
                </VStack>
                
            </HStack>
            <View  style={styles.delete}
            // justifyContent={'flex-end'}  
            // paddingBottom={'3px'}
            >
                <MaterialIcons name='delete'  color={'white'} size={20}/>
            </View>
            
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