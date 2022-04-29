import React, {useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../components/top-circle/top-circle.component';
import RoleTypeComponent from '../components/role-type/role-type.component';
import CommonStyles from '../util/styles/styles';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
  ROLES,
  SCREEN_HORIZONTAL_MARGIN,
} from '../util/constants';
import Colors from '../util/styles/colors';
import ButtonComponent from '../components/button/button.component';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomContentComponent from '../components/bottom-content/bottom-content.component';
import {deviceHeight} from '../util/Dimentions';

const AVAILABLE_ROLES = [
  //   {roleName: ROLES.BUSINESS,text:'NEGOCIO',bgColor:Colors.primarySolid},
  {roleName: ROLES.CUSTOMER, text: 'CLIENTE', bgColor: Colors.terciarySolid},
  //   {roleName: ROLES.RIDER,text:'REPARTIDOR',bgColor:Colors.secundarySolid},
];

const SignUpScreenCustomer = ({navigation}) => {
  const [selectedRoles, setSelectedRoles] = useState({
    [ROLES.BUSINESS]: false,
    [ROLES.CUSTOMER]: true,
    [ROLES.RIDER]: false,
  });

  const handlePress = key => {
    setSelectedRoles({
      [ROLES.BUSINESS]: false,
      [ROLES.CUSTOMER]: false,
      [ROLES.RIDER]: false,
      [key]: true,
    });
  };

  const proceedWithSpecificScreen = () => {
    const objectKeys = Object.keys(selectedRoles);
    for (const roleKey of objectKeys) {
      if (selectedRoles[roleKey]) {
        if (roleKey == 'Rider') {
          navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.RIDER_SIGN_UP);
        } else {
          navigation.navigate(roleKey);
        }
      }
    }
  };

  return (
    <View>
      <TopCircleComponent textHeading="Crea una cuenta" />

      <View
        style={[
          CommonStyles.justifySpaceBetween,
          {marginTop: deviceHeight * 0.02, paddingVertical: 20},
        ]}>
        <View style={styles.card}>
          <View style={{marginBottom: 30}}>
            <Text style={styles.titulo}>Comenzar registro</Text>
          </View>

          <View style={[CommonStyles.flexCenter]}>
            {AVAILABLE_ROLES.map((role, index) => {
              return (
                <RoleTypeComponent
                  key={index}
                  isSelected={selectedRoles[role.roleName]}
                  roleName={role.roleName}
                  handlePress={handlePress}
                  text={role.text}
                  bgColor={role.bgColor}
                />
              );
            })}

            <ButtonComponent
              icon={
                <AntDesign size={18} color={Colors.white} name="arrowright" />
              }
              colorB={Colors.brightBlue}
              width={50}
              height={50}
              handlePress={proceedWithSpecificScreen}
            />
          </View>
          <BottomContentComponent>
            <Text style={[CommonStyles.fontFamily]}>
              <Text>¿Ya tienes una cuenta? </Text>
              <Text
                onPress={() => {
                  navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN);
                }}
                style={styles.signUpText}>
                INICIAR SESIÓN
              </Text>
            </Text>
          </BottomContentComponent>

          
        </View>
        <BottomContentComponent>
            <Text style={[CommonStyles.fontFamily]}>
              <Text>¿Quieres unirte a Besseri? </Text>
            </Text>
            <Text
              onPress={() => {
                navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.SIGN_UP);
              }}
              style={styles.signUpText}>
              Registrate como vendedor o repartidor
            </Text>
        </BottomContentComponent>
      </View>
    </View>
    // </CustomSafeAreaViewComponent>
  );
};

const styles = StyleSheet.create({
  signUpText: {
    color: Colors.primarySolid,
    width: 300,
    paddingLeft: 10,
  },
  titulo: {
    fontFamily: CommonStyles.fontFamily.fontFamily,
    fontSize: 18,
    opacity: 0.5,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 10,
    paddingVertical: deviceHeight * 0.08,
    elevation: 2,
  },
});

export default SignUpScreenCustomer;
