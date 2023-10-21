import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-5653888383157044/5697203368';

export default function Banner() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Coloca el contenido al final de la pantalla
  },
  bannerContainer: {
    alignItems: 'center', // Centra el banner horizontalmente
  },
});
