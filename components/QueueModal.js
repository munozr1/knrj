import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import { SpotifyContext } from '../providers/SpotifyProvider';
import { DBContext } from '../providers/FirestoreProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from "expo-blur"

const QueueTouchable = ({ item, textColor, backgroundColor, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.songCard, backgroundColor]}>
        <View style={[styles.itemTwo]}>
            <Text style={[styles.title, textColor]}>{}</Text>
            {
            console.log(item)
            }
        </View>
    </TouchableOpacity>
);

const queuemodal = async (props) => {

    const [queueResults, setQueueResults] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const { queue } = React.useContext(DBContext);
    
    const queueData = async () => {
        console.log('eventmodal => queue()');
        console.log('Show Queue');
         if (queue != "") {
          const res = await queue();
          setQueueResults(res);
        }
      }

    const renderQueueItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "transparent" : "white";
        const color = item.id === selectedId ? 'black' : 'black';

        return (
            <QueueTouchable
                item={item}
                textColor={{ color }}
                backgroundColor={{ backgroundColor }}
                onPress={async () => {
                }}
            />
        );
    };

    return (
        <>
            {queueData()}
             <View style={styles.queueContainer}>
                <FlatList
                    data={queueResults}
                    renderItem={renderQueueItem}
                    keyExtractor={(item) => item.id}
                    //extraData={selectedId}
                />

                <View style={[styles.footer]}>
                    <TouchableOpacity onPress={props.close}>
                        <Ionicons name="close" size={30} style={[{
                            marginLeft: 25,
                            marginRight: 25,
                            marginBottom: 2
                        }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            

        </>
    );
};

export default queuemodal;

const styles = StyleSheet.create({
    input: {
        padding: 10,
        height: 35,
        marginTop: 12,
        marginLeft: 5,
        marginRight: 5,
        width: 300,
        textAlign: 'left',
        fontSize: 20,
        borderRadius: 15,
        backgroundColor: 'ghostwhite',
        opacity: 1
    },
    textContainer: {
        backgroundColor: "white",
        borderRadius: 0,
        borderWidth: 0,
        height: 50,
        marginTop: 5,
        marginBottom: 0,
        opacity: 1,
        padding: 0,
    },
    queueContainer: {
        backgroundColor: "red",
        borderRadius: 17,
        height: 500,
        marginBottom: 5,
        marginBottom: 25,
        opacity: 1
      },
    songCard: {
        padding: 5,
        marginVertical: 8,
        marginHorizontal: 16,
        fontSize: 15,
        flexDirection: 'row',
        backgroundColor: 'green',
    },
    itemTwo: {
        padding: 0,
        marginVertical: 0,
        marginHorizontal: 0,
        fontSize: 15,
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: 'red',
        flex: 1,
    },
    albumLogo: {
        width: 90,
        height: 90,
        marginRight: 20
    },
    title: {
        paddingTop: 7,
        textAlign: 'center',
        fontSize: 17
    },
    artists: {
        paddingTop: 0,
        textAlign: 'center'
    },
    footer: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white'
    },
    container: {
        borderRadius: 17,
        height: 130,
        marginBottom: 25,
        opacity: .9
      },
    shadow: {
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 1 / 3,
        elevation: 1,
        backgroundColor: "white", // invisible color
      },
});
