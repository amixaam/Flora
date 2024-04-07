import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import LocalFilesTab from "./local";
import PlaylistsTab from ".";
import CustomTopBar from "../../Components/CustomTopBar";
import PlaylistList from "../(playlist)/[playlist]";

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
                    tabBarLabel: "Local files",
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialCommunityIcons
                            name={
                                focused
                                    ? "folder-search"
                                    : "folder-search-outline"
                            }
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
