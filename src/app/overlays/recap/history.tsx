import { View } from "react-native";
import SwipeDownScreen from "../../../Components/UI/Utils/SwipeDownScreen";
import SheetHeader from "../../../Components/UI/Headers/SheetHeader";

const RecapHistoryScreen = () => {
    return (
        <SwipeDownScreen
            header={<SheetHeader title="Recap history" />}
        ></SwipeDownScreen>
    );
};

export default RecapHistoryScreen;
