import { IonCard, IonCardHeader, IonIcon, IonCardTitle, IonCardSubtitle, IonButton } from '@ionic/react';

export interface IGemCardProps {
  icon: string, gemName: string, quarter: string,
  fill: string, disabled: boolean
}

export function GemCard({ icon, gemName, quarter, fill, disabled }: IGemCardProps) {
  return (<IonCard className="gem-card">
    <IonButton expand="block" fill="clear" className="gem-card-button">
      <IonCardHeader className="gem-card-container">
        <IonIcon icon={icon} style={{ fill: !disabled ? fill : "var(--ion-text-color-step-350)", opacity: !disabled ? 1 : 0.5 }} />
        <IonCardTitle style={{ fill: !disabled ? fill : "var(--ion-text-color-step-350)", opacity: !disabled ? 1 : 0.5 }}>{gemName}</IonCardTitle>
        <IonCardSubtitle style={{ fill: !disabled ? fill : "var(--ion-text-color-step-350)", opacity: !disabled ? 1 : 0.5 }}>{quarter}</IonCardSubtitle>
      </IonCardHeader>
    </IonButton>
  </IonCard>);
}
