import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Box, HStack, VStack, Text, Spacer, Avatar, Radio } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const ItemCar = ({ data,handleModalizeDelete,isDisabled }) => {

    return (
        <>
            <Radio isDisabled={isDisabled}  value={data._id} my={1}>
             
                <TouchableOpacity
                onLongPress={() => handleModalizeDelete(data)}
            
                >
                    <HStack
                        space={[2, 3]}
                        justifyContent="center"
                        alignItems={'center'}
                        // marginX={30}
                    >
                        <MaterialIcons 
                        name='directions-car'  
                        size={40} 
                        
                        />
                        {/* <VStack> */}
                            <Text _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" bold>
                                {data.model.name}
                            </Text>
                            <Text color="coolGray.600" _dark={{
                                color: "warmGray.200"
                            }}>
                            {data.maker.name} {data.year}
                            </Text>
                        
                        {/* </VStack> */}
                        <Spacer />
                    
                    </HStack>
                </TouchableOpacity>

       
            </Radio>
             
        </>
       
    )
}



const styles = StyleSheet.create({})