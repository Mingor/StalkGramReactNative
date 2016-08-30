/**
 * Stalkgram React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    ToolbarAndroid,
    View,
    Image,
    StatusBar,
    Clipboard
} from "react-native";
import ActionButton from "react-native-action-button";
import AwesomeButton from "react-native-awesome-button";
import ToastAndroid from "./native_modules/ToastAndroid";
import FileUtils from "./native_modules/FileUtils";
var Progress = require('react-native-progress');
var RNFS = require('react-native-fs');
var cheerio = require('cheerio');

class StalkgramProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            progress: 0,
            progressVisible: false,
            filePath: '',
            defaultUrlImage: 'http://facebook.github.io/react/img/logo_og.png'
        };
    }

    share() {
        FileUtils.shareFile(this.state.filePath);
    }

    setAs() {
        FileUtils.setImageAs(this.state.filePath);
    }

    showProgress(progress, progressVisible = false) {
        this.setState({progress, progressVisible: progressVisible})
    }

    setFilePath(filePath) {
        this.setState({filePath})
    }

    setUrl(url) {
        this.setState({text: url})
    }

    getParseUrl(responseText) {
        /*
         Function used to get the url from the html response
         */
        let $ = cheerio.load(responseText);
        return $('meta')[10].attribs.content;
    }

    downloadImage(responseText) {
        let imageUrl = this.getParseUrl(responseText);
        this.setUrl(imageUrl);

        const filePath = RNFS.ExternalStorageDirectoryPath + "/" + new Date().getTime() + ".jpg";
        var uploadProgress = (response) => {
            var progress = Math.floor((response.bytesWritten / response.contentLength) * 100);
            this.showProgress(progress, true);
        };

        let config = {
            fromUrl: imageUrl,
            toFile: filePath,
            progress: uploadProgress
        };

        let successFn = (result) => {
            this.showProgress(0);
            this.setFilePath(filePath);
            ToastAndroid.show('Download file correctly', ToastAndroid.SHORT);
            return true
        };

        let errorFn = (err) => {
            this.showProgress(0);
            this.setFilePath('');
            console.warn(err);
            return false
        };

        RNFS.downloadFile(config).promise.then(successFn).catch(errorFn);
    }

    fetchHtml(url) {
        let successResponseTextFn = (response) => {
            return response.text()
        };
        let successResponseFn = (responseText) => {
            return this.downloadImage(responseText);
        };
        let errorFn = (error) => {
            console.warn(error);
        };

        return fetch(url).then(successResponseTextFn).then(successResponseFn).catch(errorFn);
    }

    downloadFile() {
        let success = function (url) {
            this.fetchHtml(url);
        }.bind(this);

        Clipboard.getString().then(success);
    }

    render() {
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
                    Paste the share link here
                </Text>
                <TextInput
                    placeholder="Paste here the link"
                    style={styles.textInput}
                    value={this.state.text}
                />
                <View
                    style={styles.mediaContainer}
                >
                    <AwesomeButton
                        labelStyle={styles.whiteTitle}
                        backgroundStyle={styles.buttons}
                        transitionDuration={200}
                        states={{
                            idle: {
                                text: 'Set as',
                                onPress: this.setAs.bind(this),
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
                                text: 'Share',
                                onPress: this.share.bind(this),
                                backgroundColor: '#00bcd4',
                            }
                        }}
                    />
                </View>
                <View
                    style={styles.progress}
                >
                    {this.state.progressVisible &&
                    <Progress.Circle
                        showsText={true}
                        progress={this.state.progress}
                        size={300}
                    />
                    }
                </View>

                {!this.state.progressVisible &&
                <Image
                    style={styles.image}
                    source={{uri: this.state.filePath ? 'file://' + this.state.filePath : this.state.defaultUrlImage}}
                />
                }

                <ActionButton
                    buttonColor='#00bcd4'
                    onPress={this.downloadFile.bind(this)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    whiteTitle: {
        color: 'white'
    },
    bar: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        paddingTop: 20
    },
    title: {
        color: '#fff'
    },
    text: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        color: '#00bcd4'
    },
    textInput: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 7,
        color: '#00bcd4'
    },
    mediaContainer: {
        flex: 2,
        flexDirection: 'row',
        padding: 10
    },
    image: {
        flex: 10,
        margin: 20,
        borderRadius: 7
    },
    progress: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttons: {
        flex: 1,
        height: 40,
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10,
    }
});

AppRegistry.registerComponent('AwesomeProject', () => StalkgramProject);
