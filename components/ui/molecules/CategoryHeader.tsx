import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/atoms/Typography';
import { colors } from '@/styles/theme/colors';

interface CategoryHeaderProps {
  title: string;
  icon?: string;
  onViewAll?: () => void;
}

/**
 * カテゴリーヘッダーコンポーネント
 * 「すべて見る」リンク付きのセクションヘッダー
 */
export const CategoryHeader = ({ title, icon, onViewAll }: CategoryHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={22} 
            color={colors.text.primary} 
            style={styles.icon} 
          />
        )}
        <Typography variant="subtitle">
          {title}
        </Typography>
      </View>
      
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Typography variant="caption" style={styles.viewAllText}>
            すべて見る
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  viewAllText: {
    color: colors.primary.DEFAULT,
  },
});
