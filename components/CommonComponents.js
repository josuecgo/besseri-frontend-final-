import React from 'react';
import {TouchableOpacity, Text, View, Dimensions, Pressable, ScrollView} from 'react-native';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modalize } from 'react-native-modalize';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InputFieldComponent from './input-field/input-field.component';
import Ionicons from 'react-native-vector-icons/Ionicons'
import KEYBOARD_TYPES from '../util/keyboard-types';
import ButtonComponent from './button/button.component';
export const ThinlineSeparator = ({margin,width}) => {
    const style = {
        width:width ? width : '100%',
        borderWidth:0.3,
        borderColor:Colors.dark,
        marginVertical:margin ? margin : 1,
        alignSelf:'center'
    }
  return (
  <View style={style}/>
  );
};

export const MenuItem = (props) => {
    const styles = {
        mainStyle:{
            width:'95%',
            minHeight:55,
            ...CommonStyles.flexDirectionRow,
            ...CommonStyles.horizontalCenter,
            ...CommonStyles.justifySpaceBetween,
            // paddingHorizontal:15,
            alignSelf:'center'
        },
        iconWrapper:{
            width:40,
            height:40,
            borderWidth:1,
            borderColor:props?.logoutBtn ? 'red' : Colors.brightBlue,
            backgroundColor:props?.logoutBtn ? 'red' : Colors.brightBlue,
            borderRadius:40/2,
            ...CommonStyles.verticalCenter,
            ...CommonStyles.horizontalCenter,
        },
        label:{
            fontSize:17,
            color:props?.logoutBtn ? 'red' : Colors.dark,
            marginLeft:'6%',
            ...CommonStyles.fontFamily,
        },
        value:{
            fontSize:16,
            color:Colors.darker,
            ...CommonStyles.fontFamily
        }
    }
    return (
        <Pressable onPress={props.onPress} style={styles.mainStyle}>
           <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.horizontalCenter}}>
           <View style={styles.iconWrapper}>
           {props.icon}
           </View>
           <Text style={styles.label}>{props?.logoutBtn ? 'Sign Out' : props.label}</Text>
               </View>
               <Text style={styles.value}>{props.value}</Text>
        </Pressable>
    )
}

export const Heading = ({text}) => {
    const heading = {
        fontSize:18,
        fontWeight:'bold',
        color:Colors.dark,
        margin:10
    }
    return (
        <Text style={heading}>{text}</Text>
    )
}



// export const Header = ({showBackIcon,children,text}) => {
//     const header = {
//             width:'100%',
//             height:65,
//             borderWidth:1,
//             borderColor:Colors.primaryColor,
//             backgroundColor:Colors.primaryColor,
//             ...CommonStyles.flexDirectionRow,
//             ...CommonStyles.justifySpaceBetween,
//             ...CommonStyles
//     }
//     const icon = {
//         margin:5
//     }
//     const commonTextStyle = {
//         fontSize:18,
//    fontWeight:'bold',
//    color:Colors.white
//     }
//     return (
//         <View style={header}>  
//         {
//             showBackIcon ?
//             <TouchableOpacity style={icon}>
//              <MaterialCommunityIcons name='keyboard-backspace' color='white' size={20}/>
//             </TouchableOpacity>
//             :
//             null
//         }
//         <Text style={commonTextStyle}>{text}</Text>
//         {children}
//         </View>
//     )
// }

export const OrderCard = ({label,count}) => {
    const container = {
        width:Dimensions.get('screen').width / 3.2,
        ...CommonStyles.horizontalCenter,
        ...CommonStyles.verticalCenter
    }
    const textStyle = {
        ...CommonStyles.fontFamily,
        width:'90%',
        alignSelf:'center',
        textAlign:'center',
        fontSize:16
        
    }
    return (
        <View style={container}>
            <Text style={textStyle}>{count}</Text>
            <Text style={textStyle}>{label}</Text>
        </View>
    )
}


