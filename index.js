import { registerRootComponent } from "expo";
import App from "./src/app/_layout";

import TrackPlayer from "react-native-track-player";
import { ModuleExports } from "./PlaybackService";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
// AppRegistry.registerComponent(...);
TrackPlayer.registerPlaybackService(() => ModuleExports);
