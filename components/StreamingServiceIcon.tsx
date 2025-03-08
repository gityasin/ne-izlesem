import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ENV } from '../constants/.env';

// Map of common streaming service IDs to their logos from TMDB
const STREAMING_SERVICE_LOGOS: { [key: number]: string } = {
  8: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',     // Netflix
  119: '/68MNrwlkpF7WnmNPXLah69CR5cb.jpg',   // Amazon Prime Video
  337: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg',   // Disney Plus
  341: '/bzJJ9RomLGJln5ZRl5UigDmZnBu.jpg',   // Blutv
  350: '/6uhKBfmtzFLRqgkZ9SnDZFJhCY4.jpg',   // Apple TV Plus
};

interface StreamingServiceIconProps {
  id: number;
  size?: number;
  style?: any;
}

export const StreamingServiceIcon: React.FC<StreamingServiceIconProps> = ({ 
  id, 
  size = 32, 
  style 
}) => {
  const logoPath = STREAMING_SERVICE_LOGOS[id];
  
  if (!logoPath) {
    return <View style={[styles.placeholder, { width: size, height: size }, style]} />;
  }
  
  return (
    <Image
      source={{ uri: `${ENV.TMDB_IMAGE_BASE_URL}${logoPath}` }}
      style={[
        styles.icon,
        { width: size, height: size },
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    borderRadius: 4,
    marginHorizontal: 2,
  },
  placeholder: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 2,
  },
});
