import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, Text, View, Platform } from 'react-native';
import { LoadingComponent } from '../components/LoadingComponent';
import { GiftedChat } from 'react-native-gifted-chat';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as root from '../Root';
import { useMutation, useSubscription, gql } from "@apollo/client";

export default function ChatScreen({ route, navigation }: any) {
  const [state, setState] = useState({ loading: false });
  const [userId, setUserId] = useState('');

  React.useEffect(() => {
    const asyncFunction = async () => {
      let userId = (await Auth.currentSession()).idToken.payload.sub;
      setUserId(userId);
    }
    asyncFunction();
  }, []);

  const { loading, error, data } = useSubscription(
    gql`subscription {
      chat(order_by: {date: ${Platform.OS !== 'web' ? 'desc' : 'asc'}}, limit: 100) {
        _id: id
        createdAt: date
        user_id
        typing
        text: content
        user {
          _id: id
          name: username
        }
      }
    }`);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
      <View style={{ width: root.desktopWeb ? root.width - 80 : '100%', height: '85%', borderColor: '#aaaaaa', borderWidth: 1 }}>
        {data &&
          <GiftedChat
            messagesContainerStyle={{ width: '100%' }}
            renderFooter={() => <View style={{ height: 10 }} />}
            multiline={false}
            inverted={Platform.OS !== 'web'}
            alwaysShowSend={true}
            showUserAvatar={true}
            renderUsernameOnMessage={true}
            messages={data.chat}
            onSend={async (messages) => {
              await API.graphql(graphqlOperation(`mutation($content: String) {
                insert_chat_one(object: {content: $content}) {
                  id
                }
              }`, { content: messages[0].text }));
            }}
            user={{
              _id: userId,
            }}
            infiniteScroll
          />
        }
      </View>
      {state.loading && <LoadingComponent />}
    </View>
  );
}