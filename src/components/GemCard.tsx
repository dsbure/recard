import { IonCard, IonCardHeader, IonIcon, IonCardTitle, IonCardSubtitle, IonButton, IonImg } from '@ionic/react';

export interface IGemCardProps {
  icon: string, gemName: string, quarter: string,
  disabled: boolean, setTab: () => void
}

export function GemCard({ icon, gemName, quarter, disabled, setTab }: IGemCardProps) {
  return (<IonCard className="gem-card">
    <IonButton expand="block" fill="clear" className="gem-card-button" onClick={setTab}>
      <IonCardHeader className="gem-card-container">
        <IonImg src={icon} style={{ 
          filter: !disabled ? "" : "grayscale(1)", opacity: !disabled ? 1 : 0.5
        }} />
        <IonCardTitle style={{ opacity: !disabled ? 1 : 0.5 }}>{gemName}</IonCardTitle>
        <IonCardSubtitle style={{ opacity: !disabled ? 1 : 0.5 }}>{quarter}</IonCardSubtitle>
      </IonCardHeader>
    </IonButton>
  </IonCard>);
}
