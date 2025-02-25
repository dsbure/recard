import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { IFlashcardCategory } from "./IFlashcardCategory";
import flashcardStorageService, { IFlashcardStorageCategory } from '../services/flashcardStorageService';
import { useEffect, useState } from 'react';

export function HomeView() {
  
  return <>
    <IonCard className="topicHeader">
      <IonCardHeader>
        <IonCardTitle>home</IonCardTitle>
        <IonCardSubtitle>page</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  </>;
}
