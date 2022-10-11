import {StyleSheet} from 'react-native';
import Colors from './colors';

const CommonStyles = StyleSheet.create({
  flexOneCenter: {
    justifyContent:'center',
    alignItems:'center',
    flex:1
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalCenter: {
    alignItems: 'center',
  },
  verticalCenter: {
    justifyContent: 'center',
  },
  fontFamily: {
    // fontFamily: 'Arial-Rounded-MT-Bold',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexDirectionColumn: {
    flexDirection: 'column',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  flexOne:{
    flex:1
  },
  fontWeight300:{
    fontWeight:'300'
  },
  headerTitle:{
    fontSize:18,
    fontWeight:'bold',
    color:Colors.white
  }
});

export default CommonStyles;