export const CreateAddressModal = ({onDelete,onClose,selectedAddressType,createAddressRef,onSelectAddressType,createAddress,editMode,value,onChangeText,phoneVal,infoVal,onChangePhone,onChangeInfo}) => {
    const width = Dimensions.get('screen').width
    const styles = {
        mainWrapper:{width:'95%',alignSelf:'center',margin:10,left:5},
        createAddress:{fontSize:20,...CommonStyles.fontFamily},
        addressDetail:{fontSize:13,fontWeight:'300',color:Colors.dark},
        labelCard:{
            width:width / 2.3,
            height:80,
            borderWidth:1,
            borderColor:Colors.primaryColor,
            backgroundColor:selectedAddressType == 'Home' ? Colors.primaryColor : Colors.primaryColorShade,
            ...CommonStyles.flexCenter,
            borderRadius:5,
            margin:10
        },
        labelText:{fontSize:17,...CommonStyles.fontFamily},
    }
    return (
        <Modalize
        onClose={onClose}
        adjustToContentHeight={true}
        ref={createAddressRef}
        modalStyle={{paddingVertical:20}}
        >
           <ScrollView contentContainerStyle={{flexGrow:1,paddingVertical:15}}>
           <View style={styles.mainWrapper}>
            <Text style={styles.createAddress}>{editMode ? 'Edit' : 'Create'} Address</Text>
            <Text style={styles.addressDetail}>Choose the label for your address</Text>
            </View>
           <View style={{...CommonStyles.flexDirectionRow,...CommonStyles.verticalCenter}}>
           <TouchableOpacity onPress={() => onSelectAddressType('Home')} style={[styles.labelCard,{
               backgroundColor:selectedAddressType == 'Home' ? Colors.primaryColor : Colors.primaryColorShade,
           }]}> 
                <Feather name='home' color={selectedAddressType == 'Home' ? 'white' : Colors.primaryColor} size={30}/>
                <Text style={{fontSize:17,...CommonStyles.fontFamily,color:selectedAddressType == 'Home' ? 'white' : Colors.primaryColor}}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => onSelectAddressType('Work')}
            style={[styles.labelCard,{backgroundColor:selectedAddressType == 'Work' ? Colors.primaryColor : Colors.primaryColorShade}]}> 
                <MaterialIcons name='work-outline' color={selectedAddressType == 'Work' ? 'white' : Colors.primaryColor} size={30}/>
                <Text style={{fontSize:17,...CommonStyles.fontFamily,color:selectedAddressType == 'Work' ? 'white' : Colors.primaryColor}}>Work</Text>
            </TouchableOpacity>
           </View>
          <View style={{alignSelf:'center'}}>
          <InputFieldComponent
            icon={
              <Ionicons
                name="location-sharp"
                color={Colors.dark}
                size={20}
                style={{paddingLeft:20}}
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeText}
            placeholderText={'Address Line'}
            value={value}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            borderRadius={5}
            width={width - 30}
            multiline={true}
            
          />
           <InputFieldComponent
            icon={
                <MaterialCommunityIcons
                name="phone"
                color={Colors.dark}
                size={20}
                style={{paddingLeft:20}}
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangePhone}
            placeholderText={'Phone number'}
            value={phoneVal}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            hintText="Please enter valid password"
            borderRadius={5}
            width={width - 30}
            multiline={true}
            
          />
           <InputFieldComponent
            icon={
              <MaterialCommunityIcons
                name="information"
                color={Colors.dark}
                size={20}
                style={{paddingLeft:20}}
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeInfo}
            placeholderText={'Optional Info for rider'}
            value={infoVal}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            hintText="Please enter valid password"
            borderRadius={5}
            width={width - 30}
            multiline={true}
            
          />
           <ButtonComponent
           handlePress={createAddress}
          buttonText={'Submit'}
          width={width-30}
          colorB={Colors.brightBlue}
          borderRadius={5}
          />
           {
               editMode && (
               <View style={{marginTop:10}}>
                    <ButtonComponent
                handlePress={onDelete}
               buttonText={'Delete'}
               width={width-30}
               colorB={Colors.red}
               borderRadius={5}
               />
               </View>
               )
           }
          </View>
           </ScrollView>
         
            </Modalize>
    )
}



export const AddressesListingModal = ({onClose,addressListingRef,children}) => {
    const width = Dimensions.get('screen').width
    const styles = {
        mainWrapper:{width:'95%',alignSelf:'center',margin:10,left:5},
        createAddress:{fontSize:20,...CommonStyles.fontFamily},
        addressDetail:{fontSize:13,fontWeight:'300',color:Colors.dark},
    }
    return (
        <Modalize
        onClose={onClose}
        adjustToContentHeight={true}
        ref={addressListingRef}
        modalStyle={{paddingVertical:20}}
        >
           <ScrollView contentContainerStyle={{flexGrow:1,paddingVertical:15}}>
           <View style={styles.mainWrapper}>
            <Text style={styles.createAddress}>Delivery Address</Text>
            <Text style={styles.addressDetail}>Choose the delivery address for your order</Text>
            </View>
            {children}
           </ScrollView>
         
            </Modalize>
    )
}



