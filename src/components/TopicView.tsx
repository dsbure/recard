import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonCardContent } from '@ionic/react';
import { StorySnake } from '../components/StorySnake';
import { IFlashcardCategory } from "./IFlashcardCategory";
import flashcardStorageService, { IFlashcardStorageCategory } from '../services/flashcardStorageService';
import { useEffect, useState } from 'react';

export function TopicView(category: IFlashcardCategory) {
  const [categoryData, setCategoryData] = useState<IFlashcardStorageCategory>();

  flashcardStorageService.getCategoryData(category.categoryName).then((e) => {
    setCategoryData(e);
  });
  return <>
    <IonCard className="topicHeader">
      <IonCardHeader>
        <IonCardTitle>{category.categoryName}</IonCardTitle>
        <IonCardSubtitle>{category.categoryDesc}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton>View Story</IonButton>
      </IonCardContent>
    </IonCard>
    <StorySnake category={category} categoryData={categoryData} />
  </>;
}
