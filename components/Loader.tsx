import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import i18n from '../localization/i18n';

interface LoaderProps {
  message?: string;
  size?: 'small' | 'large';
}

export const Loader: React.FC<LoaderProps> = ({ 
  message, 
  size = 'large' 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#6200ee" animating={true} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});