export const SetUpLocationModal = ({coords,showDel,onDone,onDelete,onClose,showSetUpLocationRef,setUpAddress,getCoordinates,editMode,value,onChangeText,state,onChangeState,city,onChangeCity}) => {
    const width = Dimensions.get('screen').width
    const styles = {
        mainWrapper:{width:'95%',alignSelf:'center',margin:10,left:5},
        createAddress:{fontSize:20,...CommonStyles.fontFamily},
        addressDetail:{fontSize:13,fontWeight:'300',color:Colors.dark}
    }
    return (
        <Modalize
        onClose={onClose}
        adjustToContentHeight={true}
        ref={showSetUpLocationRef}
        modalStyle={{paddingVertical:20}}
        >
           <ScrollView contentContainerStyle={{flexGrow:1,paddingVertical:15}}>
           <View style={styles.mainWrapper}>
            <Text style={styles.createAddress}>{editMode ? 'Edit' : 'Set Up'} Address</Text>
            <Text style={styles.addressDetail}>Choose the label for your address</Text>
            </View>
          <View style={{alignSelf:'center'}}>
          <InputFieldComponent
            icon={
              <Ionicons
                name="location-sharp"
                color={Colors.dark}
                size={20}
                style={{paddingLeft:20}}
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeText}
            placeholderText={'Address Line'}
            value={value}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            borderRadius={5}
            width={width - 30}
            multiline={true}
            
          />
           <InputFieldComponent
            icon={
                <MaterialCommunityIcons
                name="phone"
                color={Colors.dark}
                size={20}
                style={{paddingLeft:20}}
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeState}
            placeholderText={'State'}
            value={state}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            borderRadius={5}
            width={width - 30}
            multiline={true}
            
          />
            <InputFieldComponent
            icon={
                <MaterialCommunityIcons
                name="phone"
                color={Colors.dark}
                size={20}
                style={{paddingLeft:20}}
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeCity}
            placeholderText={'City'}
            value={city}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            borderRadius={5}
            width={width - 30}
            multiline={true}
            
          />
          <Text>Selected Coords - {coords?.latitude} - {coords?.longitude}</Text>
           <View style={{marginVertical:8}}>
           <ButtonComponent
           handlePress={getCoordinates}
          buttonText={'Get My Coordinates'}
          width={width-30}
          colorB={Colors.lightPink}
          colorT={Colors.red}
          borderRadius={5}
          />
           </View>
           <ButtonComponent
           handlePress={onDone}
          buttonText={editMode ? 'Edit' :  'Submit'}
          width={width-30}
          colorB={Colors.brightBlue}
          borderRadius={5}
          />
           {
               showDel && (
               <View style={{marginTop:10}}>
                    <ButtonComponent
                handlePress={onDelete}
               buttonText={'Delete'}
               width={width-30}
               colorB={Colors.red}
               borderRadius={5}
               />
               </View>
               )
           }
          </View>
           </ScrollView>
         
            </Modalize>
    )
}





export const RiderSecurityCodeModal = ({onClose,RiderSecurityCodeModalRef,securityCode,onChangeSecurityCode,onProceed}) => {
    const width = Dimensions.get('screen').width
    const styles = {
        mainWrapper:{width:'95%',alignSelf:'center',margin:10,left:5},
        createAddress:{fontSize:20,...CommonStyles.fontFamily},
        addressDetail:{fontSize:13,fontWeight:'300',color:Colors.dark},
    }
    return (
        <Modalize
        onClose={onClose}
        adjustToContentHeight={true}
        ref={RiderSecurityCodeModalRef}
        modalStyle={{paddingVertical:20}}
        >
           <ScrollView contentContainerStyle={{flexGrow:1,paddingVertical:15}}>
           <View style={styles.mainWrapper}>
            <Text style={styles.createAddress}>Security Code</Text>
            <Text style={styles.addressDetail}>The customer has security code, ask the customer to share that and enter here in order to process.</Text>
            </View>
           <View style={{alignSelf:'center'}}> 
           <InputFieldComponent
            icon={
                <MaterialCommunityIcons
                name="security"
                color={Colors.dark}
                size={20}
                style={{paddingLeft:40}}
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeSecurityCode}
            placeholderText={'Enter code here'}
            value={securityCode}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            borderRadius={5}
            width={width - 30}            
          />
           </View>
          <View style={{alignSelf:'center'}}>
          <ButtonComponent
               buttonText={'Proceed'}
               width={width - 30}
               colorB={Colors.brightBlue}
               borderRadius={5}
               handlePress={onProceed}
               />
          </View>
           </ScrollView>
         
            </Modalize>
    )
}



export const AddBrandModal = ({onClose,addbrandModelRef,name,onChangeName,onProceed}) => {
    const width = Dimensions.get('screen').width
    const styles = {
        mainWrapper:{width:'95%',alignSelf:'center',margin:10,left:5},
        createAddress:{fontSize:20,...CommonStyles.fontFamily},
        addressDetail:{fontSize:13,fontWeight:'300',color:Colors.dark},
    }
    return (
        <Modalize
        onClose={onClose}
        adjustToContentHeight={true}
        ref={addbrandModelRef}
        modalStyle={{paddingVertical:20}}
        >
           <ScrollView contentContainerStyle={{flexGrow:1,paddingVertical:15}}>
           <View style={styles.mainWrapper}>
            <Text style={styles.createAddress}>Enter Brand Name</Text>
            <Text style={styles.addressDetail}>Make sure that the brand name doent exist in the list.</Text>
            </View>
           <View style={{alignSelf:'center'}}> 
           <InputFieldComponent
            icon={
                <MaterialCommunityIcons
                name="security"
                color={Colors.dark}
                size={20}
                style={{paddingLeft:40}}
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeName}
            placeholderText={'Enter name here'}
            value={name}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            borderRadius={5}
            width={width - 30}            
          />
           </View>
          <View style={{alignSelf:'center'}}>
          <ButtonComponent
               buttonText={'Proceed'}
               width={width - 30}
               colorB={Colors.brightBlue}
               borderRadius={5}
               handlePress={onProceed}
               />
          </View>
           </ScrollView>
         
            </Modalize>
    )
}