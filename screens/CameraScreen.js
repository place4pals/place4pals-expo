import * as React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import * as root from '../Root';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import LoadingComponent from '../components/LoadingComponent';
import * as ImagePicker from 'expo-image-picker';

export default class CameraScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state.hasCameraPermission = null;
        this.state.type = Camera.Constants.Type.front;
    }
    state = {
        loading: false
    };
    async componentDidMount() {
        let { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
        let { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraRollPermission: status2 === 'granted' });
    }

    takePhoto = async () => {
        this.setState({ loading: true });
        if (!root.allWeb) { this.camera.pausePreview(); }
        let photo = await this.camera.takePictureAsync({ quality: 1, base64: true, fixOrientation: true, exif: true });
        photo.exif.Orientation = 1;
        let compressedPhoto = await ImageManipulator.manipulateAsync(photo.uri, [(!root.allWeb && this.state.type !== Camera.Constants.Type.back) ? { flip: ImageManipulator.FlipType.Horizontal } : { rotate: 0 }, { crop: { originX: 0, originY: (photo.height / 2) - (photo.width / 2), width: photo.width, height: photo.width } }, { resize: { width: 500 } }], { compress: 0, format: ImageManipulator.SaveFormat.JPEG });
        this.setState({ loading: false });
        this.props.navigation.navigate('addPost', { photo: compressedPhoto });
    }

    pickImage = async () => {
        try {
            this.setState({ loading: true, imagePicker: true });
            if (!root.allWeb) { this.camera.pausePreview(); }
            let photo = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (photo.cancelled) {
                this.setState({ loading: false, imagePicker: false });
            }
            else {
                //this.setState({ imagePickerSource: photo });
                let compressedPhoto = await ImageManipulator.manipulateAsync(photo.uri, [{ resize: { width: 500 } }], { compress: 0, format: ImageManipulator.SaveFormat.JPEG });
                this.setState({ loading: false, imagePicker: false });
                this.props.navigation.navigate('addPost', { photo: compressedPhoto });
            }
        } catch (E) {
            console.log(E);
        }
    };

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: this.state.imagePicker && '#000000' }}>
                    {this.state.imagePicker ? <View /> :
                        <Camera style={{ flex: 1, maxWidth: 1280 }} type={this.state.type} ref={(ref) => { this.camera = ref }}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    alignItems: 'center'
                                }}>
                                <View style={{ position: 'absolute', bottom: 0, left: 0, padding: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffffffaa' }}>
                                    <TouchableOpacity style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 20, borderWidth: 1 }} onPress={() => { this.props.navigation.navigate('addPost'); }}>
                                        <Text>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 20, borderWidth: 1 }} onPress={() => { this.pickImage() }}>
                                        <Text style={{}}>Gallery</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 20, borderWidth: 1 }} onPress={() => { this.takePhoto() }}>
                                        <Text style={{}}>Take Photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 20, borderWidth: 1 }} onPress={() => { this.setState({ type: this.state.type === Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front }); }}>
                                        <Text style={{}}>Flip</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Camera>}
                    {this.state.loading && <LoadingComponent />}
                </View>
            );
        }
    }
}