import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import './StoryPage.css';
import { useParams } from 'react-router';
import { arrowBack, arrowForward } from 'ionicons/icons';

interface StoryPageParams {
  quarter: string;
}

const StoryPage: React.FC = () => {
  const { quarter } = useParams<StoryPageParams>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/mainTab" routerDirection="back" shape="round">
              <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Story: {quarter}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="story-content">
          <IonCard className="story-image">
            <IonImg
              src="https://imgs.xkcd.com/comics/alternative_energy_revolution.jpg"
            ></IonImg>
          </IonCard>
          <IonCard className="dialogue-box">
            <IonCardHeader class="header">
              <IonCardTitle class="name">
                Jam "Zipknot" Jam
              </IonCardTitle>
              <IonButton expand="block" className="next-button">
                <IonIcon slot="icon-only" icon={arrowForward}></IonIcon>
              </IonButton>
            </IonCardHeader>
            <IonCardContent className="dialogue">
              <div className="ion-padding">Lorem ipsum dolor sit down, mi amor. Consectetur adie piscing blitz, id daneo sam ad temporal incident ut labore et dolore magna aliqua. Ut enim ad minim veniam.</div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StoryPage;
