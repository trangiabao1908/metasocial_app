import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useRef } from "react";

const SwipeableView = ({
  children,
  handleDelCommentPost,
  handleOpenEditComment,
  setVisible,
  isAuthor,
}) => {
  const swipeableRef = useRef(null);

  const handleCloseSwipe = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const renderRightActionsIsAuthor = () => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={() => {
            handleCloseSwipe();
            handleOpenEditComment();
          }}
        >
          <View style={[styles.btn, { backgroundColor: "grey" }]}>
            <Entypo name="edit" size={25} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleCloseSwipe();
            handleDelCommentPost();
          }}
        >
          <View style={[styles.btn, { backgroundColor: "red" }]}>
            <Entypo name="trash" size={25} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRightActionIsNotAuthor = () => {
    return (
      <View style={styles.rightActionsIsNotAuthor}>
        <View style={[styles.btn, { backgroundColor: "red" }]}>
          <MaterialIcons name="report" size={25} color="white" />
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={
          isAuthor ? renderRightActionsIsAuthor : renderRightActionIsNotAuthor
        }
        overshootRight={false}
        overshootLeft={false}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  rightActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rightActionsIsNotAuthor: {
    display: "flex",
  },

  btn: {
    paddingHorizontal: 15,
    flex: 1,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SwipeableView;
