import { IonCard, IonCardHeader, IonIcon, IonCardTitle, IonCardSubtitle } from '@ionic/react';

export interface IGemCardProps {
  icon: string, gemName: string, quarter: string,
  fill: string, disabled: boolean
}

export function GemCard({ icon, gemName, quarter, fill, disabled }: IGemCardProps) {
  return (<IonCard className="gem-card" disabled={disabled}>
    <IonCardHeader className="gem-card-container">
      <IonIcon icon={icon} style={{ fill: fill }}/>
      <IonCardTitle>{gemName}</IonCardTitle>
      <IonCardSubtitle>{quarter}</IonCardSubtitle>
    </IonCardHeader>
  </IonCard>);
}
