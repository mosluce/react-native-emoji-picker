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

    this.state = {
      text: '',
    };

    this.toggle = this.toggle.bind(this);
    this.onSelectEmoji = this.onSelectEmoji.bind(this);
  }

  onSelectEmoji(emoji) {
    this.setState({
      text: `${this.state.text}${emoji}`
    })
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
      openEmojiPicker(this.onSelectEmoji);
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={{ flex: 1, backgroundColor: '#666' }} />
          <View style={styles.bar}>
            <TextInput style={styles.input} placeholder="input here..." onSubmitEditing={Keyboard.dismiss} value={this.state.text} onChangeText={text => this.setState({ text })} />
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