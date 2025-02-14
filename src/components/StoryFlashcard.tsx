import { IonButton, IonIcon } from '@ionic/react';
import { star } from 'ionicons/icons';

export interface IStoryFlashcardProps {
  name: string
  offset: number
}

export function StoryFlashcard({ name, offset }: IStoryFlashcardProps) {
  return (<IonButton routerLink="/flashcard" shape="round" size="large" style={{transform: "translateX(" + offset + "px)"}}>
    <IonIcon slot="icon-only" icon={star}></IonIcon>
  </IonButton>);
}
