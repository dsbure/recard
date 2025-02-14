import { IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Results.css';
import { useParams } from 'react-router';

interface RouteParams {
  score: string;
  total: string;
  topicName: string;
}

const Results: React.FC = () => {
  const { score, total, topicName } = useParams<RouteParams>();
  
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
          <IonButton expand="block" routerLink="/mainTab">Return to Home</IonButton>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Results;
