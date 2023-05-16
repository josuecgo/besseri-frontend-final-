import {StyleSheet} from 'react-native';
import Colors from './colors';
import { adjust } from '../Dimentions';

const CommonStyles = StyleSheet.create({
  screenY:{
    backgroundColor:Colors.bgColor,
    flex:1,
    paddingVertical:20

  },
  h1:{
    fontWeight:'700',
    fontFamily:'Arial',
    fontSize:adjust(20),
    color:Colors.white
  },
  h2:{
    fontWeight:'700',
    fontFamily:'Roboto',
    fontSize:adjust(14),
    color:Colors.white
  },
  h3:{
    fontWeight:'700',
    fontFamily:'Arial',
    fontSize:adjust(12),
    color:Colors.white
  },
  h4:{
    fontWeight:'bold',
    fontFamily:'Arial',
    fontSize:adjust(18),
    color:Colors.white
  },
  h5:{
    fontWeight:'200',
    fontFamily:'Arial',
    fontSize:adjust(10),
    color:Colors.white
  },
  flexOneCenter: {
    justifyContent:'center',
    alignItems:'center',
    flex:1
  },
  flexCenter: {
    // justifyContent: 'center',
    // alignItems: 'center',
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
