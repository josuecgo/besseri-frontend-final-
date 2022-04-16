import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modalize} from 'react-native-modalize';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InputFieldComponent from './input-field/input-field.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KEYBOARD_TYPES from '../util/keyboard-types';
import ButtonComponent from './button/button.component';
import {adjust} from '../util/Dimentions';
export const ThinlineSeparator = ({margin, width}) => {
  const style = {
    width: width ? width : '100%',
    borderWidth: 0.3,
    borderColor: Colors.dark,
    marginVertical: margin ? margin : 1,
    alignSelf: 'center',
  };
  return <View style={style} />;
};

export const MenuItem = props => {
  const styles = {
    mainStyle: {
      width: '95%',
      minHeight: 55,
      ...CommonStyles.flexDirectionRow,
      ...CommonStyles.horizontalCenter,
      ...CommonStyles.justifySpaceBetween,
      // paddingHorizontal:15,
      alignSelf: 'center',
    },
    iconWrapper: {
      width: 40,
      height: 40,
      borderWidth: 1,
      borderColor: props?.logoutBtn ? 'red' : Colors.brightBlue,
      backgroundColor: props?.logoutBtn ? 'red' : Colors.brightBlue,
      borderRadius: 40 / 2,
      ...CommonStyles.verticalCenter,
      ...CommonStyles.horizontalCenter,
    },
    label: {
      fontSize: adjust(12),
      color: props?.logoutBtn ? 'red' : Colors.dark,
      marginLeft: '6%',
      ...CommonStyles.fontFamily,
    },
    value: {
      fontSize: adjust(11),
      color: Colors.darker,
      ...CommonStyles.fontFamily,
    },
  };
  return (
    <Pressable onPress={props.onPress} style={styles.mainStyle}>
      <View
        style={{
          ...CommonStyles.flexDirectionRow,
          ...CommonStyles.horizontalCenter,
        }}>
        <View style={styles.iconWrapper}>{props.icon}</View>
        <Text style={styles.label}>
          {props?.logoutBtn ? 'Sign Out' : props.label}
        </Text>
      </View>
      <Text style={styles.value}>{props.value}</Text>
    </Pressable>
  );
};

export const Heading = ({text}) => {
  const heading = {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    margin: 10,
  };
  return <Text style={heading}>{text}</Text>;
};

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

