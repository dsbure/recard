import { IonCard, IonCardHeader, IonIcon, IonCardTitle, IonCardSubtitle, IonButton, IonImg, IonPage, IonText } from '@ionic/react';
import { invertMode, logOut, shieldHalf, timer } from 'ionicons/icons';
import { useRef } from 'react';

export function SigmaModePopup({ dismiss }: { dismiss: (data?: string) => void }) {
  const ref = useRef<HTMLIonInputElement>(null);
  return (
    <div className="alert-sigma-modes">
      <h1 className="sm-unlocked">Sigma Modes Available!</h1>
      <IonText className="sm-unlocked-desc">
        Choose a Sigma Mode to Unlock.
      </IonText>
      <div className="select-container ion-padding-top">
        <IonButton className="select-sigma" onClick={() => dismiss("skip")}>
          <IonCard className="sigma-mode-card">
            <IonIcon icon={logOut} className="select-sigma-icon"/>
            <IonCardHeader>
              <IonCardTitle>Skip</IonCardTitle>
              <IonCardSubtitle>Skips the current question.</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        </IonButton>
        <IonButton className="select-sigma" onClick={() => dismiss("immunity")}>
          <IonCard className="sigma-mode-card">
            <IonIcon icon={shieldHalf} className="select-sigma-icon"/>
            <IonCardHeader>
              <IonCardTitle>Immunity</IonCardTitle>
              <IonCardSubtitle>Be immune from the next wrong answer.</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        </IonButton>
        <IonButton className="select-sigma" onClick={() => dismiss("fiftyFifty")}>
          <IonCard className="sigma-mode-card">
            <IonIcon icon={invertMode} className="select-sigma-icon"/>
            <IonCardHeader>
              <IonCardTitle>50/50</IonCardTitle>
              <IonCardSubtitle>Removes half of the incorrect choices.</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        </IonButton>
        <IonButton className="select-sigma" onClick={() => dismiss("timeFreeze")}>
          <IonCard className="sigma-mode-card">
            <IonIcon icon={timer} className="select-sigma-icon"/>
            <IonCardHeader>
              <IonCardTitle>Time Freeze</IonCardTitle>
              <IonCardSubtitle>Freezes the timer for the current question.</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        </IonButton>
      </div>
    </div>
  );
}
