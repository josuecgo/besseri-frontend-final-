import React from 'react'
import { Box, HStack, Text, VStack } from 'native-base'
import { SemaforoChecks } from '../SemaforoChecks'
import Colors from '../../util/styles/colors'

export const CardCheck = ({value,label}) => {

    
    return (
        <Box
            borderWidth={0.1}
            borderColor={Colors.textSecundary}
            rounded={'sm'}
            p={'3'}
            my={1}
        >

            <HStack space={4} alignItems={'center'} justifyContent={'space-between'} >
                <VStack>
                    <Text style={{
                        color:Colors.primaryColor
                    }} >{label}</Text>
                    <Text style={{
                        color:Colors.textSecundary
                    }} textTransform={'capitalize'} >Estado: <Text bold >{value}</Text></Text>
                </VStack>

                <SemaforoChecks value={value} />
            </HStack>
        </Box>
    )
}



