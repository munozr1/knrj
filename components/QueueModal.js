import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { DBContext } from '../providers/FirestoreProvider';
import Ionicons from '@expo/vector-icons/Ionicons';

const QueueTouchable = ({ item, textColor, backgroundColor, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.songCard, backgroundColor]}>
        <View style={[styles.itemTwo]}>
            <Text style={[styles.title, textColor]}>{item}</Text>
        </View>
    </TouchableOpacity>
);

const queuemodal = (props) => {

    const [queueResults, setQueueResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const { queue } = React.useContext(DBContext);

    const loadQueueData = async () => {
        console.log('eventmodal => queue()');

        const res = await queue();
        setQueueResults(res);
    }

    const renderQueueItem = ({ item }) => {
        const backgroundColor = item === selectedItem ? "transparent" : "white";
        const color = item === selectedItem ? 'black' : 'black';

        return (
            <QueueTouchable
                item={item}
                textColor={{ color }}
                backgroundColor={{ backgroundColor }}
                onPress={async () => {
                    setSelectedItem(item);
                    console.log(item);
                }}
            />
        );
    };

    return (
        <>
            <View style={styles.resultsContainer}>
                <FlatList
                    data={queueResults}
                    renderItem={renderQueueItem}
                    keyExtractor={(item) => item}
                    extraData={selectedItem}
                />
            </View>

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
        </>
    );
};

export default queuemodal;

const styles = StyleSheet.create({
    resultsContainer: {
        flex: 1,
        marginBottom: 33,
        width: '100%',
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
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: 17,
    },
});
