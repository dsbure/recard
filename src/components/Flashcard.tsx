import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText } from '@ionic/react';
import { useEffect, useState } from 'react';
import { IFlashcardTopic } from './IFlashcardTopic';
import './Flashcard.css';

export interface IFlashcardProps {
  flashcard: IFlashcardTopic["flashcards"]["0"]
  index: number
  handleAnswerClick: Function
  skeletonChoices: boolean
  correctChoice?: string
}

export function Flashcard({index, flashcard, handleAnswerClick, skeletonChoices, correctChoice}: IFlashcardProps) {
  const [shuffledChoices, setShuffledChoices] = useState(flashcard.multipleChoices.map(e => ({ e, sort: Math.random() })) 
  .sort((a, b) => a.sort - b.sort) 
  .map(({ e }) => e));
  useEffect(() => {
    setShuffledChoices(flashcard.multipleChoices.map(e => ({ e, sort: Math.random() })) 
    .sort((a, b) => a.sort - b.sort) 
    .map(({ e }) => e));
  }, [flashcard]);
  return (<IonGrid className="flashcard-content">
    <IonRow>
      <IonCol>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{"Question " + index} </IonCardSubtitle>
            <IonCardTitle>{flashcard.question}</IonCardTitle>
          </IonCardHeader>
        </IonCard>
      </IonCol>
    </IonRow>
    <IonRow className="choice-container">
      <IonCol className="ion-padding">
        {shuffledChoices.map((q, i) => {
          return <IonButton className={(correctChoice || "") === q ? "choice correct" : "choice"} key={i} expand="block" onClick={() => handleAnswerClick(q)} disabled={(correctChoice || "") !== "" && (correctChoice || "") !== q}>
            {skeletonChoices ? <IonSkeletonText animated={true} style={{ width: '80px' }} /> : <IonLabel>{q}</IonLabel>}
          </IonButton>
        })}
      </IonCol>
    </IonRow>
  </IonGrid>);
}
