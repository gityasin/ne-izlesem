import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ENV } from '../constants/.env';

// Map of common streaming service IDs to their logos from TMDB
// This is a fallback in case the logo_path is not available
const STREAMING_SERVICE_LOGOS: { [key: number]: string } = {
  8: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',     // Netflix
  119: '/68MNrwlkpF7WnmNPXLah69CR5cb.jpg',   // Amazon Prime Video
  337: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg',   // Disney Plus
  341: '/bzJJ9RomLGJln5ZRl5UigDmZnBu.jpg',   // Blutv
  350: '/6uhKBfmtzFLRqgkZ9SnDZFJhCY4.jpg',   // Apple TV Plus
  1796: '/giwP8v5Uw7RD7wKgeFzIxecvLtN.jpg',  // Exxen
  1899: '/5XaVCG916nZCcFXt3WBr1Zf8X1x.jpg',  // Gain
  2202: '/3U0t5JMFgd2qFZrcqRt5q8Y5Soy.jpg',  // TV+
  2385: '/7qV5e2Bz5xtyqBcxS8GYbZzKFvr.jpg',  // TOD
  1870: '/3U0t5JMFgd2qFZrcqRt5q8Y5Soy.jpg',  // MUBI
  188: '/4cPfmtEZrX9EMGotJ8GdBGmZJxx.jpg',   // YouTube Premium
  342: '/xTjpCwl9HJZJjz9L3uNMl3FgUXR.jpg',   // Puhu TV
  384: '/aS2zvJWn9mwiCOeaaCkIh4wleZS.jpg',   // HBO Max
};

interface StreamingServiceIconProps {
  id: number;
  size?: number;
  style?: any;
  logoPath?: string;
}

export const StreamingServiceIcon: React.FC<StreamingServiceIconProps> = ({ 
  id, 
  size = 32, 
  style,
  logoPath
}) => {
  // Use the provided logoPath if available, otherwise use the fallback from the map
  const finalLogoPath = logoPath || STREAMING_SERVICE_LOGOS[id];
  
  if (!finalLogoPath) {
    return <View style={[styles.placeholder, { width: size, height: size }, style]} />;
  }
  
  return (
    <Image
      source={{ uri: `${ENV.TMDB_IMAGE_BASE_URL}${finalLogoPath}` }}
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
