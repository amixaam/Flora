import IconButton from "./IconButton";

const Checkbox = ({ onPress = () => {}, isSelected = false }) => {
    return (
        <IconButton
            onPress={onPress}
            icon={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
        />
    );
};

export default Checkbox;
