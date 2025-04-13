import { IonPage, useIonRouter } from '@ionic/react';
import './MainTab.css';
import { useLayoutEffect } from 'react';
import StorageService from '../services/StorageService';

const BlankPage: React.FC = () => {
  const router = useIonRouter();
  useLayoutEffect(() => {
    StorageService.getItem("onboarded").then((e) => {
      if (!e) {
        router.push("/onboarding");
      } else {
        router.push("/mainTab");
	  }
    });
  }, []);
  return (
	<IonPage>
	</IonPage>
  );
};

export default BlankPage;
