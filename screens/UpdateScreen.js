import { Linking, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopCircleComponent from '../components/top-circle/top-circle.component'
import { Box, Button, Divider } from 'native-base'
import { deviceWidth } from '../util/Dimentions'
import Colors from '../util/styles/colors'

export const UpdateScreen = () => {

    const goStore = () => {
        
        if (Platform.OS === 'ios') {
            const link ='itms-apps://apps.apple.com/gb/app/besseri/id1620093585';
            Linking.canOpenURL(link).then(supported => {
                supported && Linking.openURL(link);
            }, (err) => console.log(err));
        }else{
            Linking.openURL(
                'http://play.google.com/store/apps/details?id=com.besseri'
            );
        }
       
       
        // let url = 'itms-apps://apps.apple.com/gb/app/besseri/id1620093585'
        // Linking.openURL(url)
    }
    return (
        <>
            <TopCircleComponent/>
            <View style={styles.container} >
        
                
                <Box 
                maxW="80" 
                rounded="lg" 
                overflow="hidden" 
                borderColor="coolGray.200" 
                borderWidth="1"
                style={styles.card}
                >
                    <Text>Hay una nueva version disponible, por favor actualice la aplicacion</Text>

                    <View style={{marginTop:deviceWidth * 0.15}} >
                        <Divider/>
                        <Button 
                        size="md" variant="ghost" 
                        onPress={goStore}
                        > 
                            Actualizar 
                        </Button>
                    </View>
                    
                </Box>
            </View>
        </>
        
    )
}



const styles = StyleSheet.create({
    container:{
        flex:1,justifyContent:'center',alignItems:'center',
        backgroundColor:Colors.bgColor
    },
    card:{
        width:deviceWidth - 30,
        padding:10,
        height:deviceWidth / 2,
        justifyContent:'flex-end',
        backgroundColor:Colors.white
    }
})