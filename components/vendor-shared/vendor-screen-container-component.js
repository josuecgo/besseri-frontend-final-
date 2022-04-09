import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {SCREEN_HORIZONTAL_MARGIN} from '../../util/constants';
import CommonStyles from '../../util/styles/styles';
import Colors from '../../util/styles/colors';
import FloatingActionButtonComponent from '../button/floating-action-button.component';
import { base_url } from '../../util/api/api_essentials';

const VendorScreenContainerComponent = ({
  date,
  screenHeading,
  showHeader,
  imageSource,
  children,
  floatButtonHandler,
  needFloatingActionButton = false,
  business
}) => {
  const {height} = useWindowDimensions();

  return (
    <View style={CommonStyles.flexDirectionColumn}>
      <View
        style={[
          {
            height: height - SCREEN_HORIZONTAL_MARGIN,
            backgroundColor: Colors.white,
            padding: SCREEN_HORIZONTAL_MARGIN,
          },
        ]}>
        <View
          style={[
            CommonStyles.flexDirectionRow,
            CommonStyles.horizontalCenter,
            CommonStyles.justifySpaceBetween,
          ]}>
          <View style={[CommonStyles.flexDirectionColumn]}>
            <Text style={[CommonStyles.fontFamily, styles.heading]}>
              {screenHeading}
            </Text>
            <Text style={[CommonStyles.fontFamily, styles.date]}>{date}</Text>
          </View>
          <View>
            <Image source={{uri:`${base_url}/${business?.logo}`}} style={styles.userImage} />
          </View>
        </View>
        {needFloatingActionButton ? (
          <FloatingActionButtonComponent handler={floatButtonHandler} />
        ) : null}
        <ScrollView>{children}</ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  date: {
    opacity: 0.5,
  },
  heading: {
    fontSize: 26,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
});

export default VendorScreenContainerComponent;
