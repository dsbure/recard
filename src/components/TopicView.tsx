import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { StorySnake } from '../components/StorySnake';

export interface ITopicViewProps {
  name: string
  desc: string
}

export function TopicView({ name, desc }: ITopicViewProps) {
  return <>
    <IonCard className="topicHeader">
      <IonCardHeader>
        <IonCardTitle>{name}</IonCardTitle>
        <IonCardSubtitle>{desc}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
    <StorySnake />
  </>;
}
