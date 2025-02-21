import { IonButton, IonIcon, useIonRouter } from '@ionic/react';
import { star } from 'ionicons/icons';
import { IFlashcardTopic } from './IFlashcardTopic';
import './StoryFlashcard.css';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export interface IStoryFlashcardProps {
  offset: number
  topic: IFlashcardTopic
  locked: boolean
  progress: number
}

export function StoryFlashcard({ offset, topic, locked, progress }: IStoryFlashcardProps) {
  const handleButtonHover = () => {
    localStorage.setItem("currentFlashcard", JSON.stringify(topic));
  }
  return (
    <div className="storyFlashcardContainer" style={{ transform: `translateX(${offset}px)`, width: "66px" }}>
      {!locked ? <CircularProgressbarWithChildren
        value={progress}
        styles={buildStyles({
          pathTransitionDuration: 0.5,
          
          pathColor: `var(--ion-color-primary, #0054e9)`,
          trailColor: `transparent`,
        })}
      >
        <IonButton onMouseDown={() => handleButtonHover()} disabled={locked} className="storyFlashcard" routerLink="/flashcard" shape="round" size="large" >
          <IonIcon slot="icon-only" icon={star}></IonIcon>
        </IonButton>
      </CircularProgressbarWithChildren> :
        <IonButton onMouseDown={() => handleButtonHover()} disabled={locked} className="storyFlashcard" routerLink="/flashcard" shape="round" size="large" >
          <IonIcon slot="icon-only" icon={star}></IonIcon>
        </IonButton>
      }
    </div>);
}
