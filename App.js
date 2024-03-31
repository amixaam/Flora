import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
    NavigationBar.setBackgroundColorAsync("transparent");
    let [fontsLoaded, fontError] = useFonts({ Poppins_700Bold });
    if (!fontsLoaded && fontError) return null;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text
                    style={{
                        fontFamily: "Poppins_700Bold",
                        fontSize: 26,
                    }}
                >
                    Open up App.js to start working on your app!
                </Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        justifyContent: "center",
    },
});
