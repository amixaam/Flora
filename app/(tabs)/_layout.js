import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import LocalFilesTab from "./local";
import PlaylistsTab from ".";
import YTmp3Tab from "./ytmp3";

const Tab = createMaterialBottomTabNavigator();

export default function TabLayout() {
    return (
        <Tab.Navigator
            activeColor="#E8DEF8"
            style={{
                backgroundColor: "#16151B",
            }}
            shifting={true}
            theme={{
                colors: {
                    secondaryContainer: "#2B2931",
                    elevation: "black",
                },
            }}
        >
            <Tab.Screen
                name="index"
                component={PlaylistsTab}
                options={{
                    tabBarLabel: "Playlists",
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialCommunityIcons
                            name={
                                focused
                                    ? "music-box-multiple"
                                    : "music-box-multiple-outline"
                            }
                            color={color}
                            size={26}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="local"
                component={LocalFilesTab}
                options={{
                    tabBarLabel: "Songs",
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialCommunityIcons
                            name={focused ? "music-note" : "music-note-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="ytmp3"
                component={YTmp3Tab}
                options={{
                    tabBarLabel: "YTmp3",
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialCommunityIcons
                            name={focused ? "download" : "download-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
