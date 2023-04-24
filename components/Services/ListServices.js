import { FlatList, StyleSheet,  View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import {  Box,  HStack, Heading, Pressable, Stack ,Text} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { moneda } from '../../util/Moneda';



export const ListServices = ({ services,goService }) => {
  


  return (
    <View style={styles.list} >
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <Pressable
          onPress={() => goService(item)}
          >
          <Box alignItems="center">
            <Box 
            width={'100%'}
            rounded="lg" 
            overflow="hidden" 
            borderColor="coolGray.200" 
            borderWidth="1" 
            _light={{
              backgroundColor: "gray.50"
            }}>
              
              <Stack p="4" space={3}>
                <Stack space={2}>
                  <Heading size="md" ml="-1">
                    {item?.type_services?.name}
                  </Heading>
                  <Text fontSize="xs" 
                  fontWeight="500" ml="-0.5" mt="-1">
                    {item?.type_services?.type}.
                  </Text>
                  <Text fontSize="xs" 
                  fontWeight="500" ml="-0.5" mt="-1">
                  Autos tipo {item?.type_car?.type}.
                  </Text>
                </Stack>
                <HStack justifyContent={'space-between'} >
                  <MaterialIcons
                    name="explore"
                    color='black' 
                    
                    size={25}
                  />
                  <Text fontWeight="400">
                     {item.business_id.location.formatted_address}
                  </Text>
                </HStack>
                <HStack 
                alignItems="center" 
                space={4} 
                justifyContent="space-between"
                >
                  <HStack alignItems="center">
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="700">
                       {moneda(item?.price)}
                    </Text>
                  </HStack>
                  <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }} fontWeight="700">10 km de tu ubicación</Text>
                </HStack>
              </Stack>
            </Box>
          </Box>
          </Pressable>

        )}
        key={(item) => item._id}
      />
    </View>
  )
}



const styles = StyleSheet.create({
  list:{
    marginVertical:15
  }
})