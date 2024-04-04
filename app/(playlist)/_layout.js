import { Stack, Tabs, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import EditPlaylistOptionsBottomSheet from "../../Components/BottomSheets/EditPlaylistOptionsBottomSheet";
import { useRef } from "react";

export default function DefaultLayout() {
    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="[playlist]"
                    options={{
                        title: "playlist",
                        headerRight: () => (
                            <TouchableOpacity onPress={handleOpenPress}>
                                <MaterialIcons name="settings" size={24} />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>
            <EditPlaylistOptionsBottomSheet ref={bottomSheetRef} />
        </>
    );
}
