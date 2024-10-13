import { useEffect, useState } from "react";
import { Song } from "../types/song";

function useMultiSelect<T>() {
    const [multiselectedSongs, setMultiselectedSongs] = useState<T[]>([]);
    const [multiselectMode, setMultiselectMode] = useState(false);

    useEffect(() => {
        if (multiselectedSongs.length == 0) {
            setMultiselectMode(false);
        } else {
            setMultiselectMode(true);
        }
    }, [multiselectedSongs]);
}
export default useMultiSelect;
