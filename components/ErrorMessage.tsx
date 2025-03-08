import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryButtonText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  retryButtonText = 'Tekrar Dene' 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button 
          mode="contained" 
          onPress={onRetry} 
          style={styles.button}
        >
          {retryButtonText}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
