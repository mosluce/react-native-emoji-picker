import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';

const KAV = Platform.select({
  ios: ({ children, ...props }) => (
    <KeyboardAvoidingView enabled {...props} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  ),
  android: View,
});

export default KAV;