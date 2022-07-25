import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../../util/styles/colors';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants';
import ButtonComponent from '../../../components/button/button.component';
import CommonStyles from '../../../util/styles/styles';


export const ExploreScreen = (props) => {
  return (
   
    <View style={styles.content}>
        <View style={styles.icono}>
            <FontAwesome5 name='shopping-cart' color={Colors.info} size={70}/>
        </View>
        <Text style={styles.texto}>Tu carrito está vacío :/</Text>
        <Text style={styles.subtitulo}>Explora productos y añádelos al carrito</Text>
        <ButtonComponent
        buttonText={'Explore'}
        colorB={Colors.terciarySolid}
        borderRadius={10}
        width={200}
        margin={20}
        handlePress={() => props.navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)}
        />
    </View>
    
  )
}


const styles = StyleSheet.create({
    content:{
        flex:1,justifyContent:'center',alignItems:'center'
    },
    icono:{
        width:200,
        height:200,
        borderWidth:1,
        borderColor:Colors.lightPrimary,
        backgroundColor:Colors.bgColor,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:200/2
    },
    texto:{...CommonStyles.fontFamily,fontSize:25,color:Colors.info},
    subtitulo:{...CommonStyles.fontFamily,color:'grey',marginVertical:5},


})