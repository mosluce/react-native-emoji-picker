import React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { connectEmojiPicker } from '../EmojiPicker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#666',
  },
  input: {
    flex: 1,
  },
  btn: {
    height: '100%',
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    paddingHorizontal: 8,
    width: '100%',
    height: 56,
    alignItems: 'center',
    backgroundColor: '#EFEFEF99',
    flexDirection: 'row',
  }
})

class Example extends React.PureComponent {
  constructor() {
    super();

    this.state = {};

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const {
      emojiPickerOpened,
      openEmojiPicker,
      closeEmojiPicker,
    } = this.props;

    if (emojiPickerOpened) {
      closeEmojiPicker();
    } else {
      openEmojiPicker();
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={{ flex: 1, backgroundColor: '#666' }} />
          <View style={styles.bar}>
            <TextInput style={styles.input} placeholder="input here..." onSubmitEditing={Keyboard.dismiss} />
            <TouchableOpacity onPress={this.toggle}>
              <View style={styles.btn}>
                <Text>{this.props.emojiPickerOpened ? 'Close' : 'Open'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

export default connectEmojiPicker(Example)