import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { secondary } from '../utils/tema';
import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  ProductPurchase,
  PurchaseError,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';

export default function BotonSuscripcion() {
  const subscriptionProductId = 'prod_001'; // ID de producto de suscripción en Google Play

  useEffect(() => {
    const handlePurchaseUpdate = (purchase) => {
      console.log('purchaseUpdatedListener', purchase);
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        yourAPI
          .deliverOrDownloadFancyInAppPurchase(purchase.transactionReceipt)
          .then(async (deliveryResult) => {
            if (isSuccess(deliveryResult)) {
              await finishTransaction({ purchase, isConsumable: true });
              await finishTransaction({ purchase, isConsumable: false });
            } else {
              // Reintentar / concluir que la compra es fraudulenta, etc.
            }
          });
      }
    };

    const purchaseUpdateSubscription =
      purchaseUpdatedListener(handlePurchaseUpdate);

    const purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.warn('purchaseErrorListener', error);
    });

    // Montaje
    initConnection()
      .then(() => {
        flushFailedPurchasesCachedAsPendingAndroid().catch(() => {});
      })
      .catch((error) => {
        console.error('Error in initConnection:', error);
      });

    // Desmontaje
    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);

  const purchase = async (sku) => {
    try {
      await requestPurchase({
        sku,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  const subscribe = async (sku, offerToken) => {
    try {
      await requestSubscription({
        sku,
        ...(offerToken && { subscriptionOffers: [{ sku, offerToken }] }),
      });
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  const product = {
    productId: 'prod_001',
    subscriptionOfferDetails: [
      // ... Subscription offers data (if available)
    ],
  };

  return (
    <View>
      {/* For one-time products */}
      <Button title='Purchase' onPress={() => purchase(product.productId)} />

      {/* For subscription products */}
      {Platform.OS === 'android' ? (
        product.subscriptionOfferDetails.map((offer, index) => (
          <Button
            key={index}
            title={`Subscribe to ${offer.sku}`}
            onPress={() => subscribe(product.productId, offer.offerToken)}
          />
        ))
      ) : (
        <Button
          title='Subscribe'
          onPress={() => subscribe(product.productId, null)}
        />
      )}
    </View>
  );

  /*return (
    <View>
      <TouchableOpacity style={styles.botonTouch} onPress={() => subscribe(subscriptionProductId)}>
        <View style={styles.viewBoton}>
          <Text style={styles.txt1}>$3.000/1Mes</Text>
          <Text style={styles.txt2}>+3 Vehiculos</Text>
        </View>
      </TouchableOpacity>
    </View>
  );*/
}

const styles = StyleSheet.create({
  botonTouch: {
    borderWidth: 5,
    borderColor: secondary,
    borderRadius: 50,
    marginVertical: 10,
    width: '75%',
    alignSelf: 'center',
  },
  viewBoton: {
    margin: 15,
    alignItems: 'center',
  },
  txt1: {
    fontWeight: 'bold',
    color: 'grey',
    fontSize: 18,
  },
  txt2: {
    fontWeight: 'bold',
    color: secondary,
  },
});
