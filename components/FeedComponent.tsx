import React, { useState, useEffect } from 'react';
import { Text, View, RefreshControl, TextInput, TouchableOpacity, Keyboard, ActionSheetIOS, Platform, FlatList, Dimensions, Linking, Share } from 'react-native';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as root from '../Root';
import { useFocusEffect } from '@react-navigation/native';
import HTML from 'react-native-render-html';

export default function FeedScreen({ route, navigation }: any) {
    const [state, setState] = useState({
        loading: false,
        posts: [],
        commentInputs: [],
        modalVisible: false,
        limit: 10,
        offset: 10,
        endReached: false,
        username: null,
        userId: null,
        stats: {}
    });

    // useEffect(() => {}, []);

    useFocusEffect(
        React.useCallback(() => {
            if (!route.params) { route.params = {}; }
            onRefresh();
        }, [])
    );

    const onRefresh = async () => {
        setState({ ...state, loading: true });

        let currentSession = {};
        if (!state.username) {
            const getCurrentSession = async () => {
                currentSession = (await Auth.currentSession()).idToken.payload;
            }
            getCurrentSession();
        }

        let modifyQuery = '';
        route.params.viewPost && (modifyQuery = `, where: {id: {_eq: "${route.params.viewPost}"}}`);
        route.params.viewUser && (modifyQuery = `, where: {user_id: {_eq: "${route.params.viewUser}"}}`);
        let data = await API.graphql(graphqlOperation(`{
            post(order_by: {date_created: desc}, limit: ${state.limit}${modifyQuery}) {
                id
                title
                content
                date_created
                user {
                id
                username
                }
                comments(order_by: {date_created: asc}) {
                id
                content
                date_created
                user {
                    id
                    username
                }
                }
            }
        }`));
        setState({ ...state, loading: false, posts: data.data.post, endReached: false, offset: state.limit, username: currentSession['custom:username'], userId: currentSession['sub'] });
    }

    const loadMore = async () => {
        let data = await API.graphql(graphqlOperation(`{
            post(order_by: {date_created: desc}, limit: ${state.limit}, offset: ${state.offset}) {
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
        setState({ ...state, posts: state.posts.concat(data.data.post), offset: state.offset + state.limit, endReached: data.data.post.length === 0 ? true : false });
    }

    const deletePost = async (id: string) => {
        await API.graphql(graphqlOperation(`
            mutation {
                delete_post(where: {id: {_eq: "${id}"}}) {
                  affected_rows
                }
              }
        `));
        //setState({ ...state, posts: state.posts.splice(givenIndex - 1, 1) });
        onRefresh(false);
    }

    const deleteComment = async (id: string) => {
        await API.graphql(graphqlOperation(`
            mutation {
                delete_comment(where: {id: {_eq: "${id}"}}) {
                  affected_rows
                }
              }
        `));
        //setState({ ...state, posts: state.posts.splice(givenIndex - 1, 1) });
        onRefresh(false);
    }

    const addComment = async (content: string, id: string) => {
        Keyboard.dismiss();
        setState({ ...state, loading: true });
        let data = await API.graphql(graphqlOperation(`mutation { insert_comment(objects: {content: "${content}", post_id: "${id}"}) {affected_rows}}`));
        //now reload that specific post's comments
        data = await API.graphql(graphqlOperation(`{
            post(order_by: {date_created: desc}, where: {id: {_eq: "${id}"}}) {
                comments(order_by: {date_created: asc}) {
                id
                content
                date_created
                user {
                    id
                    username
                }
                }
            }
        }`));
        state.posts[state.posts.findIndex(obj => obj.id == id)].comments = data.data.post[0].comments;
        setState({ ...state, loading: false });
    }

    const loadStats = async () => {
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
        setState({ ...state, stats: { userCount: data.data.users_aggregate.aggregate.count, postCount: data.data.post_aggregate.aggregate.count } });
    }

    const colorize = (str: string) => {
        for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
        let color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
        return '#' + Array(6 - color.length + 1).join('0') + color;
    }

    return (
        <FlatList
            style={{ width: '100%', height: 0, marginTop: root.desktopWeb ? 75 : 0 }}
            ListHeaderComponent={
                root.desktopWeb ?
                    <View pointerEvents="box-none" style={{ width: root.width, marginLeft: root.marginLeft, marginRight: root.marginRight, paddingLeft: root.sidebarPaddingLeft, paddingRight: 25, marginBottom: -600, zIndex: 0 }}>
                        <Text style={{ height: 35, fontSize: 20 }}>hi, {state.username}</Text>
                        <View style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 10, minHeight: 500 }}>
                            <Text>welcome to <Text onPress={() => { console.log("place4pals!") }} style={{ fontWeight: '600' }}>place4pals</Text>!</Text>
                            <Text style={{ marginTop: 10 }}>i'm trying to build a minimalist social media service (think circa 2008 facebook).</Text>
                            <Text style={{ marginTop: 10 }}>no ads, no tracking, no data collection- just a place to pal around.</Text>
                            <Text style={{ marginTop: 10 }}>i spend my weekends and after-work hours on this project. if you like what you see and want to support p4p, you can go <Text onPress={() => { console.log('premium') }} style={{ fontWeight: '600' }}>premium</Text>, check out our <Text onPress={() => { console.log('merch') }} style={{ fontWeight: '600' }}>merch</Text>, or <Text onPress={() => { console.log('donate') }} style={{ fontWeight: '600' }}>donate here</Text>.</Text>
                            <Text style={{ marginTop: 10, textAlign: 'right' }}>thanks,</Text>
                            <Text style={{ marginTop: 0, textAlign: 'right' }}>heythisischris</Text>
                            {state.stats &&
                                <View>
                                    <View>
                                        <Text style={{ marginTop: 20, textAlign: 'left', fontSize: 20, fontWeight: '600' }}>the stats so far:</Text>
                                        <Text style={{ marginTop: 5, textAlign: 'left' }}>• <Text style={{ fontWeight: '600' }}>{state.stats.userCount}</Text> pals signed up</Text>
                                        <Text style={{ marginTop: 0, textAlign: 'left' }}>• <Text style={{ fontWeight: '600' }}>{state.stats.postCount}</Text> posts submitted</Text>
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
                    </View> : <View style={{ height: 80, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingLeft: 20, paddingRight: 20, paddingBottom: 10 }}><Text style={{ fontSize: 30 }}>feed</Text></View>
            }
            stickyHeaderIndices={[0]}
            data={state.posts}
            renderItem={({ item, index }) => (
                <View style={{ width: root.width, marginLeft: root.marginLeft, marginRight: root.marginRight, paddingRight: root.mainbarPaddingRight, paddingLeft: root.desktopWeb ? 40 : 0 }} onLayout={event => {
                    item.layout = event.nativeEvent.layout;
                }}>
                    <View style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, minHeight: 50, marginBottom: 10, marginTop: 35 }}>
                        <View style={{ marginTop: -35, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                            <TouchableOpacity onPress={() => { route.params.navigation.navigate('viewUser', { userId: item.user.id }); }} activeOpacity={1}>
                                <View style={{ borderWidth: 1, borderColor: '#000000', backgroundColor: colorize(item.user.username), borderRadius: 10, padding: 5, height: 50, width: 50 }} />
                            </TouchableOpacity>
                            <View style={{ marginTop: root.allWeb ? -4 : 5, marginLeft: 5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignSelf: 'stretch', paddingRight: 55 }}>
                                    <Text numberOfLines={1} onPress={() => { route.params.navigation.navigate('viewPost', { postId: item.id }); }} style={{ marginBottom: 5, fontSize: 22, maxWidth: '90%' }}>{item.title}</Text>
                                    {state.postOptions === item.id ?
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            {state.userId === item.user.id &&
                                                <Text style={{ marginLeft: 10, color: '#ff0000' }} onPress={() => { deletePost(item.id) }}>Delete</Text>
                                            }
                                            <Text style={{ marginLeft: 10, color: '#000000' }} onPress={() => { console.log("share post!") }}>Share</Text>
                                            <Text style={{ marginLeft: 10, color: '#000000' }} onPress={() => { console.log("save post!") }}>Save</Text>
                                            <Text style={{ marginLeft: 15, marginRight: 5, color: '#000000' }} onPress={() => { setState({ ...state, postOptions: null }); }}>🗙</Text>
                                        </View> :
                                        <TouchableOpacity style={{ height: 30 }} onPress={() => {
                                            Platform.OS === 'ios' ?
                                                ActionSheetIOS.showActionSheetWithOptions(
                                                    {
                                                        options: state.userId === item.user.id ? ['Cancel', 'Delete', 'Share', 'Save'] : ['Cancel', 'Share', 'Save'],
                                                        destructiveButtonIndex: state.userId === item.user.id ? 1 : null,
                                                        cancelButtonIndex: 0,
                                                    },
                                                    buttonIndex => {
                                                        if (state.userId === item.user.id) {
                                                            if (buttonIndex === 1) {
                                                                deletePost(item.id)
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
                                                ) : setState({ ...state, postOptions: item.id });
                                        }}>
                                            <Text>. . . </Text>
                                        </TouchableOpacity>}
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignSelf: 'stretch', paddingRight: 55 }}>
                                    <Text>by <Text onPress={() => { route.params.navigation.navigate('viewUser', { userId: item.user.id }); }} style={{ fontWeight: '600' }}>{item.user.username}</Text></Text>
                                    <Text>{new Date(item.date_created).toLocaleDateString(('en-US', {
                                        day: "numeric",
                                        month: "numeric",
                                        year: "numeric"
                                    }))} @ {new Date(item.date_created).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ padding: 10 }}>
                            {item.content ? <HTML
                                html={item.content}
                                imagesMaxWidth={root.imageWidth}
                                onLinkPress={(event, href) => { WebBrowser.openBrowserAsync(href) }}
                                allowedStyles={['a', 'b', 'i', 'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'p', 'br', 'hr', 'img', 'iframe']}
                                tagsStyles={{ a: { fontSize: 14 }, b: { fontWeight: '600', fontSize: 14 }, i: { fontStyle: 'italic', fontSize: 14 }, h1: { fontWeight: '600', fontSize: 20 }, h2: { fontWeight: '600', fontSize: 19 }, h3: { fontWeight: '600', fontSize: 16 }, ol: { fontSize: 14 }, ul: { fontSize: 14 }, li: { fontSize: 14 }, p: { fontSize: 14 }, br: { fontSize: 14 }, hr: { fontSize: 14 }, img: { marginLeft: root.desktopWeb ? 0 : -16, marginRight: root.desktopWeb ? 0 : -16 }, iframe: { marginLeft: root.desktopWeb ? 0 : -16, marginRight: root.desktopWeb ? 0 : -16 } }}
                            /> : <View />}
                        </View>
                        {item.comments.map((innerItem, innerIndex) => {
                            return (
                                <View key={innerIndex} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignSelf: 'stretch', marginLeft: 10, marginRight: 10, marginBottom: 5 }}>
                                    <Text style={{ maxWidth: '90%' }}><Text onPress={() => { route.params.navigation.navigate('viewUser', { userId: innerItem.user.id }); }} style={{ fontWeight: '600' }}>{innerItem.user.username}</Text>: {innerItem.content}</Text>
                                    {state.commentOptions === innerItem.id ?
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            {state.userId === innerItem.user.id &&
                                                <Text style={{ marginLeft: 10, color: '#ff0000' }} onPress={() => { deleteComment(innerItem.id) }}>Delete</Text>
                                            }
                                            <Text style={{ marginLeft: 15, marginRight: 5, color: '#000000' }} onPress={() => { setState({ ...state, commentOptions: null }); }}>🗙</Text>
                                        </View> :
                                        <TouchableOpacity onPress={() => {
                                            Platform.OS === 'ios' ?
                                                ActionSheetIOS.showActionSheetWithOptions(
                                                    {
                                                        options: state.userId === item.user.id ? ['Cancel', 'Delete'] : ['Cancel'],
                                                        destructiveButtonIndex: state.userId === item.user.id ? 1 : null,
                                                        cancelButtonIndex: 0,
                                                    },
                                                    buttonIndex => {
                                                        if (state.userId === item.user.id) {
                                                            if (buttonIndex === 1) {
                                                                deleteComment(innerItem.id)
                                                            }
                                                        }
                                                    }
                                                ) : setState({ ...state, commentOptions: innerItem.id });
                                        }}>
                                            <Text>. . . </Text>
                                        </TouchableOpacity>}
                                </View>
                            )
                        })}
                        <TextInput inputAccessoryViewID='main' style={{ borderWidth: 1, borderColor: '#000000', borderRadius: 10, padding: 5, margin: 10 }} placeholder='Add a comment' returnKeyType='send' type='text'
                            onSubmitEditing={(event) => { addComment(event.nativeEvent.text, item.id); setState({ ...state, commentInputs: { ...state.commentInputs, [item.id]: '' } }); }}
                            onChangeText={comment => { setState({ ...state, commentInputs: { ...state.commentInputs, [item.id]: comment } }); }}
                            //multiline={true}
                            value={state.commentInputs[item.id] || ''}
                            onFocus={!root.desktopWeb && (() => { FlatList.scrollToIndex({ animated: true, index: index, viewOffset: -item.layout.height + 400 }) })} />
                    </View>
                </View>
            )}
            keyExtractor={item => item.id}
            refreshControl={
                <RefreshControl
                    refreshing={state.loading}
                    onRefresh={onRefresh}
                    colors={["#000000"]}
                    tintColor='#000000'
                    titleColor="#000000"
                    title=""
                />}
            onEndReached={() => { if (!route.params.viewPost && !route.params.viewUser && !state.endReached) { loadMore() } }}
        //ListEmptyComponent={<View style={root.desktopWeb && { width: '100vw', height: 'calc(100vh - 80px)', overflowY: 'scroll' }}></View>}
        />
    );
}
