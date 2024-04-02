import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { forwardRef, useCallback, useMemo } from "react";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

const EditSongBottomSheet = ({ song, ref }) => {
    const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
        />
    ));

    return (
        <BottomSheet
            ref={ref}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{
                borderRadius: 50,
            }}
            backdropComponent={renderBackdrop}
        >
            <View>
                <Text>Hello</Text>
            </View>
        </BottomSheet>
    );
};

export default EditSongBottomSheet;
