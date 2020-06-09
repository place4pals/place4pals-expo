
import { Dimensions, Platform } from 'react-native';
export let allWeb = Platform.OS === 'web' ? true : false;
export let desktopWeb = allWeb ? Dimensions.get('window').width > 800 ? true : false : false;
export let mobileWeb = allWeb ? Dimensions.get('window').width < 800 ? true : false : false;
export let paddingTop = (Platform.OS === 'ios') ? 0 : 10;
export let width = desktopWeb ? 1140 : 'auto';
export let marginLeft = desktopWeb ? 'auto' : 10;
export let marginRight = desktopWeb ? 'auto' : 10;
export let windowWidth = Dimensions.get('window').width;

export let sidebarPaddingLeft = 825;
export let mainbarPaddingRight = desktopWeb ? 335 : 0;
export let imageWidth = desktopWeb ? 770 : Dimensions.get('window').width - 20;