import IconButton from "./IconButton";

const Checkbox = ({ onPress, isSelected }) => {
    return (
        <IconButton
            onPress={onPress}
            icon={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
        />
    );
};

export default Checkbox;
