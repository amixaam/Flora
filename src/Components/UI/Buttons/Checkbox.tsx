import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, IconSizes } from "../../../styles/constants";

const Checkbox = ({ isSelected = false }) => {
    return (
        <MaterialCommunityIcons
            name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
            size={IconSizes.md}
            style={[{ color: Colors.primary }]}
        />
    );
};

export default Checkbox;
