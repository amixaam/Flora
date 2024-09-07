import { Colors, IconSizes } from "../../styles/constants";
import IconButton from "./IconButton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
