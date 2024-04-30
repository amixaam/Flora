import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialBottomTabNavigator();

export const MaterialBottomTabs = withLayoutContext(Navigator);

export default function TabLayout() {
    return (
        <>
            <MaterialBottomTabs
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
                <MaterialBottomTabs.Screen
                    name="(playlists)"
                    options={{
                        tabBarLabel: "Playlists",
                        tabBarIcon: ({ focused, color }) => (
                            <MaterialCommunityIcons
                                name={
                                    focused
                                        ? "playlist-music"
                                        : "playlist-music-outline"
                                }
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <MaterialBottomTabs.Screen
                    name="local"
                    options={{
                        tabBarLabel: "Songs",
                        tabBarIcon: ({ focused, color }) => (
                            <MaterialCommunityIcons
                                name={
                                    focused
                                        ? "music-note"
                                        : "music-note-outline"
                                }
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
            </MaterialBottomTabs>
        </>
    );
}
