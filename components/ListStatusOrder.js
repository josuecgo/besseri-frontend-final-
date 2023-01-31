import React from 'react'
import { HStack, Text } from "native-base"
import { TouchableWithoutFeedback } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from "../util/styles/colors"

export const ListStatusOrder = ({item,onPress}) => {
  
  return (
    <TouchableWithoutFeedback
    onPress={onPress}
    >
      <HStack space={4} alignItems='center'>
        <MaterialCommunityIcons
          name={item.icon}
          size={30}
          color={Colors.primarySolid}
        />
        <Text fontWeight="400">
        {item.text}
        </Text>
      </HStack>
    </TouchableWithoutFeedback>
  )
}