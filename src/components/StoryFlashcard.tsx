import { IonButton, IonIcon, useIonRouter } from '@ionic/react';
import { star } from 'ionicons/icons';
import { IFlashcardTopic } from './IFlashcardTopic';
import './StoryFlashcard.css';

export interface IStoryFlashcardProps {
  offset: number
  topic: IFlashcardTopic
  locked: boolean
}

export function StoryFlashcard({ offset, topic, locked }: IStoryFlashcardProps) {
  const handleButtonHover = () => {
    localStorage.setItem("currentFlashcard", JSON.stringify(topic));
  }
  return (<IonButton onMouseDown={() => handleButtonHover()} disabled={locked} className="storyFlashcard" routerLink="/flashcard" shape="round" size="large" style={{transform: "translateX(" + offset + "px)"}}>
    <IonIcon slot="icon-only" icon={star}></IonIcon>
  </IonButton>);
}
