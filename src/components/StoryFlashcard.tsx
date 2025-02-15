import { IonButton, IonIcon, useIonRouter } from '@ionic/react';
import { star } from 'ionicons/icons';
import { IFlashcardTopic } from './IFlashcardTopic';

export interface IStoryFlashcardProps {
  offset: number
  topic: IFlashcardTopic
}

export function StoryFlashcard({ offset, topic }: IStoryFlashcardProps) {
  const router = useIonRouter();
  const handleButtonHover = () => {
    localStorage.setItem("currentFlashcard", JSON.stringify(topic));
  }
  return (<IonButton onMouseDown={() => handleButtonHover()} routerLink="/flashcard" shape="round" size="large" style={{transform: "translateX(" + offset + "px)"}}>
    <IonIcon slot="icon-only" icon={star}></IonIcon>
  </IonButton>);
}
