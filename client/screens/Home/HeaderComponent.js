import React, { useCallback } from "react";
import { FlatList, SafeAreaView } from "react-native";
import ListStories from "../../components/stories";
const storiesData = [
  {
    id: 1,
  },
];
const HeaderComponent = () => {
  const renderListStories = useCallback(() => {
    return <ListStories />;
  }, []);
  return (
    <SafeAreaView
      style={{
        borderBottomColor: "rgb(219, 219, 219)",
        borderBottomWidth: 0.5,
      }}
    >
      <FlatList
        data={storiesData}
        renderItem={renderListStories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default React.memo(HeaderComponent);
