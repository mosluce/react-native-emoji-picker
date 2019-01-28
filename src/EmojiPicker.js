import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Dimensions,
  SafeAreaView,
  Keyboard,
  Animated,
} from 'react-native';
import emojiDB from './emoji-data';
import KeyboardAvoidingView from './KeyboardAvoidingView';
import obp from 'object-path';
import hoist from 'hoist-non-react-statics';

const categories = ["😊", "🍔", "🐶", "💡", "⚾️", "✈️", "🔣", "🎏"];
const getEmojiList = (category) => obp.get(emojiDB, category, []);
const screen = Dimensions.get('screen');
const gridColumns = 8;
const gridHeight = screen.width * 0.5;
const tabHeight = 40;

const styles = StyleSheet.create({
  pickerContainer: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    borderTopWidth: 1,
    borderTopColor: `#EFEFEF99`,
    backgroundColor: `#FFFFFF`,
  },
  tabList: {
    height: tabHeight,
  },
  tabListItemContainer: {
    width: tabHeight,
    height: tabHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `#EFEFEF99`,
  },
  tabListItemContainerSelected: {
    backgroundColor: `#CCCCCC99`,
  },
  gridContainer: {
    backgroundColor: '#FFFFFF',
  },
  gridList: {
    height: gridHeight,
  },
  gridListItemContainer: {
    width: screen.width / gridColumns,
    height: screen.width / gridColumns,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class TabItem extends React.PureComponent {
  render() {
    const { category, currentCategory, onChangeCategory } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => onChangeCategory(category)}>
        <View style={currentCategory === category ? [styles.tabListItemContainer, styles.tabListItemContainerSelected] : styles.tabListItemContainer}>
          <Text>{category}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

class Tab extends React.PureComponent {
  constructor() {
    super();

    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item }) {
    const { onChangeCategory, category } = this.props;

    return (
      <TabItem category={item} currentCategory={category} onChangeCategory={onChangeCategory} />
    )
  }
  render() {
    const { category } = this.props;

    return (
      <View style={styles.tabContainer}>
        <FlatList
          horizontal={true}
          numColumns={1}
          renderItem={this.renderItem}
          keyExtractor={(item) => item}
          data={categories}
          extraData={category}
        />
      </View>
    )
  }
}

class EmojiItem extends React.PureComponent {
  constructor() {
    super();

    this.onSelectEmoji = this.onSelectEmoji.bind(this);
  }

  onSelectEmoji() {
    const { emoji, onSelectEmoji } = this.props;

    onSelectEmoji(emoji);
  }

  render() {
    const { emoji } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.onSelectEmoji}>
        <View style={styles.gridListItemContainer}>
          <Text>{emoji}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

class Grid extends React.PureComponent {
  constructor() {
    super();

    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item }) {
    const { onSelectEmoji } = this.props;
    return <EmojiItem emoji={item} onSelectEmoji={onSelectEmoji} />;
  }

  render() {
    const {
      category
    } = this.props;

    const list = getEmojiList(category);

    return (
      <View style={styles.gridContainer}>
        <FlatList
          style={styles.gridList}
          numColumns={gridColumns}
          data={list}
          keyExtractor={item => item}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

export class EmojiPicker extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      category: categories[0],
    };

    this.setCategory = this.setCategory.bind(this);
  }

  setCategory(category) {
    this.setState({
      category,
    });
  }

  render() {
    const {
      category,
    } = this.state;

    const {
      onSelectEmoji,
    } = this.props;

    return (
      <View>
        <SafeAreaView style={styles.pickerContainer}>
          <Grid category={category} onSelectEmoji={onSelectEmoji} />
          <Tab category={category} onChangeCategory={this.setCategory} />
        </SafeAreaView>
      </View>
    )
  }
}

export const EmojiPickerContext = React.createContext();

export class EmojiPickerProvider extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      emojiPickerOpened: false,
      keyboardHeight: 0,
      animtedMarginBottom: new Animated.Value(-(tabHeight + gridHeight)),
    };

    this.openEmojiPicker = this.openEmojiPicker.bind(this);
    this.closeEmojiPicker = this.closeEmojiPicker.bind(this);
    this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);
  }

  onKeyboardDidShow({ endCoordinates }) {
    const { height } = endCoordinates;

    this.setState({
      keyboardHeight: height,
      emojiPickerOpened: false,
      onSelectEmoji: () => { },
    });
  }

  onKeyboardDidHide() {
    this.setState({
      keyboardHeight: 0,
    });
  }

  openEmojiPicker(onSelectEmoji) {
    this.setState({ onSelectEmoji });
    this.setState({ emojiPickerOpened: true });

    Animated.timing(this.state.animtedMarginBottom, {
      duration: 250,
      toValue: 0,
    }).start();

    Keyboard.dismiss();
  }

  closeEmojiPicker() {
    Animated.timing(this.state.animtedMarginBottom, {
      duration: 250,
      toValue: -(tabHeight + gridHeight),
    }).start(() => this.setState({ emojiPickerOpened: false }));
  }

  render() {
    const { state, props } = this;

    let element = null;

    if (state.emojiPickerOpened)
      element = <EmojiPicker animtedMarginBottom={state.animtedMarginBottom} onSelectEmoji={state.onSelectEmoji} />;

    return (
      <EmojiPickerContext.Provider
        value={{
          ...state,
          openEmojiPicker: this.openEmojiPicker,
          closeEmojiPicker: this.closeEmojiPicker,
        }}
      >
        {props.children}
        {element}
        <KeyboardAvoidingView enabled={!state.emojiPickerOpened} behavior="padding" />
      </EmojiPickerContext.Provider>
    )
  }
}

export const connectEmojiPicker = (WrappedComponent) => {
  class ConnectComponent extends React.PureComponent {
    render() {
      return (
        <EmojiPickerContext.Consumer>
          {context => {
            return <WrappedComponent {...this.props} {...context} />
          }}
        </EmojiPickerContext.Consumer>
      )
    }
  }

  return hoist(ConnectComponent, WrappedComponent)
}