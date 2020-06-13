import * as React from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import * as root from '../Root';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';

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
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    compressImage = async (pathToImageFile) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            pathToImageFile,
            [/*maybe crop here?*/],
            { compress: 0, format: ImageManipulator.SaveFormat.JPEG }
        );
        return manipResult;
    };

    uploadToStorage = async pathToImageFile => {
        /*
        try {
            const response = await fetch(pathToImageFile);
            const blob = await response.blob();
            this.setStateKey('newProfilePictureKey', this.uuid() + '.JPEG');
            const response2 = Storage.put(this.state.newProfilePictureKey, blob, {
                contentType: 'image/jpeg',
            })
            console.log(response);
            console.log(response2);

            if (this.state.ProfilePicture) {
                Storage.remove(this.state.ProfilePicture)
                    .then(result => {
                        console.log(result);
                        this.props.navigation.navigate('Dashboard', { profilePicture: pathToImageFile, newProfilePictureKey: this.state.newProfilePictureKey });
                    })
                    .catch(err => console.log(err));
            }
            else {
                this.props.navigation.navigate('Dashboard', { profilePicture: pathToImageFile, newProfilePictureKey: this.state.newProfilePictureKey });
            }

        } catch (err) {
            console.log(err);
        }
        */
    }

    async snapPhoto() {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync({ quality: 1, base64: true, fixOrientation: true, exif: true });
            photo.exif.Orientation = 1;
            let compressedImage = await this.compressImage(photo.uri);
            this.uploadToStorage(compressedImage.uri);
        }
    }

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1 }} type={this.state.type} ref={(ref) => { this.camera = ref }}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                alignItems: 'center'
                            }}>
                            <TouchableOpacity style={{ position: 'absolute', zIndex: 10, bottom: 10 }} onPress={() => { this.snapPhoto() }}>
                                <Text style={{}}>Take Picture</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ position: 'absolute', zIndex: 10, top: 65, left: 25 }} onPress={() => { this.props.navigation.navigate('addPost'); }}>
                                <Text>{'Go Back'}</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}