import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/react';
import { IFlashcardCategory } from '../interfaces/IFlashcardCategory';

export function TopicHeader(category: IFlashcardCategory) {
  return (<IonCard className="topicHeader">
    <IonCardHeader>
      <IonCardTitle>{category.categoryName}</IonCardTitle>
      <IonCardSubtitle>{category.categoryDesc}</IonCardSubtitle>
    </IonCardHeader>
    <IonCardContent>
      <IonButton routerLink={"/story/" + category.categoryName} expand="block">View Story</IonButton>
    </IonCardContent>
  </IonCard>);
}
