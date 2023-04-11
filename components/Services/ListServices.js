import { FlatList, StyleSheet,  View } from 'react-native'
import React from 'react'
import { AspectRatio, Box, Center, HStack, Heading, Image, Pressable, Stack ,Text} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { moneda } from '../../util/Moneda';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants';

export const ListServices = ({ services,navigation }) => {
  


  return (
    <View style={styles.list} >
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <Pressable
          onPress={() => {
            navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.APPOINTMENT_SERVICES,{
            service:item
          })
        }}
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
              {/* <Box>
                <AspectRatio w="100%" ratio={16 / 9}>
                  <Image source={{
                    uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg"
                  }} alt="image" />
                </AspectRatio>
                <Center bg="violet.500" _dark={{
                  bg: "violet.400"
                }} _text={{
                  color: "warmGray.50",
                  fontWeight: "700",
                  fontSize: "xs"
                }} position="absolute" bottom="0" px="3" py="1.5">
                  PHOTOS
                </Center>
              </Box> */}
              <Stack p="4" space={3}>
                <Stack space={2}>
                  <Heading size="md" ml="-1">
                    {item?.type_services?.name}
                  </Heading>
                  <Text fontSize="xs" 
                  fontWeight="500" ml="-0.5" mt="-1">
                    {item?.type_services?.type}.
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