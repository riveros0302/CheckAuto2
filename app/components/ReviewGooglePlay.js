import InAppReview from 'react-native-in-app-review';

InAppReview.isAvailable();

export const solicitarCalificacion = async () => {
  try {
    InAppReview.RequestInAppReview()
      .then((hasFlowFinishedSuccessfully) => {
        console.log('InAppReview in android', hasFlowFinishedSuccessfully);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.error('Error al solicitar calificación', error);
  }
};
