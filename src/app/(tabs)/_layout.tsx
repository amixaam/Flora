import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { withLayoutContext } from "expo-router";
import { IconSizes } from "../../styles/constants";
import MiniPlayer from "../../Components/MiniPlayer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { Navigator } = createMaterialBottomTabNavigator();

export const MaterialBottomTabs = withLayoutContext(Navigator);

export default function TabLayout() {
    const insets = useSafeAreaInsets();
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
                        tabBarIcon: ({ focused, color }: any) => (
                            <MaterialCommunityIcons
                                name={
                                    focused
                                        ? "playlist-music"
                                        : "playlist-music-outline"
                                }
                                size={IconSizes.md}
                                color={color}
                            />
                        ),
                    }}
                />
                <MaterialBottomTabs.Screen
                    name="albums"
                    options={{
                        tabBarLabel: "Albums",
                        tabBarIcon: ({ color }: any) => (
                            <MaterialCommunityIcons
                                name="album"
                                size={IconSizes.md}
                                color={color}
                            />
                        ),
                    }}
                />
                <MaterialBottomTabs.Screen
                    name="songs"
                    options={{
                        tabBarLabel: "Songs",
                        tabBarIcon: ({ focused, color }: any) => (
                            <MaterialCommunityIcons
                                name={
                                    focused
                                        ? "music-note"
                                        : "music-note-outline"
                                }
                                size={IconSizes.md}
                                color={color}
                            />
                        ),
                    }}
                />
            </MaterialBottomTabs>
            <MiniPlayer
                style={{
                    position: "absolute",
                    bottom: insets.bottom * 4.3,
                    left: 0,
                    right: 0,
                }}
            />
        </>
    );
}
