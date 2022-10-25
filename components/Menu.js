import { BlurView } from "expo-blur"
import { Text , View, StyleSheet} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"




const menu = (props) => {

  return (
    <BlurView
    style={[styles.container]}
    intensity={70}
    opa
    >
      <TouchableOpacity
      onPress={()=>{props.leave}}
      >
        <Text style={[styles.label, {color: 'red'}]}>Leave Event</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => {props.logout()}}
      >
        <Text style={[styles.label, {color:'red'}]}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={{
        marginTop: 0
      }}
      onPress={()=> {props.exit()}}
      >
        <Text style={[styles.label]}>{'Back'}</Text>
      </TouchableOpacity>
    </BlurView>
  )
}


let styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    textAlign: "center",
    padding: "3%",
    fontWeight: '800',
  },

})


export default menu
