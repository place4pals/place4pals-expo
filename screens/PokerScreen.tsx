import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, Text, View, Platform, TextInput } from 'react-native';
import { LoadingComponent } from '../components/LoadingComponent';
import { GiftedChat } from 'react-native-gifted-chat';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as root from '../Root';
import { useMutation, useSubscription, gql } from "@apollo/client";

export default function PokerScreen({ route, navigation }: any) {
    const [state, setState] = useState({ loading: false });
    const [userId, setUserId] = useState('');
    const [bet, setBet] = useState(0);

    React.useEffect(() => {
        const asyncFunction = async () => {
            let userId = (await Auth.currentSession()).idToken.payload.sub;
            setUserId(userId);
        }
        asyncFunction();
    }, []);

    const { loading, error, data } = useSubscription(
        gql`subscription {
                poker_game {
                    id
                    users {
                        user {
                            id
                            username
                        }
                        pot
                    }
                poker_chat(order_by: {date: ${Platform.OS !== 'web' ? 'desc' : 'asc'}}, limit: 100) {
                    _id: id
                    createdAt: date
                    user_id
                    text: content
                    user {
                        _id: id
                        name: username
                    }
                }
                }
            }`);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
            <View style={{ flexDirection: 'row', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', width: root.width }}>
                <View style={{ width: root.desktopWeb ? '30%' : '100%', height: '85%', borderColor: '#aaaaaa', borderWidth: 1, borderRightWidth: 0 }}>
                    {data &&
                        <GiftedChat
                            messagesContainerStyle={{ width: '100%' }}
                            renderFooter={() => <View style={{ height: 10 }} />}
                            multiline={false}
                            inverted={Platform.OS !== 'web'}
                            alwaysShowSend={true}
                            showUserAvatar={true}
                            renderUsernameOnMessage={true}
                            messages={data.poker_game[0].poker_chat}
                            onSend={async (messages) => {
                                await API.graphql(graphqlOperation(`mutation($content: String, $poker_game_id: uuid) {
                insert_poker_chat_one(object: {content: $content, poker_game_id: $poker_game_id}) {
                  id
                }
              }`, { content: messages[0].text, poker_game_id: data.poker_game[0].id }));
                            }}
                            user={{
                                _id: userId,
                            }}
                            infiniteScroll
                        />
                    }
                </View>
                <View style={{ width: root.desktopWeb ? '70%' : '100%', height: '85%', borderColor: '#aaaaaa', borderWidth: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                    {data && <>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: '80%' }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <PokerChair data={data} seat={1} />
                                <View style={{ height: 50 }} />
                                <PokerChair data={data} seat={2} />
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
                                    <PokerChair data={data} seat={3} />
                                    <PokerChair data={data} seat={4} />
                                    <PokerChair data={data} seat={5} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 600, height: 300, borderRadius: 100, backgroundColor: 'green' }}>
                                    <PokerCard card="🂠" />
                                    <PokerCard card="🂠" />
                                    <PokerCard card="🂠" />
                                    <PokerCard card="🂤" />
                                    <PokerCard card="🃊" />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
                                    <PokerChair data={data} seat={6} />
                                    <PokerChair data={data} seat={7} />
                                    <PokerChair data={data} seat={8} />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <PokerChair data={data} seat={9} />
                                <View style={{ height: 50 }} />
                                <PokerChair data={data} seat={10} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: '20%' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <PokerCard card="🂾" />
                                <PokerCard card="🂵" />
                                <PokerCard card="🃊" />
                                <PokerCard card="🂤" />
                                <PokerCard card="🃊" />
                            </View>
                            <TextInput value={bet.toString()} onChangeText={(val) => { (val.length === 0 || bet.toString() === 'NaN') ? setBet(0) : setBet(parseInt(val)) }} style={{ borderColor: '#000000', borderWidth: 1, borderRadius: 10, margin: 5, width: 100, fontSize: 21, padding: 5, outline: 'none' }} />
                            <TouchableOpacity
                                onPress={async () => {
                                    await API.graphql(graphqlOperation(`mutation($pot: numeric, $poker_game_id: uuid) {
                                    update_poker_user(where: {poker_game_id: {_eq: $poker_game_id}}, _set: {pot: $pot}) {
                                        affected_rows
                                    }
                                  }`, { pot: data.poker_game[0].users.filter((obj: any) => obj.user.id === userId)[0].pot - bet, poker_game_id: data.poker_game[0].id }));
                                    setBet(0);
                                }}
                                style={{ backgroundColor: '#000000', padding: 10, borderRadius: 10, margin: 5 }}>
                                <Text style={{ color: '#ffffff' }}>Bet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: '#000000', padding: 10, borderRadius: 10, margin: 5 }}>
                                <Text style={{ color: '#ffffff' }}>Call</Text>
                            </TouchableOpacity>
                        </View>
                    </>}
                </View>
                {state.loading && <LoadingComponent />}
            </View>
        </View>
    );
}

export function PokerCard({ card }: any) {
    return (
        <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
            <Text selectable={false} style={{
                fontSize: 100, marginTop: -27, marginBottom: -14, marginLeft: -3, marginRight: -3,
                color: ['🂠', '🃁', '🃂', '🃃', '🃄', '🃅', '🃆', '🃇', '🃈', '🃉', '🃊', '🃋', '🃌', '🃍', '🃎', '🂱', '🂲', '🂳', '🂴', '🂵', '🂶', '🂷', '🂸', '🂹', '🂺', '🂻', '🂼', '🂽', '🂾', '🂿'].includes(card) ? '#ff0000' : '#000000'
            }}>
                {card}
            </Text>
        </View>
    );
}

export function PokerChair({ data, seat }: any) {
    const [user, setUser] = React.useState({ user: { username: 'Empty' }, pot: 0 })
    React.useEffect(() => {
        if (data.poker_game[0].users[seat - 1]) {
            setUser(data.poker_game[0].users[seat - 1])
        }
    }, [data])
    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 5 }}>
            <View style={{ backgroundColor: '#444444', height: 100, width: 100, borderRadius: 50 }} />
            <Text style={{ textAlign: 'center' }}>{`${user.user.username}\n(${user.pot})`}</Text>
        </View>
    );
}