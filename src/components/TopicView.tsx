import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { StorySnake } from '../components/StorySnake';
import { IFlashcardCategory } from "./IFlashcardCategory";

export function TopicView(category: IFlashcardCategory) {
  return <>
    <IonCard className="topicHeader">
      <IonCardHeader>
        <IonCardTitle>{category.categoryName}</IonCardTitle>
        <IonCardSubtitle>{category.categoryDesc}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
    <StorySnake {...category} />
  </>;
}
