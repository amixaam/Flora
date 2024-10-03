import * as MediaLibrary from "expo-media-library";
import { SaveSong } from "./SaveSong";

export const GetMusicAssets = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
        alert("Permission to access media library was denied");
        return;
    }

    let assets = [];
    let endCursor;
    let hasNextPage = true;

    while (hasNextPage) {
        const {
            assets: batchAssets,
            endCursor: batchEndCursor,
            hasNextPage: batchHasNextPage,
        } = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.audio,
            after: endCursor,
        });

        assets.push(...batchAssets);
        endCursor = batchEndCursor;
        hasNextPage = batchHasNextPage;
    }

    assets.forEach((asset) => {
        SaveSong(asset);
    });
};
