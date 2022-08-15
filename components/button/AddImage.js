import { View, Text, ImageBackground, Pressable,StyleSheet } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCropPicker from 'react-native-image-crop-picker';
import Colors from '../../util/styles/colors';
import { showToaster } from '../../util/constants';


export const AddImage = ({logo,setLogo}) => {
   

    const pickLogo = () => {
        ImageCropPicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        }).then(res => {
          
          setLogo(res);
        }).catch(e => {
          showToaster('Algo salio mal')
        })
    }
    
    return (
        <View style={styles.card}>
        {
            logo ? 
            <ImageBackground source={{uri:logo?.path}} style={{width:70,height:70}} imageStyle={{borderRadius:5}}>
                <View style={styles.btnImg}> 
                    <Pressable onPress={pickLogo}>
                        <Ionicons name='pencil' color='white' size={25}/>
                    </Pressable>
                </View>
            </ImageBackground>
            :
            <Pressable 
            onPress={pickLogo}
            style={styles.btnAdd}
            >
                <Ionicons name='add-outline' color='white' size={25}/>

            </Pressable>
        }
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        width:90,
        height:90,
        borderWidth:1,
        borderColor:Colors.brightBlue,
        backgroundColor:Colors.brightBlue,
        borderRadius:10,
        marginVertical:4,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        padding:5,
        margin:5
    },
    btnAdd:{
        width:90,
        height:90,
        borderColor:'white',
        borderWidth:1,
        borderRadius:1,
        borderStyle:'dashed',
        justifyContent:'center',
        alignItems:'center',
        
    },
    btnImg:{flex:1,backgroundColor:'rgba(0,0,0,0.1)',justifyContent:'center',alignItems:'center'}
})