import SheetHeader from "../../../Components/UI/Headers/SheetHeader";
import SwipeDownScreen from "../../../Components/UI/Utils/SwipeDownScreen";

const RecapHistoryScreen = () => {
    return (
        <SwipeDownScreen
            header={<SheetHeader title="Recap history" />}
        ></SwipeDownScreen>
    );
};

export default RecapHistoryScreen;
