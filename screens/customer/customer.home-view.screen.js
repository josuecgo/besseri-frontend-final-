import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CustomSafeAreaViewComponent from '../../components/custom-safe-area-view/custom-safe-area-view.component';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import AutoPartsServiceCardComponent from '../../components/customer-components/auto-parts-service-card.component';
import {CUSTOMER_HOME_SCREEN_ROUTES} from '../../util/constants';

const CustomerHomeViewScreen = ({navigation}) => {
  return (
    <CustomSafeAreaViewComponent>
      <View style={[CommonStyles.flexCenter, {marginTop: 50}]}>
        <Text style={[CommonStyles.fontFamily, styles.mainFontStyles]}>
          <Text>bess</Text>
          <Text style={{color: Colors.secondaryColorGreenShade}}>e</Text>
          <Text>r</Text>
          <Text style={{color: Colors.primaryColor}}>i</Text>
        </Text>
      </View>
      <View
        style={[
          CommonStyles.flexDirectionColumn,
          CommonStyles.horizontalCenter,
        ]}>
        <AutoPartsServiceCardComponent
          navigation={navigation}
          text="Auto Parts"
          navigationKey={CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS}
        />
        <AutoPartsServiceCardComponent
          navigation={navigation}
          text="Services"
          navigationKey={CUSTOMER_HOME_SCREEN_ROUTES.SERVICE}
        />
      </View>
    </CustomSafeAreaViewComponent>
  );
};

const styles = StyleSheet.create({
  mainFontStyles: {
    fontSize: 70,
    color: Colors.secondaryColorBlueShade,
  },
});

export default CustomerHomeViewScreen;
