import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/react';
import { IFlashcardCategory } from '../interfaces/IFlashcardCategory';
import { book } from 'ionicons/icons';

export function TopicHeader(category: IFlashcardCategory) {
  return (<>
  <IonCard className="topicHeader">
    <IonCardHeader>
      <IonCardTitle>{category.categoryName}</IonCardTitle>
      <div className="header-separator"/>
      <IonCardSubtitle>{category.categoryDesc}</IonCardSubtitle>
    </IonCardHeader>
  </IonCard>
  <IonButton routerLink={"/story/" + category.categoryName} className="view-story-button" shape="round" expand="block">
    <IonIcon icon={book} slot="start"/>
    View Story
  </IonButton>
  </>);
}
