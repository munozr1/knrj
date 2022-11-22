import * as React from "react";
import { SearchBar } from "@rneui/base";





const searchBar = () => 
{
  const [searchSong, setSearchSong] = useState("");
  
  return (
     <View style ={styles.searchContainer}>
      <SafeAreaView>
      <TextInput
      style ={styles.songInput}
      value={searchSong}
      onChangeText={setSearchSong}
      placeholder="Search Song"
      />
      </SafeAreaView>
      </View>
  )
  
}

export default searchBar

const styles = StyleSheet.create
(
  {
    searchContainer:
    {
      backgroundColor:'black',
      justifyContent: 'center',
      alignItems: 'center',

    },
    songInput:
    {
      margin: 15,
      backgroundColor:"white",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      borderWidth: 1,
      borderRadius: 10
    },



  }



)






