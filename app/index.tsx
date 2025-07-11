import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const frameCount = 8;

export default function SplashScreen() {
  const router = useRouter();
  const flickerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const flicker = Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, {
          toValue: 0.5,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 0.7,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    flicker.start();

    const timer = setTimeout(() => {
      router.replace('/_menu/home');
    }, 2500);

    return () => {
      clearTimeout(timer);
      flicker.stop();
    };
  }, []);

  return (
    <LinearGradient colors={['#d4ffb2', '#aaff88']} style={styles.container}>
      <FilmStrip position="top" />

      <View style={styles.diagonalWrapper}>
        <View style={styles.diagonalContainer}>
          {Array.from({ length: 20 }).map((_, frameIndex) => (
            <View key={frameIndex} style={styles.frame}>
              <View style={styles.holeRow}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <View key={i} style={styles.hole} />
                ))}
              </View>
              <View style={styles.frameBox} />
              <View style={styles.holeRow}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <View key={i} style={styles.hole} />
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* 🎞 Compact Flickering Title with Notches */}
        <View style={styles.textWrapper}>
          <Animated.View style={[styles.titleStrip, { opacity: flickerAnim }]}>
            {/* Left notch */}
            <View style={styles.notch} />

            <View style={styles.titleContent}>
              <View style={styles.bigHoleRow}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <View key={i} style={styles.bigHole} />
                ))}
              </View>
              <View style={styles.titleFrameBox}>
                <Text style={styles.title}>MemoryLane</Text>
              </View>
              <View style={styles.bigHoleRow}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <View key={i} style={styles.bigHole} />
                ))}
              </View>
            </View>

            {/* Right notch */}
            <View style={styles.notch} />
          </Animated.View>
        </View>
      </View>

      <FilmStrip position="bottom" />
    </LinearGradient>
  );
}

const FilmStrip = ({ position }: { position: 'top' | 'bottom' }) => {
  return (
    <View style={[styles.filmStrip, position === 'top' ? { top: 40 } : { bottom: 25 }]}>
      {Array.from({ length: frameCount }).map((_, frameIndex) => (
        <View key={frameIndex} style={styles.frame}>
          <View style={styles.holeRow}>
            {Array.from({ length: 3 }).map((_, i) => (
              <View key={i} style={styles.hole} />
            ))}
          </View>
          <View style={styles.frameBox} />
          <View style={styles.holeRow}>
            {Array.from({ length: 3 }).map((_, i) => (
              <View key={i} style={styles.hole} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filmStrip: {
    position: 'absolute',
    width: width,
    height: 120,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 2,
  },
  frame: {
    width: width / frameCount - 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 6,
  },
  frameBox: {
    backgroundColor: '#ccc',
    flex: 1,
    width: '100%',
    marginVertical: 3,
    borderRadius: 2,
  },
  holeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 4,
  },
  hole: {
    width: 6,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  bigHoleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 4,
  },
  bigHole: {
    width: 16,
    height: 16,
    backgroundColor: 'white',
  },
  diagonalWrapper: {
    position: 'absolute',
    width: width * 2,
    height: 150,
    top: '45%',
    left: -width / 2,
    transform: [{ rotate: '-54deg' }],
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagonalContainer: {
    backgroundColor: 'black',
    width: '100%',
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textWrapper: {
    position: 'absolute',
    transform: [{ rotate: '54deg' }],
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStrip: {
    flexDirection: 'row',
    width: width * 0.7,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#444',
    elevation: 6,
    overflow: 'hidden',
  },
  titleContent: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  titleFrameBox: {
    backgroundColor: '#ccc',
    width: '100%',
    paddingVertical: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1.5,
  },
  notch: {
    width: 12,
    backgroundColor: 'black',
  },
});
