import { openDatabase } from 'expo-sqlite';
import auth from '@react-native-firebase/auth';

const db = openDatabase('db.db');

const insertNotification = (index, date1, date2) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS userNotification (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          createBy TEXT,
          notificationIndex INTEGER,
          date1 TEXT,
          date2 TEXT
        )
        `,
        [],
        () => {
          console.log('Tabla creada exitosamente');
        },
        (_, error) => {
          console.error('Error al crear la tabla:', error);
          reject(error);
        }
      );

      tx.executeSql(
        `
          INSERT INTO userNotification (createBy, notificationIndex, date1, date2)
          VALUES (?, ?, ?, ?)
          `,
        [auth().currentUser.uid, index, date1 ? date1 : '', date2 ? date2 : ''],
        (_, result) => {
          console.log('Datos insertados exitosamente');
          resolve();
        },
        (_, error) => {
          console.error('Error al insertar datos:', error);
          reject(error);
        }
      );
    });
  });
};

export const checkAndUpsertNotification = async (index, date1, date2) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          'SELECT * FROM userNotification WHERE createBy = ? AND notificationIndex = ?',
          [auth().currentUser.uid, index],
          (_, { rows }) => {
            if (rows.length > 0) {
              tx.executeSql(
                'UPDATE userNotification SET date1 = ?, date2 = ? WHERE createBy = ? AND notificationIndex = ?',
                [date1, date2, auth().currentUser.uid, index],
                () => {
                  console.log('Datos actualizados exitosamente');
                  resolve();
                },
                (_, error) => {
                  console.error('Error al actualizar los datos:', error);
                  reject(error);
                }
              );
            } else {
              insertNotification(index, date1, date2) // No hay await aquí
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  reject(error);
                });
            }
          },
          (_, error) => {
            console.error('Error al verificar los datos:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const fetchNotifications = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `
        SELECT * FROM userNotification;
        `,
      [],
      (_, { rows }) => {
        console.log('Registros de userNotification:', rows._array);
      },
      (_, error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  });
};

const clearUserNotificationTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM userNotification',
      [],
      () => console.log('Tabla userNotification limpiada exitosamente'),
      (_, error) =>
        console.error('Error al limpiar la tabla userNotification:', error)
    );
  });
};
