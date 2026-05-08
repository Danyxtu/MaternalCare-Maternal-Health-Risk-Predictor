import React, { useEffect, useRef } from 'react';
import { View, Image, ImageStyle, StyleProp, ViewStyle, Animated } from 'react-native';

interface AppLogoProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  plain?: boolean;
  imageScale?: number;
}

const AppLogo: React.FC<AppLogoProps> = ({ 
  size = 40, 
  style, 
  imageStyle,
  borderColor = '#E11D48',
  borderWidth = 2,
  backgroundColor = 'transparent',
  plain = false,
  imageScale = 0.7
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  if (plain) {
    return (
      <Animated.Image
        source={require('../assets/images/maternal-care-logo.png')}
        style={[{ width: size, height: size, transform: [{ scale: pulseAnim }] }, imageStyle]}
        resizeMode="contain"
      />
    );
  }

  return (
    <View style={[
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2, 
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderStyle: 'solid',
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }, 
      style
    ]}>
      <View style={{ 
        width: '100%', 
        height: '100%', 
        borderRadius: size / 2, 
        overflow: 'hidden', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Animated.Image
          source={require('../assets/images/maternal-care-logo.png')}
          style={[
            { 
              width: size * imageScale, 
              height: size * imageScale,
              transform: [{ scale: pulseAnim }]
            }, 
            imageStyle
          ]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default AppLogo;
