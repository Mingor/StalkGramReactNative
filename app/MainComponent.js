/**
 * Stalkgram React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from "react";
import {Text, TextInput, View, Image, Clipboard} from "react-native";
import ActionButton from "react-native-action-button";
import AwesomeButton from "react-native-awesome-button";
import {VideoPlayer} from "./components/VideoPlayer";
import {MainView} from "./MainView";
import {Circle} from "react-native-progress";
import styles from "./assets/styles/main-styles";
import I18n from "react-native-i18n";

export class MainComponent extends Component {
    constructor(props) {
        super(props);

        this.mainView = new MainView(this);
        this.mainView.initialize();
    }

    onShare = () => this.mainView.onShare();
    onSetAs = () => this.mainView.onSetAs();
    onDownloadFile = () => this.mainView.onDownloadFile();

    render() {
        var mediaComponent;
        if (this.mainView.isImage()) {
            mediaComponent = <Image
                style={styles.mediaContainer}
                source={this.mainView.getFilePath()}
            />;
        } else {
            mediaComponent = <VideoPlayer
                style={styles.mediaContainer}
                uri={this.mainView.getFilePath()}
            />;
        }

        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View
                    backgroundColor='#00bcd4'
                    style={styles.bar}
                >
                    <Text style={styles.title}>StalkGram React-Native</Text>
                </View>
                <Text
                    style={styles.text}
                >
                    {I18n.t('toolTip')}
                </Text>
                <TextInput
                    placeholder={I18n.t('title')}
                    style={styles.textInput}
                    value={this.mainView.getUrl()}
                    multiline={true}
                    numberOfLines={2}
                    editable={false}
                />
                <View
                    style={styles.buttonsContainer}
                >
                    <AwesomeButton
                        labelStyle={styles.whiteTitle}
                        backgroundStyle={styles.buttons}
                        transitionDuration={200}
                        states={{
                            idle: {
                                text: I18n.t('btnSetAsTitle'),
                                onPress: this.onSetAs,
                                backgroundColor: '#00bcd4',
                            }
                        }}
                    />
                    <AwesomeButton
                        labelStyle={styles.whiteTitle}
                        backgroundStyle={styles.buttons}
                        transitionDuration={200}
                        states={{
                            idle: {
                                text: I18n.t('btnShareTitle'),
                                onPress: this.onShare,
                                backgroundColor: '#00bcd4',
                            }
                        }}
                    />
                </View>

                {this.mainView.isProgressVisible() &&
                <View
                    style={styles.progress}
                >
                    <Circle
                        showsText={true}
                        progress={this.mainView.getProgress()}
                        size={200}
                        unfilledColor='white'
                        color='#00bcd4'
                    />
                </View>
                }


                {!this.mainView.isProgressVisible() &&
                mediaComponent
                }

                <ActionButton
                    buttonColor='#00bcd4'
                    onPress={this.onDownloadFile}
                />
            </View>
        );
    }
}