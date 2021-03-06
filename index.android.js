/**
 * Stalkgram React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import {MainComponent} from "./app/MainComponent";
import {AppRegistry} from "react-native";
import loadTranslations from "./app/translations/config";

loadTranslations();

AppRegistry.registerComponent('MainComponent', () => MainComponent);
