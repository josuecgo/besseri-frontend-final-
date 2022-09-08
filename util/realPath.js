import { Platform } from "react-native";
import RNFetchBlob from 'rn-fetch-blob';

export default res => {
    if (Platform.OS === 'android') {
        
        return res.uri.replace('file://','')
        return (res.uri.includes(".downloads.") ? RNFetchBlob.fs.dirs.DownloadDir + "/" + res.name : res.uri)
    } else if (Platform.OS === 'ios') {

        return res.uri.replace('file://','')
    }

    return res.uri;
}