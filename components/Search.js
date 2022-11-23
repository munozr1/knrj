import React, { useState } from "react";
import { Feather, Entypo } from "@expo/vector-icons";
import { StyleSheet, TextInput, View, Keyboard } from "react-native";
import { SpotifyContext } from "../providers/SpotifyProvider";



const searchBar = () => {
  const [searchSong, setSearchSong] = useState("");
  const [clicked, setClicked]=useState(false);
  return (
    <View style={styles.searchContainer}>
      <View
        style={
          clicked
            ? styles.searchClicked
            : styles.searchUnclicked
        }
      >
        {/* search Icon */}
        <Feather
          name="search"
          size={20}
          color="black"
          style={{ marginLeft: 1 }}
        />
        {/* Input field */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchSong}
          onChangeText={setSearchSong}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Entypo name="cross" size={20} color="black" style={{ padding: 1 }} onPress={() => {
              setSearchSong("")
          }}/>
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
          ></Button>
        </View>
      )}
    </View>
  );
};
export default searchBar;

// styles
const styles = StyleSheet.create({
  searchContainer: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  searchUnclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchClicked: {
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  searchInput: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
});




