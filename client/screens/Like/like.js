import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import ImageCustom from "../../components/custom/imageCustom";

import { useEffect, useState } from "react";
import { getLikeListApi, searchUserLikeApi } from "../../api/postApi";
import useDebounce from "../../hook/hooks";

const LikeScreen = ({ navigation }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const route = useRoute();

  const [q, setQ] = useState("");

  const [results, setResults] = useState([]);

  const [isSearch, setIsSearch] = useState(false);

  const debounceValue = useDebounce(q, 500);

  useEffect(() => {
    getLikeList();
  }, []);

  useEffect(() => {
    getSearchResults();
  }, [debounceValue]);

  const getSearchResults = async () => {
    if (debounceValue !== "") {
      setLoading(true);
      let postID = route?.params?.id;

      const req = await searchUserLikeApi(postID, debounceValue);
      if (req && req?.status) {
        setResults(req.results);
        setIsSearch(true);
        setLoading(false);
      }
    } else {
      setIsSearch(false);
    }
  };

  const getLikeList = async () => {
    setLoading(true);
    let postID = route?.params?.id;
    const req = await getLikeListApi(postID);
    if (req && req?.status) {
      setList(req.list);
      setLoading(false);
    }
  };

  const handleGoToPerScreen = (selectedUserId) => {
    setQ("");
    navigation.navigate("Personal", {
      type: "viewProfile",
      authorID: selectedUserId,
    });
  };

  const handleChangeText = (text) => {
    setQ(text);
  };

  const renderLikeList = ({ item }) => {
    return (
      <View
        key={item._id}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => handleGoToPerScreen(item.user._id.toString())}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <ImageCustom
              resizeMode="cover"
              style={{ width: 45, height: 45 }}
              type={"avatar"}
              source={{
                uri: item.user.picturePath,
              }}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 5,
                flexWrap: "wrap",
              }}
            >
              <View
                style={{
                  marginLeft: 5,
                  marginBottom: 2,
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 1 }}>
                  {item.user?.username}
                </Text>
                {item.user?.displayName && (
                  <Text style={{ fontWeight: 400, color: "grey" }}>
                    {item.user?.displayName}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.search}>
          <View style={styles.wrapIcon}>
            <Icon name="search1" size={20} color="black" />
          </View>
          <TextInput
            placeholder="Tìm kiếm...."
            style={styles.input}
            onChangeText={handleChangeText}
          />
        </View>
      </View>
      {!loading ? (
        <FlatList
          data={isSearch ? results : list}
          renderItem={renderLikeList}
        />
      ) : (
        <ActivityIndicator size={"small"} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    marginBottom: 5,
  },
  search: {
    marginHorizontal: 10,
    flex: 1,
    backgroundColor: "rgb(239, 239, 239)",
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 20,
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

export default LikeScreen;
