import {View, StyleSheet,Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {Box, CheckIcon, Select} from 'native-base';
import {HeaderTitle} from '../../../components/Customer/HeaderTitle';
import {useForm} from '../../../hooks/useForm';
import InputFieldComponent from '../../../components/input-field/input-field.component';
import KEYBOARD_TYPES from '../../../util/keyboard-types';
import Colors from '../../../util/styles/colors';
import { ButtonFooter } from '../../../components/button/ButtoFooter';
import { useCompras } from '../../../hooks/useCompras';
import { getUserId } from '../../../util/local-storage/auth_service';
import { CUPON_ROUTES, showToaster } from '../../../util/constants';

export const CrearEditCuponScreen = ({navigation}) => {
  const {form, onChange} = useForm({
    name: '',
    type: '',
    descuento: '',
  });
  const {createCupones,isLoading} = useCompras();

  const enviarCupon = async() => {
    const userId = await getUserId()
    if (form?.name && form?.type && form?.descuento && userId) {
      const result = await createCupones({
        ...form,
        creator:userId
      })
      if (result == 200) {
        navigation.replace(CUPON_ROUTES.HOME_CUPON)
      }
    }else{
      showToaster('Faltan campos')
    }
      
   
  }

  return (
    <View style={styles.content}>
      <HeaderTitle titulo={'Crear Cupón'} />
      <Box 
      alignSelf="center"
      style={styles.form}
      >
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.DEFAULT}
          onChangeText={inputText => {
            onChange(inputText, 'name');
          }}
          placeholderText={'Nombre del cupón'}
          secureTextEntry={false}
          value={form?.name}
          // nextFieldRef={emailRef}
          returnType="next"
        />
        <InputFieldComponent
          keyboardType={KEYBOARD_TYPES.NUMBER_PAD}
          onChangeText={inputText => {
            onChange(inputText, 'descuento');
          }}
          placeholderText={'Descuento'}
          secureTextEntry={false}
          value={form?.descuento}
          // nextFieldRef={emailRef}
          returnType="next"
        />
        <Select
            backgroundColor={'white'}
            
            selectedValue={form?.type}
            accessibilityLabel="Tipo de descuento $ o %"
            placeholder="Descuento $ ó %"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            marginY={2}
            w={200}
            alignItems={'center'}
            onValueChange={itemValue => onChange(itemValue,'type')}
            defaultValue={'%'}
            >
            <Select.Item label="% Porcentaje" value="%" />
            <Select.Item label="$ Cantidad" value="$" />
          </Select>
      </Box>
      {
        !isLoading ? (
          <ButtonFooter text={'Guardar' } icon='plus' action={enviarCupon} />
        ):(
          <ActivityIndicator  />
        )
      }
      
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex:1,
    justifyContent:'center',
   
   
    
  },
  content: {
    flex: 1,
    backgroundColor:Colors.bgColor,
    
  }
});
