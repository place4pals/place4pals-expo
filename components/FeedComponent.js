import * as React from 'react';
import { Modal, Image, Text, View, RefreshControl, TextInput, ScrollView, TouchableOpacity, Keyboard, Dimensions, TouchableOpacityBase, ActionSheetIOS, Platform } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import * as root from '../Root';

export default class FeedComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: false,
        posts: [],
        commentInputs: [],
        modalVisible: false
    };
    async componentDidMount() {
        this.onRefresh(false);
    }
    async onRefresh(showLoader = true) {
        showLoader && this.setState({ loading: true });
        let modifyQuery = '';
        this.props.viewPost && (modifyQuery = `, where: {id: {_eq: "${this.props.viewPost}"}}`);
        this.props.viewUser && (modifyQuery = `, where: {user_id: {_eq: "${this.props.viewUser}"}}`);
        let data = await API.graphql(graphqlOperation(`{
            post(order_by: {date_created: desc}${modifyQuery}) {
                id
                title
                content
                date_created
                user {
                id
                username
                }
                comments(order_by: {date_created: asc}) {
                content
                date_created
                user {
                    username
                }
                }
            }
        }`));
        this.setState({ loading: false, posts: data.data.post });
    }

    async addComment(content, id) {
        Keyboard.dismiss();
        this.setState({ loading: true });
        let data = await API.graphql(graphqlOperation(`mutation { insert_comment(objects: {content: "${content}", post_id: "${id}"}) {affected_rows}}`));
        //now reload that specific post's comments
        data = await API.graphql(graphqlOperation(`{
      post(order_by: {date_created: desc}, where: {id: {_eq: "${id}"}}) {
        comments(order_by: {date_created: asc}) {
          content
          date_created
          user {
            username
          }
        }
      }
    }`));
        this.state.posts[this.state.posts.findIndex(obj => obj.id == id)].comments = data.data.post[0].comments;
        this.setState({ loading: false });
    }

    render() {
        function colorize(str) {
            for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
            let color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
            return '#' + Array(6 - color.length + 1).join('0') + color;
        }

        return (
            this.state.posts.map((obj, index) => {
                return (
                    <View key={index} style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, minHeight: 50, marginBottom: 15, marginTop: 35 }}>
                        <View style={{ marginTop: -35, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('viewUser', { userId: obj.user.id }); }} activeOpacity={1}>
                                <View style={{ borderWidth: 1, borderColor: '#000000', backgroundColor: colorize(obj.user.username), borderRadius: 10, padding: 5, height: 50, width: 50 }} />
                            </TouchableOpacity>
                            <View style={{ marginTop: root.web ? -4 : 5, marginLeft: 5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignSelf: 'stretch', paddingRight: 55 }}>
                                    <Text onPress={() => { this.props.navigation.navigate('viewPost', { postId: obj.id }); }} style={{ marginBottom: 5, fontSize: 22 }}>{obj.title}</Text>
                                    <TouchableOpacity style={{ paddingLeft: 30, height: 30 }} onPress={() => {
                                        Platform.OS === 'ios' ?
                                            ActionSheetIOS.showActionSheetWithOptions(
                                                {
                                                    options: ['Cancel', 'Delete', 'Share'],
                                                    destructiveButtonIndex: 1,
                                                    cancelButtonIndex: 0,
                                                },
                                                buttonIndex => {
                                                    if (buttonIndex === 2) {
                                                        //delete the post!!
                                                    }
                                                }
                                            ) : alert("You should see options here to edit/delete a post- I'm working on it!")
                                    }}>
                                        <Text>...</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignSelf: 'stretch', paddingRight: 55 }}>
                                    <Text>by <Text onPress={() => { this.props.navigation.navigate('viewUser', { userId: obj.user.id }); }} style={{ fontWeight: '600' }}>{obj.user.username}</Text></Text>
                                    <Text>{new Date(obj.date_created).toLocaleDateString(('en-US', {
                                        day: "numeric",
                                        month: "numeric",
                                        year: "numeric"
                                    }))} @ {new Date(obj.date_created).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={{ margin: 10 }}>{obj.content}</Text>
                        {obj.comments.map((innerObj, innerIndex) => {
                            return (
                                <View key={innerIndex} style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}>
                                    <Text><Text onPress={() => { this.props.navigation.navigate('viewUser', { userId: obj.user.id }); }} style={{ fontWeight: '600' }}>{innerObj.user.username}</Text>: {innerObj.content}</Text>
                                </View>
                            )
                        })}
                        <TextInput style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, margin: 10 }} placeholder='Add a comment' returnKeyType='send'
                            onSubmitEditing={(event) => { this.addComment(event.nativeEvent.text, obj.id); this.setState({ commentInputs: { ...this.state.commentInputs, [obj.id]: '' } }); }}
                            onChangeText={comment => { this.setState({ commentInputs: { ...this.state.commentInputs, [obj.id]: comment } }); }}
                            //multiline={true}
                            value={this.state.commentInputs[obj.id]} />
                    </View>
                )
            })
        );
    }
}