export const OrderCard = ({label, count}) => {
  const container = {
    width: Dimensions.get('screen').width / 3.2,
    ...CommonStyles.horizontalCenter,
    ...CommonStyles.verticalCenter,
  };
  const textStyle = {
    ...CommonStyles.fontFamily,
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
  };
  return (
    <View style={container}>
      <Text style={textStyle}>{count}</Text>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
};

export const CreateAddressModal = ({
  onDelete,
  onClose,
  selectedAddressType,
  createAddressRef,
  onSelectAddressType,
  createAddress,
  editMode,
  value,
  onChangeText,
  phoneVal,
  infoVal,
  onChangePhone,
  onChangeInfo,
  getCoordinates,
  coords
}) => {
  const width = Dimensions.get('screen').width;
  const styles = {
    mainWrapper: {margin: 0, alignItems: 'center'},
    createAddress: {fontSize: 20, ...CommonStyles.fontFamily},
    addressDetail: {fontSize: 13, fontWeight: '300', color: Colors.dark},
    labelCard: {
      width: width / 3,
      height: 70,
      borderWidth: 1,
      borderColor: Colors.primarySolid,
      backgroundColor:
        selectedAddressType == 'Home'
          ? Colors.primarySolid
          : Colors.primarySolid,
      ...CommonStyles.flexCenter,
      borderRadius: 5,
      margin: 10,
    },
    labelText: {fontSize: 17, ...CommonStyles.fontFamily},
  };
  return (
    <Modalize
      onClose={onClose}
      adjustToContentHeight={true}
      ref={createAddressRef}
      modalStyle={{paddingVertical: 20}}>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingVertical: 15}}>
        <View style={styles.mainWrapper}>
          <Text style={styles.createAddress}>
            {editMode ? 'Editar' : 'Crear'} Dirección
          </Text>
          <Text style={styles.addressDetail}>Elige tipo tu dirección</Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => onSelectAddressType('Home')}
            style={[
              styles.labelCard,
              {
                backgroundColor:
                  selectedAddressType == 'Home'
                    ? Colors.primarySolid
                    : Colors.white,
              },
            ]}>
            <Feather
              name="home"
              color={
                selectedAddressType == 'Home' ? 'white' : Colors.primarySolid
              }
              size={25}
            />
            <Text
              style={{
                fontSize: adjust(13),
                ...CommonStyles.fontFamily,
                color:
                  selectedAddressType == 'Home' ? 'white' : Colors.primarySolid,
              }}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSelectAddressType('Work')}
            style={[
              styles.labelCard,
              {
                backgroundColor:
                  selectedAddressType == 'Work'
                    ? Colors.primarySolid
                    : Colors.white,
              },
            ]}>
            <MaterialIcons
              name="work-outline"
              color={
                selectedAddressType == 'Work' ? 'white' : Colors.primarySolid
              }
              size={25}
            />
            <Text
              style={{
                fontSize: adjust(13),
                ...CommonStyles.fontFamily,
                color:
                  selectedAddressType == 'Work' ? 'white' : Colors.primarySolid,
              }}>
              Work
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{alignItems: 'center'}}>
          <View>
            <Text>
                Coordenadas  {coords?.latitude}  {coords?.longitude}
            </Text>
            <View style={{marginVertical: 8}}>
                <ButtonComponent
                handlePress={getCoordinates}
                buttonText={'Obtener mis coordenadas'}
                width={width - 30}
                colorB={Colors.lightPink}
                colorT={Colors.red}
                borderRadius={5}
                />
            </View>
            <InputFieldComponent
              keyboardType={KEYBOARD_TYPES.DEFAULT}
              onChangeText={onChangeText}
              placeholderText={'Dirección'}
              value={value}
              secureTextEntry={false}
              // ref={passwordRef}
              returnType="default"
              // validator={passwordValidator}
              borderRadius={5}
              width={width * 0.9}
              multiline={true}
            />
            <InputFieldComponent
              keyboardType={KEYBOARD_TYPES.DEFAULT}
              onChangeText={onChangePhone}
              placeholderText={'Número de teléfono'}
              value={phoneVal}
              secureTextEntry={false}
              // ref={passwordRef}
              returnType="default"
              // validator={passwordValidator}
              hintText="Por favor ingrese una contraseña válida"
              borderRadius={5}
              width={width * 0.9}
              multiline={true}
            />
            <InputFieldComponent
              keyboardType={KEYBOARD_TYPES.DEFAULT}
              onChangeText={onChangeInfo}
              placeholderText={'Información para el repartidor'}
              value={infoVal}
              secureTextEntry={false}
              // ref={passwordRef}
              returnType="default"
              // validator={passwordValidator}
              hintText="Por favor ingrese una contraseña válida"
              borderRadius={5}
              width={width * 0.9}
              multiline={true}
            />
          </View>
          <ButtonComponent
            handlePress={createAddress}
            buttonText={'Enviar'}
            width={width - 30}
            colorB={Colors.terciarySolid}
            borderRadius={2}
          />
          {editMode && (
            <View style={{marginTop: 10}}>
              <ButtonComponent
                handlePress={onDelete}
                buttonText={'Delete'}
                width={width - 30}
                colorB={Colors.red}
                borderRadius={5}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Modalize>
  );
};

export const AddressesListingModal = ({
  onClose,
  addressListingRef,
  children,
}) => {
  const width = Dimensions.get('screen').width;
  const styles = {
    mainWrapper: {width: '95%', alignSelf: 'center', margin: 10, left: 5},
    createAddress: {fontSize: 20, ...CommonStyles.fontFamily},
    addressDetail: {fontSize: 13, fontWeight: '300', color: Colors.dark},
  };
  return (
    <Modalize
      onClose={onClose}
      adjustToContentHeight={true}
      ref={addressListingRef}
      modalStyle={{paddingVertical: 20}}>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingVertical: 15}}>
        <View style={styles.mainWrapper}>
          <Text style={styles.createAddress}>Delivery Address</Text>
          <Text style={styles.addressDetail}>
            Choose the delivery address for your order
          </Text>
        </View>
        {children}
      </ScrollView>
    </Modalize>
  );
};

