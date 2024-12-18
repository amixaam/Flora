import { withLayoutContext } from "expo-router";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MiniPlayer from "../../Components/UI/UI chunks/MiniPlayer";
import { IconSizes, Spacing } from "../../styles/constants";

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
                sceneAnimationEnabled={true}
                sceneAnimationType="shifting"
                theme={{
                    colors: {
                        secondaryContainer: "#2B2931",
                        elevation: "black",
                    },
                }}
                barStyle={{
                    height: Spacing.bottomTab + insets.bottom,
                }}
            >
                <MaterialBottomTabs.Screen
                    name="(home)"
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ focused, color }: any) => (
                            <MaterialCommunityIcons
                                testID="HomeTabIcon"
                                name={focused ? "home" : "home-outline"}
                                size={IconSizes.md}
                                color={color}
                            />
                        ),
                    }}
                />
                <MaterialBottomTabs.Screen
                    name="playlists"
                    options={{
                        tabBarLabel: "Playlists",
                        tabBarIcon: ({ focused, color }: any) => (
                            <MaterialCommunityIcons
                                testID="PlaylistsTabIcon"
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
                                testID="AlbumsTabIcon"
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
                                testID="SongsTabIcon"
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
                    bottom: Spacing.bottomTab + insets.bottom,
                    left: 0,
                    right: 0,
                }}
            />
        </>
    );
}
