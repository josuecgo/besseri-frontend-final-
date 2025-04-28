import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { Box, Button, Text } from 'native-base'
import Colors from '../../util/styles/colors'
import { BtnPrincipal } from '../Customer/BtnPrincipal'

export const CardQuestion = ({questions}) => {

  return (
    <>

    <Box mx={2} >
        
        <Box
            borderWidth={1}
            borderColor={'#E5E5E5'}
            borderRadius={10}
            padding={3}
            marginBottom={2}
        >
            {
            questions.map((item,i) => {
               
                if(i >= 3 ) return null;
                return (
                    <Box
                        key={i}
                        borderWidth={1}
                        borderColor={'#E5E5E5'}
                        borderRadius={10}
                        padding={3}
                        marginBottom={2}
                    >
                        <Text color={Colors.textPrimary} >{item?.question}</Text>
                    </Box>
                )
            })  
        }

            <BtnPrincipal
            text={'¿Tienes alguna pregunta?'}
            />
            
        </Box>
    </Box>
     
    </>
  )
}


const styles = StyleSheet.create({})