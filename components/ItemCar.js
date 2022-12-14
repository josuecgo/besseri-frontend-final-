import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Box, HStack, VStack, Text, Spacer, Avatar, Radio } from 'native-base';

export const ItemCar = ({ data,handleModalizeDelete,isDisabled }) => {

    return (
        <>
            <Radio isDisabled={isDisabled}  value={data._id} my={1}>
             
            <TouchableOpacity
            onLongPress={() => handleModalizeDelete(data)}
            >
                <HStack
                    space={[2, 3]}
                    justifyContent="space-between"
                    marginX={30}
                >
                    <Avatar size="40px" source={require('../assets/images/categorias/carroceria.png')} />
                    <VStack>
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="coolGray.800" bold>
                            {data.model.name}
                        </Text>
                        <Text color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            {data.maker.name}
                        </Text>
                    </VStack>
                    <Spacer />
                    <Text fontSize="md" _dark={{
                        color: "warmGray.50"
                    }}
                        color="coolGray.800"
                        alignSelf="flex-start"
                    // justifyItems={'center'}
                    >
                        {data.year}
                    </Text>
                </HStack>
            </TouchableOpacity>

       
              </Radio>
             
        </>
       
    )
}



const styles = StyleSheet.create({})