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

const AVAILABLE_ROLES = [
  {roleName: ROLES.BUSINESS},
  {roleName: ROLES.CUSTOMER},
  {roleName: ROLES.RIDER},
];

const SignUpScreen = ({navigation}) => {
  const {width, height} = useWindowDimensions();

  const [selectedRoles, setSelectedRoles] = useState({
    [ROLES.BUSINESS]: true,
    [ROLES.CUSTOMER]: false,
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
        if(roleKey == 'Rider') {
          navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.RIDER_SIGN_UP);
        } else {
          navigation.navigate(roleKey);
        }
        
      }
    }
  };
  

  return (
    <CustomSafeAreaViewComponent>
      <TopCircleComponent
        textHeading="Create an account"
        subText="Please select an account type"
      />
      <View
        style={[
          CommonStyles.justifySpaceBetween,
          {marginTop: SCREEN_HORIZONTAL_MARGIN},
        ]}>
        <View style={[CommonStyles.flexCenter]}>
          {AVAILABLE_ROLES.map((role, index) => {
            return (
              <RoleTypeComponent
                key={index}
                isSelected={selectedRoles[role.roleName]}
                roleName={role.roleName}
                handlePress={handlePress}
              />
            );
          })}
          <ButtonComponent
            icon={
              <AntDesign size={18} color={Colors.white} name="arrowright" />
            }
            colorB={Colors.primaryColor}
            width={50}
            height={50}
            handlePress={proceedWithSpecificScreen}
          />
        </View>
      </View>
      <BottomContentComponent>
        <Text style={[CommonStyles.fontFamily]}>
          <Text>Already have an account? </Text>
          <Text
            onPress={() => {
              navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN);
            }}
            style={styles.signUpText}>
            SIGN IN
          </Text>
        </Text>
      </BottomContentComponent>
    </CustomSafeAreaViewComponent>
  );
};

const styles = StyleSheet.create({
  signUpText: {
    color: Colors.primaryColor,
    width: 300,
    paddingLeft: 10,
  },
});

export default SignUpScreen;
