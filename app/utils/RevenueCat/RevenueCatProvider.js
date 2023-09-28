import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Text } from 'react-native';
import Purchases, { LOG_LEVEL, CustomerInfo } from 'react-native-purchases';
import auth from '@react-native-firebase/auth';
import {
  getSubscriptionInfo,
  saveSubscriptionInfo,
} from '../Database/suscription';

const APIKeys = {
  apple: '',
  google: 'goog_FOixSPjWltjmSBqdxINfstRjZpW',
};

const RevenueCatContext = createContext(null);

export const useRevenueCat = () => {
  return useContext(RevenueCatContext);
};

export const RevenueCatProvider = ({ children }) => {
  const [user, setUser] = useState({ cookies: 0, items: [], pro: false });
  const [packages, setPackages] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [idSubs, setIdSubs] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: APIKeys.google });
        } else {
          await Purchases.configure({ apiKey: APIKeys.apple });
        }
        setIsReady(true);

        Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        Purchases.addCustomerInfoUpdateListener(async (info) => {
          updateCustomerInformation(info);
          if (auth().currentUser) {
            handleLogIn();
          }

          //  console.log('hacer algo al contratar: ' + JSON.stringify(info));
        });

        await loadOfferings();
      } catch (error) {
        console.log('Error initializing RevenueCat:', error);
      }
    };
    init();
  }, []);

  const handleLogIn = async () => {
    try {
      const { customerInfo } = await Purchases.logIn(auth().currentUser.uid);

      const subscriptionInfo = await getSubscriptionInfo();

      setIdSubs(`${customerInfo.activeSubscriptions}`);

      if (customerInfo.entitlements.active['pro']) {
        if (!subscriptionInfo) {
          // El usuario no tiene información de suscripción en Firestore
          // Puede ser su primera vez usando la aplicación
          // Puedes guardar la información de suscripción en Firestore aquí

          const subscriptionData = {
            activeSubscriptions: customerInfo.activeSubscriptions,
            isActive: customerInfo.entitlements.active['pro'].isActive,
            subscriptionStartDate:
              customerInfo.entitlements.active['pro'].latestPurchaseDate, // Fecha de inicio de la suscripción
            subscriptionEndDate:
              customerInfo.entitlements.active['pro'].expirationDate,
            // Otros campos relacionados con la suscripción
          };

          await saveSubscriptionInfo(subscriptionData);
        }
      } else {
        //  console.log('no hay suscripciones activas');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setPackages(offerings.all);
        // console.log(offerings.all);
      }
    } catch (error) {
      console.log('Error loading offerings:', error);
    }
  };

  const updateCustomerInformation = (customerInfo) => {
    const newUser = { ...user, items: [], pro: false };

    if (customerInfo?.entitlements.active['pro']) {
      newUser.items.push(customerInfo.entitlements.active['pro'].identifier);
    }

    setUser(newUser);
  };

  const purchasePackage = async (pack) => {
    try {
      await Purchases.purchasePackage(pack);

      if (pack.product.identifier === '1mes3000:pb01') {
        setUser({ ...user, cookies: user.cookies + 5 });
      }
    } catch (error) {
      if (!error.userCancelled) {
        alert(error);
      }
    }
  };

  const restorePermissions = async () => {
    try {
      const customer = await Purchases.restorePurchases();
      // console.log('customer: ' + customer);
      return customer;
    } catch (error) {
      console.log('Error restoring permissions:', error);
      return null;
    }
  };

  const logoutRC = async () => {
    await Purchases.logOut();
  };

  const value = {
    restorePermissions,
    user,
    packages,
    purchasePackage,
    logoutRC,
    idSubs,
  };

  // if (!isReady) return <Text>Loading...</Text>;

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};