export const SetUpLocationModal = ({
  coords,
  showDel,
  onDone,
  onDelete,
  onClose,
  showSetUpLocationRef,
  setUpAddress,
  getCoordinates,
  editMode,
  value,
  onChangeText,
  state,
  onChangeState,
  city,
  onChangeCity,
}) => {
  const width = Dimensions.get('screen').width;
  const styles = {
    mainWrapper: {width: '95%', alignSelf: 'center', margin: 10, left: 5},
    createAddress: {fontSize: 20, ...CommonStyles.fontFamily},
    addressDetail: {fontSize: 13, fontWeight: '300', color: Colors.dark},
  };
  return (
    <Modalize
      onClose={onClose}
      adjustToContentHeight={true}
      ref={showSetUpLocationRef}
      modalStyle={{paddingVertical: 20}}>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingVertical: 15}}>
        <View style={styles.mainWrapper}>
          <Text style={styles.createAddress}>
            {editMode ? 'Editar' : 'Configurar'} Dirección
          </Text>
          <Text style={styles.addressDetail}>
            Elige la etiqueta para tu dirección
          </Text>
        </View>
        <View style={{alignSelf: 'center'}}>
          <InputFieldComponent
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeText}
            placeholderText={'Dirección'}
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
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeState}
            placeholderText={'Pais'}
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
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeCity}
            placeholderText={'Ciudad'}
            value={city}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            borderRadius={5}
            width={width - 30}
            multiline={true}
          />
          <Text>
            Coordenadas - {coords?.latitude} - {coords?.longitude}
          </Text>
          <View style={{marginVertical: 8}}>
            <ButtonComponent
              handlePress={getCoordinates}
              buttonText={'Obtener mis coordenadas'}
              width={width - 30}
              colorB={Colors.lightPink}
              colorT={Colors.red}
              borderRadius={5}
            />
          </View>
          <ButtonComponent
            handlePress={onDone}
            buttonText={editMode ? 'Editar' : 'Enviar'}
            width={width - 30}
            colorB={Colors.brightBlue}
            borderRadius={5}
          />
          {showDel && (
            <View style={{marginTop: 10}}>
              <ButtonComponent
                handlePress={onDelete}
                buttonText={'Borrar'}
                width={width - 30}
                colorB={Colors.red}
                borderRadius={5}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Modalize>
  );
};

export const RiderSecurityCodeModal = ({
  onClose,
  RiderSecurityCodeModalRef,
  securityCode,
  onChangeSecurityCode,
  onProceed,
}) => {
  const width = Dimensions.get('screen').width;
  const styles = {
    mainWrapper: {width: '95%', alignSelf: 'center', margin: 10, left: 5},
    createAddress: {fontSize: 20, ...CommonStyles.fontFamily},
    addressDetail: {fontSize: 13, fontWeight: '300', color: Colors.dark},
  };
  return (
    <Modalize
      onClose={onClose}
      adjustToContentHeight={true}
      ref={RiderSecurityCodeModalRef}
      modalStyle={{paddingVertical: 20}}>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingVertical: 15}}>
        <View style={styles.mainWrapper}>
          <Text style={styles.createAddress}>Código de seguridad</Text>
          <Text style={styles.addressDetail}>
          El cliente tiene un código de seguridad, pídale que lo comparta y
             ingrese aquí para poder procesar.
          </Text>
        </View>
        <View style={{alignSelf: 'center'}}>
          <InputFieldComponent
            
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeSecurityCode}
            placeholderText={'Ingresa el código'}
            value={securityCode}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            borderRadius={5}
            width={width - 30}
          />
        </View>
        <View style={{alignSelf: 'center'}}>
          <ButtonComponent
            buttonText={'Enviar'}
            width={width - 30}
            colorB={Colors.brightBlue}
            borderRadius={5}
            handlePress={onProceed}
          />
        </View>
      </ScrollView>
    </Modalize>
  );
};

export const AddBrandModal = ({
  onClose,
  addbrandModelRef,
  name,
  onChangeName,
  onProceed,
}) => {
  const width = Dimensions.get('screen').width;
  const styles = {
    mainWrapper: {width: '95%', alignSelf: 'center', margin: 10, left: 5},
    createAddress: {fontSize: 20, ...CommonStyles.fontFamily},
    addressDetail: {fontSize: 13, fontWeight: '300', color: Colors.dark},
  };
  return (
    <Modalize
      onClose={onClose}
      adjustToContentHeight={true}
      ref={addbrandModelRef}
      modalStyle={{paddingVertical: 20}}>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingVertical: 15}}>
        <View style={styles.mainWrapper}>
          <Text style={styles.createAddress}>
            Introduzca el nombre de la marca
          </Text>
          <Text style={styles.addressDetail}>
            Asegúrese de que el nombre de la marca no exista en la lista.
          </Text>
        </View>
        <View style={{alignSelf: 'center'}}>
          <InputFieldComponent
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={onChangeName}
            placeholderText={'Nombre'}
            value={name}
            secureTextEntry={false}
            // ref={passwordRef}
            returnType="default"
            // validator={passwordValidator}
            borderRadius={5}
            width={width - 30}
          />
        </View>
        <View style={{alignSelf: 'center'}}>
          <ButtonComponent
            buttonText={'Crear'}
            width={width}
            colorB={Colors.terciarySolid}
            borderRadius={0}
            handlePress={onProceed}
          />
        </View>
      </ScrollView>
    </Modalize>
  );
};
