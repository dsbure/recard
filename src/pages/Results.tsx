import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import './Results.css';
import { useParams } from 'react-router';

interface RouteParams {
  score: string;
  total: string;
  topicName: string;
}

const Results: React.FC = () => {
  const { score, total, topicName } = useParams<RouteParams>();
  const router = useIonRouter();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Results</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              You scored {score + "/" + total} ({Math.round((parseFloat(score) / parseFloat(total)) * 100)}%)
            </IonCardTitle>
            <IonCardSubtitle>{topicName}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block" routerLink="/mainTab" routerDirection="back">Return to Home</IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Results;
