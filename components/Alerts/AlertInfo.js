import React from 'react'
import { Alert, HStack, VStack,Text, Box, CloseIcon, IconButton } from 'native-base';

export const AlertInfo = ({show,setShow}) => {
 
  return (
    <Alert 
    style={{alignItems:'center',justifyContent:'center',marginHorizontal:10}}
    maxW="350" status="error">
          <VStack space={1} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text fontSize="md" fontWeight="medium" _dark={{
                color: "coolGray.800"
              }}>
                  Oops!
                </Text>
              </HStack>
              <IconButton variant="unstyled" _focus={{
              borderWidth: 0
            }} icon={<CloseIcon size="3" />} _icon={{
              color: "coolGray.600"
            }} onPress={() => setShow({view:false,msg:''})} />
            </HStack>
            <Box pl="6" _dark={{
            _text: {
              color: "coolGray.600"
            }
          }}>
            {show.msg}
            </Box>
          </VStack>
    </Alert>
  )
}

