import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SpotifyContext } from '../providers/SpotifyProvider';
import { DBContext } from '../providers/FirestoreProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from "expo-blur"

const SongTouchable = ({ item, textColor, backgroundColor, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.songCard, backgroundColor]}>
        <Image style={styles.albumLogo} source={item.album.images[1]} />
        <View style={[styles.itemTwo]}>
            <Text style={[styles.title, textColor]}>{item.name}</Text>
            <Text style={[styles.artists, textColor]}>{item.album.artists[0].name}</Text>
        </View>
    </TouchableOpacity>
);

const searchmodal = (props) => {

    const [searchSong, setSearchSong] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const { enqueue } = React.useContext(DBContext);
    const { play, search } = React.useContext(SpotifyContext);

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
                textColor={{ color }}
                backgroundColor={{ backgroundColor }}
                onPress={async () => {
                    setSelectedId(item.id)
                    //const res = await play(item.id);
                    await enqueue(item.id);

                    console.log('Song added to queue: ', item.id);
                }}
            />
        );
    };

    return (
        <>
            <View style={[styles.textContainer]}>
                <TextInput
                    style={styles.input}
                    placeholder='Enter a song'
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

                <BlurView intensity={1} style={[styles.footer]}>
                    <TouchableOpacity onPress={props.close}>
                        <Ionicons name="close" size={30} style={[{
                            marginLeft: 25,
                            marginRight: 25,
                            marginBottom: 2
                        }]}
                        />
                    </TouchableOpacity>
                </BlurView>
            </View>


        </>
    );
};

export default searchmodal;

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
    resultsContainer: {
        flex: 1,
        marginTop: 0,
        marginBottom: 5,
        width: '97%',
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
});