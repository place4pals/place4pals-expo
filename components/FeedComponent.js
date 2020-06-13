import * as React from 'react';
import { Text, View, RefreshControl, TextInput, TouchableOpacity, Keyboard, ActionSheetIOS, Platform, FlatList, Dimensions, Linking, Share } from 'react-native';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as root from '../Root';
import HTML from 'react-native-render-html';
import InputAccessoryViewComponent from './InputAccessoryViewComponent';
import * as WebBrowser from 'expo-web-browser';

export default class FeedComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        loading: false,
        posts: [],
        commentInputs: [],
        modalVisible: false,
        limit: 10,
        offset: 10,
        endReached: false
    };
    async componentDidMount() {
        this.onRefresh(false);
        let currentUser = (await Auth.currentSession()).idToken.payload;
        this.setState({ userId: currentUser.sub, username: currentUser['custom:username'] });
        root.desktopWeb && this.loadStats();
    }
    async onRefresh(showLoader = true) {
        showLoader && this.setState({ loading: true });
        let modifyQuery = '';
        this.props.viewPost && (modifyQuery = `, where: {id: {_eq: "${this.props.viewPost}"}}`);
        this.props.viewUser && (modifyQuery = `, where: {user_id: {_eq: "${this.props.viewUser}"}}`);
        let data = await API.graphql(graphqlOperation(`{
            post(order_by: {date_created: desc}, limit: ${this.state.limit}${modifyQuery}) {
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
                    id
                    username
                }
                }
            }
        }`));
        this.setState({ loading: false, posts: data.data.post, endReached: false, offset: this.state.limit });
    }

    async loadMore() {
        let data = await API.graphql(graphqlOperation(`{
            post(order_by: {date_created: desc}, limit: ${this.state.limit}, offset: ${this.state.offset}) {
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
        this.setState({ posts: this.state.posts.concat(data.data.post), offset: this.state.offset + this.state.limit, endReached: data.data.post.length === 0 ? true : false });
    }

    async deletePost(id) {
        await API.graphql(graphqlOperation(`
            mutation {
                delete_post(where: {id: {_eq: "${id}"}}) {
                  affected_rows
                }
              }
        `));
        //this.setState({ posts: this.state.posts.splice(givenIndex - 1, 1) });
        this.onRefresh(false);
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


    async loadStats() {
        let data = await API.graphql(graphqlOperation(`{
            users_aggregate {
              aggregate {
                count
              }
            }
            post_aggregate {
              aggregate {
                count
              }
            }
          }
          `));
        console.log(data);
        this.setState({ stats: { userCount: data.data.users_aggregate.aggregate.count, postCount: data.data.post_aggregate.aggregate.count } });
    }

    render() {
        function colorize(str) {
            for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
            let color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
            return '#' + Array(6 - color.length + 1).join('0') + color;
        }

        return (
            <FlatList
                ListHeaderComponent={
                    root.desktopWeb &&
                    <View pointerEvents="box-none" style={{ width: root.width, marginLeft: root.marginLeft, marginRight: root.marginRight, paddingLeft: root.sidebarPaddingLeft, paddingRight: 25, marginBottom: -600, zIndex: 0 }}>
                        <Text style={{ height: 35, fontSize: 20 }}>hi, {this.state.username}</Text>
                        <View style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 10, minHeight: 500 }}>
                            <Text>welcome to <Text onPress={() => { console.log("place4pals!") }} style={{ fontWeight: '600' }}>place4pals</Text>!</Text>
                            <Text style={{ marginTop: 10 }}>i'm trying to build a minimalist social media service (think circa 2008 facebook).</Text>
                            <Text style={{ marginTop: 10 }}>no ads, no tracking, no data collection- just a place to pal around.</Text>
                            <Text style={{ marginTop: 10 }}>i spend my weekends and after-work hours on this project. if you like what you see and want to support p4p, you can go <Text onPress={() => { console.log('premium') }} style={{ fontWeight: '600' }}>premium</Text>, check out our <Text onPress={() => { console.log('merch') }} style={{ fontWeight: '600' }}>merch</Text>, or <Text onPress={() => { console.log('donate') }} style={{ fontWeight: '600' }}>donate here</Text>.</Text>
                            <Text style={{ marginTop: 10, textAlign: 'right' }}>thanks,</Text>
                            <Text style={{ marginTop: 0, textAlign: 'right' }}>heythisischris</Text>
                            {this.state.stats &&
                                <View>
                                    <View>
                                        <Text style={{ marginTop: 20, textAlign: 'left', fontSize: 20, fontWeight: '600' }}>the stats so far:</Text>
                                        <Text style={{ marginTop: 5, textAlign: 'left' }}>• <Text style={{ fontWeight: '600' }}>{this.state.stats.userCount}</Text> pals signed up</Text>
                                        <Text style={{ marginTop: 0, textAlign: 'left' }}>• <Text style={{ fontWeight: '600' }}>{this.state.stats.postCount}</Text> posts submitted</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity>
                                            <View style={{ borderWidth: 1, borderColor: '#000000', backgroundColor: colorize('heythisischris'), borderRadius: 10, padding: 5, height: 50, width: 50 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity>
                                            <View style={{ borderWidth: 1, borderColor: '#000000', backgroundColor: colorize('pal1'), borderRadius: 10, padding: 5, height: 50, width: 50, marginLeft: -20, marginTop: 20 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity>
                                            <View style={{ borderWidth: 1, borderColor: '#000000', backgroundColor: colorize('pal3'), borderRadius: 10, padding: 5, height: 50, width: 50, marginLeft: -20, marginTop: 5 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10, marginTop: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text onPress={() => { console.log('about') }} style={{ fontWeight: '600', color: '#000000', fontSize: 12 }}>about</Text><Text style={{ color: '#bbbbbb', fontSize: 12 }}> - </Text>
                                <Text onPress={() => { console.log('team') }} style={{ fontWeight: '600', color: '#000000', fontSize: 12 }}>team</Text><Text style={{ color: '#bbbbbb', fontSize: 12 }}> - </Text>
                                <Text onPress={() => { console.log('privacy') }} style={{ fontWeight: '600', color: '#000000', fontSize: 12 }}>privacy</Text><Text style={{ color: '#bbbbbb', fontSize: 12 }}> - </Text>
                                <Text onPress={() => { console.log('terms') }} style={{ fontWeight: '600', color: '#000000', fontSize: 12 }}>terms</Text>
                            </View>
                            <Text style={{ color: '#000000', fontSize: 12 }}>© {new Date().getFullYear()} place4pals</Text>
                        </View>
                    </View>
                }
                stickyHeaderIndices={root.desktopWeb ? [0] : null}
                data={this.state.posts}
                renderItem={({ item }) => (
                    <View style={{ width: root.width, marginLeft: root.marginLeft, marginRight: root.marginRight, paddingRight: root.mainbarPaddingRight, paddingLeft: root.desktopWeb ? 40 : 0 }}>
                        <View style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, minHeight: 50, marginBottom: 10, marginTop: 35 }}>
                            <View style={{ marginTop: -35, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('viewUser', { userId: item.user.id }); }} activeOpacity={1}>
                                    <View style={{ borderWidth: 1, borderColor: '#000000', backgroundColor: colorize(item.user.username), borderRadius: 10, padding: 5, height: 50, width: 50 }} />
                                </TouchableOpacity>
                                <View style={{ marginTop: root.allWeb ? -4 : 5, marginLeft: 5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignSelf: 'stretch', paddingRight: 55 }}>
                                        <Text numberOfLines={1} onPress={() => { this.props.navigation.navigate('viewPost', { postId: item.id }); }} style={{ marginBottom: 5, fontSize: 22 }}>{item.title}</Text>
                                        {this.state.postOptions === item.id ?
                                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                                {this.state.userId === item.user.id &&
                                                    <Text style={{ marginLeft: 10, color: '#ff0000' }} onPress={() => { this.deletePost(item.id) }}>Delete</Text>
                                                }
                                                <Text style={{ marginLeft: 10, color: '#000000' }} onPress={() => { console.log("share post!") }}>Share</Text>
                                                <Text style={{ marginLeft: 10, color: '#000000' }} onPress={() => { console.log("save post!") }}>Save</Text>
                                                <Text style={{ marginLeft: 15, marginRight: 5, color: '#000000' }} onPress={() => { this.setState({ postOptions: null }); }}>🗙</Text>
                                            </View> :
                                            <TouchableOpacity style={{ paddingLeft: 30, height: 30 }} onPress={() => {
                                                Platform.OS === 'ios' ?
                                                    ActionSheetIOS.showActionSheetWithOptions(
                                                        {
                                                            options: this.state.userId === item.user.id ? ['Cancel', 'Delete', 'Share', 'Save'] : ['Cancel', 'Share', 'Save'],
                                                            destructiveButtonIndex: this.state.userId === item.user.id ? 1 : null,
                                                            cancelButtonIndex: 0,
                                                        },
                                                        buttonIndex => {
                                                            if (this.state.userId === item.user.id) {
                                                                if (buttonIndex === 1) {
                                                                    this.deletePost(item.id)
                                                                }
                                                                else if (buttonIndex === 2) {
                                                                    Share.share({
                                                                        message: `${item.title} - ${item.content.substr(0, 50)}...`,
                                                                        url: `https://p4p.io/app/feed/viewPost?postId=${item.id}`
                                                                    });
                                                                }
                                                            }
                                                            else {
                                                                //normal non-destructive actions
                                                                if (buttonIndex === 1) {
                                                                    Share.share({
                                                                        message: `${item.title} - ${item.content.substr(0, 50)}...`,
                                                                        url: `https://p4p.io/app/feed/viewPost?postId=${item.id}`
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    ) : this.setState({ postOptions: item.id });
                                            }}>
                                                <Text>. . . </Text>
                                            </TouchableOpacity>}
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignSelf: 'stretch', paddingRight: 55 }}>
                                        <Text>by <Text onPress={() => { this.props.navigation.navigate('viewUser', { userId: item.user.id }); }} style={{ fontWeight: '600' }}>{item.user.username}</Text></Text>
                                        <Text>{new Date(item.date_created).toLocaleDateString(('en-US', {
                                            day: "numeric",
                                            month: "numeric",
                                            year: "numeric"
                                        }))} @ {new Date(item.date_created).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ padding: 10 }}>
                                <HTML
                                    html={item.content}
                                    imagesMaxWidth={root.imageWidth}
                                    onLinkPress={(event, href) => { WebBrowser.openBrowserAsync(href) }}
                                    allowedStyles={['a', 'b', 'i', 'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'p', 'br', 'hr', 'img', 'iframe']}
                                    tagsStyles={{ a: { fontSize: 14 }, b: { fontWeight: '600', fontSize: 14 }, i: { fontStyle: 'italic', fontSize: 14 }, h1: { fontWeight: '600', fontSize: 20 }, h2: { fontWeight: '600', fontSize: 19 }, h3: { fontWeight: '600', fontSize: 16 }, ol: { fontSize: 14 }, ul: { fontSize: 14 }, li: { fontSize: 14 }, p: { fontSize: 14 }, br: { fontSize: 14 }, hr: { fontSize: 14 }, img: { marginLeft: root.desktopWeb ? 0 : -16, marginRight: root.desktopWeb ? 0 : -16 }, iframe: { marginLeft: root.desktopWeb ? 0 : -16, marginRight: root.desktopWeb ? 0 : -16 } }}
                                />
                            </View>
                            {item.comments.map((innerItem, innerIndex) => {
                                return (
                                    <View key={innerIndex} style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}>
                                        <Text><Text onPress={() => { this.props.navigation.navigate('viewUser', { userId: innerItem.user.id }); }} style={{ fontWeight: '600' }}>{innerItem.user.username}</Text>: {innerItem.content}</Text>
                                    </View>
                                )
                            })}
                            <TextInput inputAccessoryViewID='main' style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, margin: 10 }} placeholder='Add a comment' returnKeyType='send' type='text'
                                onSubmitEditing={(event) => { this.addComment(event.nativeEvent.text, item.id); this.setState({ commentInputs: { ...this.state.commentInputs, [item.id]: '' } }); }}
                                onChangeText={comment => { this.setState({ commentInputs: { ...this.state.commentInputs, [item.id]: comment } }); }}
                                //multiline={true}
                                value={this.state.commentInputs[item.id] || ''} />
                        </View>
                    </View>
                )}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.loading}
                        onRefresh={this.onRefresh.bind(this)}
                        colors={["#000000"]}
                        tintColor='#000000'
                        titleColor="#000000"
                        title=""
                    />}
                onEndReached={() => { if (!this.props.viewPost && !this.props.viewUser && !this.state.endReached) { this.loadMore() } }}
                ListEmptyComponent={<View style={root.desktopWeb && { width: '100vw', height: 'calc(100vh - 80px)', overflowY: 'scroll' }}></View>}
            />
        );
    }
}