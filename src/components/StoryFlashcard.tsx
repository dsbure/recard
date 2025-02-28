import { IonButton, IonIcon, IonChip, IonLabel, useIonRouter } from '@ionic/react';
import { checkmark, checkmarkCircle, lockClosed, star } from 'ionicons/icons';
import { IFlashcardTopic } from './IFlashcardTopic';
import './StoryFlashcard.css';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export interface IStoryFlashcardProps {
  offset: number
  topic: IFlashcardTopic
  locked: boolean
  progress: number
  newTopic: boolean
}

export function StoryFlashcard({ offset, topic, locked, progress, newTopic }: IStoryFlashcardProps) {
  const router = useIonRouter();
  const handleButtonHover = () => {
    localStorage.setItem("currentFlashcard", JSON.stringify(topic));
    router.push("/flashcard");
  }
  const flashcardButton = (
    <IonButton 
      onMouseDown={() => handleButtonHover()} 
      disabled={locked} 
      className={"storyFlashcard" + (newTopic ? " new" : "")} 
      shape="round" 
      size="large"
    >
      <IonIcon slot="icon-only" icon={newTopic ? star : locked ? lockClosed : checkmarkCircle}></IonIcon>
    </IonButton>
  );
  return (
    <IonChip className="storyFlashcardContainer" style={{ marginLeft: `${offset}px`}} disabled={locked} onMouseDown={() => handleButtonHover()}>
      <div style={{ width: "66px" }}>
        {!locked ? <CircularProgressbarWithChildren
          value={progress}
          styles={buildStyles({
            pathTransitionDuration: 0.5,

            pathColor: `var(--ion-color-primary-shade, #0054e9)`,
            trailColor: `transparent`,
          })}
        >
          {flashcardButton}
        </CircularProgressbarWithChildren> :
          flashcardButton
        }
      </div>
      <IonLabel>{topic.topicName}</IonLabel>
    </IonChip>);
}
