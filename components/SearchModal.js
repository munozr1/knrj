import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';
import { SpotifyContext } from '../providers/SpotifyProvider';
import { DBContext } from '../providers/FirestoreProvider';
import Ionicons from '@expo/vector-icons/Ionicons';

const SongTouchable = ({ item, selected, textColor, backgroundColor, onPress, onPressPlay, onPressQueue }) => (
    <TouchableOpacity onPress={onPress} style={[styles.songCard, backgroundColor]}>
        <Image style={styles.albumLogo} source={item.album.images[1]} />
        <View style={[styles.itemTwo]}>
            <Text style={[styles.title, textColor]}>{item.name}</Text>
            <Text style={[styles.artists, textColor]}>{item.album.artists[0].name}</Text>

            {
                (selected) ?
                    <View style={{ flex: 1, flexDirection: 'row', paddingTop: 6 }}>
                        <TouchableOpacity onPress={onPressPlay}>
                            <Ionicons name={"play"} size={25} style={[{
                                marginRight: 30,
                                marginBottom: 3
                            }]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPressQueue}>
                            <Ionicons name={"add"} size={28} style={[{
                                marginRight: 30,
                                marginBottom: 3
                            }]} />
                        </TouchableOpacity>
                    </View>
                    :
                    null
            }
        </View>
    </TouchableOpacity>
);

const searchmodal = (props) => {

    const [searchSong, setSearchSong] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isQueueModal, setQueueModal] = useState(false);

    const { enqueue } = React.useContext(DBContext);
    const { play, search } = React.useContext(SpotifyContext);

    const popupModal = () => {
        setQueueModal(true);
        setTimeout(() => {
            setQueueModal(false);
        }, 3000);
    }

    const updateSearch = (song) => {
        setSearchSong(song);
        searchSongs();
    }

    const searchSongs = async () => {
        console.log('eventmodal => search()');
        console.log('Song Entered - ', searchSong);

        if (searchSong != "") {
            const res = await search(searchSong);
            setSearchResults(res.tracks.items);
        }
    }

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "transparent" : "white";
        const color = item.id === selectedId ? 'black' : 'black';

        return (
            <SongTouchable
                item={item}
                selected={item.id === selectedId}
                textColor={{ color }}
                backgroundColor={{ backgroundColor }}
                onPress={async () => {
                    setSelectedId(item.id);
                }}
                onPressPlay={async () => {
                    await play(item.id)
                }}
                onPressQueue={async () => {
                    await enqueue(item.id);
                    popupModal();
                    <View style={styles.container}>
                        <Modal isVisible={isQueueModal}>
                            <View style={styles.modalContainer}>
                                <Image
                                    style={styles.imageContainer}
                                    source={{ uri: item.album.images[1] }}
                                />
                                <Text style={styles.textContainer}>{item.name} added to queue!</Text>
                            </View>
                        </Modal>
                    </View>

                    console.log('Song added to queue:', item.id);
                }}
            >
            </SongTouchable>
        );
    };

    return (
        <>
            <View style={[styles.textContainer]}>
                <TextInput
                    style={styles.input}
                    placeholder='Search for a song...'
                    value={searchSong}
                    onChangeText={updateSearch}
                />
            </View>

            <View style={styles.resultsContainer}>
                <FlatList
                    data={searchResults}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
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

export default searchmodal;

const styles = StyleSheet.create({
    input: {
        padding: 10,
        height: 35,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        width: '97%',
        textAlign: 'center',
        fontSize: 20,
        borderRadius: 17,
        backgroundColor: 'ghostwhite',
    },
    textContainer: {
        height: 45,
        alignContent: 'center',
        borderRadius: 17,
    },
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
        shadowColor: 'black',
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
        textAlign: 'center'
    },
    footer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: 17,
    },
    container:
    {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#66000000"
    },
    modalContainer:
    {
        width: "100%",
        backgroundColor: "white",
        paddingHorizontal: 2,
        paddingVertical: 100,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 5,
        borderColor: "#3388FF"
    },
    textContainer:
    {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 20,
    },
    imageContainer:
    {
        height: 60,
        width: 60,
    },

});