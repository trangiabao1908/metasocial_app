import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

const Header = ({ setQ, setIsSearch, q, isSearch }) => {
  const handleChangeText = (text) => {
    setIsSearch(true);
    setQ(text);
  };

  const handleCancelSearch = () => {
    setQ("");
    setIsSearch(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <View style={styles.wrapIcon}>
          <Icon name="search1" size={20} color="black" />
        </View>
        <TextInput
          value={q}
          style={styles.input}
          placeholder="Tìm kiếm...."
          onChangeText={(text) => handleChangeText(text)}
        />
      </View>
      {isSearch && (
        <View style={styles.btnCancel}>
          <TouchableOpacity onPress={handleCancelSearch}>
            <Text style={{ fontSize: 16, textAlign: "center" }}>Hủy</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { display: "flex", flexDirection: "row" },
  search: {
    marginHorizontal: 10,
    flex: 1,
    backgroundColor: "rgb(239, 239, 239)",
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
  },

  input: {
    flex: 1,
    height: 35,
    borderRadius: 8,
  },

  wrapIcon: {
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  btnCancel: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    paddingHorizontal: 5,
    // backgroundColor: "red",
  },
});
export default Header;
