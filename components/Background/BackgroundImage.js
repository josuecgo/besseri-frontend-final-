import { Image} from 'react-native';
import React from 'react';
import {deviceHeight, deviceWidth} from '../../util/Dimentions';

export const BackgroundImage = () => {
    

    return (
    <>
      <Image
        source={require('../../assets/images/bg.png')}
        style={{
          position: 'absolute',
          height: deviceHeight + 150,
        //   top: 1,
          width: deviceWidth ,
        }}
      />
    </>
  );
};
