import React from 'react';
import VendorScreenContainerComponent from '../../components/vendor-shared/vendor-screen-container-component';
import NotificationComponent from '../../components/vendor-shared/notification.component';
import {StyleSheet, Text, View} from 'react-native';
import CommonStyles from '../../util/styles/styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../util/styles/colors';

const VendorNotificationsScreen = ({navigation, route}) => {
  const markAllAsRead = () => {};

  return (
    <VendorScreenContainerComponent screenHeading="Notifications">
      <View>
        <Text
          onPress={markAllAsRead}
          style={[CommonStyles.fontFamily, styles.textAlignRight]}>
          Mark all as read
          <FontAwesome5
            name="check-double"
            color={Colors.secondaryColorBlueShade}
            size={16}
          />
        </Text>
        <NotificationComponent isRead={true} />
        <NotificationComponent isRead={true} />
        <NotificationComponent isRead={false} />
        <NotificationComponent isRead={true} />
        <NotificationComponent isRead={false} />
        {/*<AllEmptyComponent/>*/}
      </View>
    </VendorScreenContainerComponent>
  );
};

const styles = StyleSheet.create({
  textAlignRight: {
    textAlign: 'right',
    marginBottom: 20,
  },
});

export default VendorNotificationsScreen;
