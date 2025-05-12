import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { Box, Button, Text } from 'native-base'
import Colors from '../../util/styles/colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export const CardQuestion = ({questions,onPress}) => {
    let emptyQuestion = questions.length > 0
    

  return (
    <>

    <Box  >
        
        <Box
        
            padding={3}
            marginBottom={2}
        >
            {

            emptyQuestion && questions.map((item,i) => {
               
                if(i >= 3 ) return null;
                return (
                    <Box
                        key={i}
                       
                        marginBottom={2}
                        flexDirection={'row'}
                        alignItems={'center'}
                        
                    >
                        <MaterialCommunityIcons name='frequently-asked-questions' color={Colors.black} size={20}  />
                        <Text paddingX={1} color={Colors.black} >{item?.title}</Text>
                    </Box>
                )
            })  
        }

            <Button
            // text={'¿Tienes alguna pregunta?'}
            variant={'link'}
            onPress={onPress}

            >
               {emptyQuestion ?  'Ver mas' : 'Preguntar'}
            </Button>
            
        </Box>
    </Box>
     
    </>
  )
}


const styles = StyleSheet.create({})