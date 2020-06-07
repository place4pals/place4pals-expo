
import { Dimensions } from 'react-native';
export let web = Dimensions.get('window').width > 800;
export let paddingHorizontal = web ? (Dimensions.get('window').width - 1140) / 2 : 20;
export let paddingTop = web ? 10 : 0;