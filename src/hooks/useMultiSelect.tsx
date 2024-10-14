import { useEffect, useState } from "react";

function useMultiSelect<T>() {
    const [multiselectedItems, setMultiselectedItems] = useState<T[]>([]);
    const [multiselectMode, setMultiselectMode] = useState(false);

    useEffect(() => {
        if (multiselectedItems.length == 0) {
            setMultiselectMode(false);
        } else {
            setMultiselectMode(true);
        }
    }, [multiselectedItems]);

    const select = (item: T) => {
        setMultiselectedItems([...multiselectedItems, item]);
    };

    const deselect = (item: T) => {
        setMultiselectedItems(multiselectedItems.filter((s) => s !== item));
    };

    const toggle = (item: T) => {
        if (multiselectedItems.includes(item)) {
            deselect(item);
        } else {
            select(item);
        }
    };

    const setSelection = (items: T[]) => {
        setMultiselectedItems(items);
    };

    const deselectAll = () => {
        setMultiselectedItems([]);
    };

    return {
        multiselectedItems,
        multiselectMode,
        select,
        deselect,
        toggle,
        setSelection,
        deselectAll,
    };
}
export default useMultiSelect;
