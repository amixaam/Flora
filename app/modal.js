import { View } from "react-native";
import { Link, router } from "expo-router";
export default function Modal() {
    const isPresented = router.canGoBack();
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            {!isPresented && <Link href="../">Dismiss</Link>}
        </View>
    );
}
