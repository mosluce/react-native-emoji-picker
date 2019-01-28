/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Example from './src/Example';
import { EmojiPickerProvider } from './src/EmojiPicker';

export default class App extends Component {
  render() {
    return (
      <EmojiPickerProvider>
        <Example />
      </EmojiPickerProvider>
    );
  }
}
