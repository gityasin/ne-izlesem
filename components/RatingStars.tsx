import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showText?: boolean;
  totalVotes?: number;
  color?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 10,
  size = 16,
  showText = true,
  totalVotes,
  color = '#FFC107',
}) => {
  // Convert rating to 5-star scale if it's on a 10-point scale
  const normalizedRating = maxRating === 10 ? rating / 2 : rating;
  const stars = [];
  
  // Calculate the number of full, half, and empty stars
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Star character constants
  const FULL_STAR = '★';
  const HALF_STAR = '☆'; // We'll use a different color for the inner part
  const EMPTY_STAR = '☆';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Text 
        key={`full-${i}`} 
        style={[styles.star, { color, fontSize: size }]}
      >
        {FULL_STAR}
      </Text>
    );
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <Text 
        key="half" 
        style={[styles.star, { color, fontSize: size }]}
      >
        {HALF_STAR}
      </Text>
    );
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Text 
        key={`empty-${i}`} 
        style={[styles.star, { color: '#D1D1D1', fontSize: size }]}
      >
        {EMPTY_STAR}
      </Text>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>{stars}</View>
      
      {showText && (
        <Text style={styles.ratingText}>
          {rating.toFixed(1)}
          {totalVotes && <Text style={styles.votesText}> ({totalVotes})</Text>}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  votesText: {
    fontWeight: 'normal',
    fontSize: 12,
  },
});
