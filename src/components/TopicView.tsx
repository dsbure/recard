import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonCardContent, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { StorySnake } from '../components/StorySnake';
import { IFlashcardCategory } from "./IFlashcardCategory";
import flashcardStorageService, { IFlashcardStorageCategory } from '../services/flashcardStorageService';
import { useEffect, useRef, useState } from 'react';

export function TopicView(category: IFlashcardCategory) {
  const [categoryData, setCategoryData] = useState<IFlashcardStorageCategory>();

  useEffect(() => {
    const updateData = async () => {
      setTimeout(() => flashcardStorageService.getCategoryData(category.categoryName).then((e) => setCategoryData(e)), 0);
    };
    const unsubscribe = flashcardStorageService.subscribe(updateData);
    updateData();
    return () => { unsubscribe() };
  }, []);

  return <>
    <IonCard className="topicHeader">
      <IonCardHeader>
        <IonCardTitle>{category.categoryName}</IonCardTitle>
        <IonCardSubtitle>{category.categoryDesc}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton routerLink={"/story/" + category.categoryName} expand="block">View Story</IonButton>
      </IonCardContent>
    </IonCard>
    <StorySnake category={category} categoryData={categoryData} />
  </>;
}
