import React from 'react';
import { Box, useDisclose, IconButton, Stagger, HStack } from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const FabFuel = ({goForm}) => {
  const { isOpen, onToggle } = useDisclose();
  const {bottom} = useSafeAreaInsets()
  
  return (
    <Box position="absolute" bottom={bottom + 5} right={3}>
      <Stagger
        visible={isOpen}
        initial={{
          opacity: 0,
          scale: 0,
          translateY: 34
        }} 
        animate={{
          translateY: 0,
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            mass: 0.8,
            stagger: {
              offset: 30,
              reverse: true
            }
          }
        }} 
        exit={{
          translateY: 34,
          scale: 0.5,
          opacity: 0,
          transition: {
            duration: 100,
            stagger: {
              offset: 30,
              reverse: true
            }
          }
        }}
      >
        <IconButton
          mb="4"
          variant="solid"
          bg="indigo.500"
          colorScheme="indigo" 
          borderRadius="full" 
          onPress={() => {
            goForm('travel')
            onToggle()
          }}
          icon={ <MaterialCommunityIcons
            name='car-traction-control'
            color={Colors.white}
            size={adjust(19)}
        />}
        />
        <IconButton
          mb="4"
          variant="solid"
          bg={Colors.succes}
         
          borderRadius="full" 
          onPress={() => {
            goForm('gas') 
            onToggle()
          }}
          icon={ <MaterialCommunityIcons
            name='gas-station'
            color={Colors.white}
            size={adjust(19)}
        />}
        />
      </Stagger>
      <HStack alignItems="center">
        <IconButton
          variant="solid" 
          borderRadius="full"
          size="lg"
          onPress={onToggle}
          bg="white" 
          icon={<MaterialCommunityIcons name='plus'  size={adjust(19)} color={'black'} />}
        />
      </HStack>
    </Box>
  );
}
