import React, { useRef } from "react";
import { Tabs, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, TouchableOpacity } from "react-native";
import CreatePlaylistBottomSheet from "../../Components/BottomSheets/CreatePlaylistBottomSheet";

export default function TabLayout() {
    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#9b59b6",
                    tabBarActiveBackgroundColor: "#fbfcfc",

                    tabBarStyle: {
                        height: 80,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Playlists",
                        tabBarLabelStyle: {
                            fontSize: 12,
                        },
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons
                                name="library-music"
                                size={24}
                                color={color}
                                style={{ marginTop: 16 }}
                            />
                        ),
                        headerRight: () => (
                            <TouchableOpacity onPress={handleOpenPress}>
                                <MaterialIcons
                                    name="add"
                                    size={24}
                                    style={{ marginRight: 16 }}
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="ytmp3"
                    options={{
                        title: "YTmp3",
                        tabBarLabelStyle: {
                            fontSize: 12,
                        },
                        href: null, // remove from the tab bar
                    }}
                />
                <Tabs.Screen
                    name="local"
                    options={{
                        title: "Local files",
                        tabBarLabelStyle: {
                            fontSize: 12,
                        },
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons
                                name="manage-search"
                                size={24}
                                color={color}
                                style={{ marginTop: 16 }}
                            />
                        ),
                        headerRight: () => (
                            <TouchableOpacity>
                                <MaterialIcons
                                    name="autorenew"
                                    size={24}
                                    style={{ marginRight: 16 }}
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Tabs>
            <CreatePlaylistBottomSheet ref={bottomSheetRef} />
        </>
    );
}
