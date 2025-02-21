import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText } from '@ionic/react';
import { useEffect, useState } from 'react';
import { IFlashcardTopic } from './IFlashcardTopic';

export interface IFlashcardProps {
  flashcard: IFlashcardTopic["flashcards"]["0"]
  index: number
  handleAnswerClick: Function
  skeletonChoices: boolean
}

export function Flashcard({index, flashcard, handleAnswerClick, skeletonChoices}: IFlashcardProps) {
  const [shuffledChoices, setShuffledChoices] = useState(flashcard.multipleChoices.map(e => ({ e, sort: Math.random() })) 
  .sort((a, b) => a.sort - b.sort) 
  .map(({ e }) => e));
  useEffect(() => {
    setShuffledChoices(flashcard.multipleChoices.map(e => ({ e, sort: Math.random() })) 
    .sort((a, b) => a.sort - b.sort) 
    .map(({ e }) => e));
  }, [flashcard]);
  return (<IonGrid>
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
    <IonRow>
      <IonCol className="ion-padding">
        {shuffledChoices.map((q, i) => {
          return <IonButton key={i} expand="block" onClick={() => handleAnswerClick(q)}>
            {skeletonChoices ? <IonSkeletonText animated={true} style={{ width: '80px' }} /> : <IonLabel>{q}</IonLabel>}
          </IonButton>
        })}
      </IonCol>
    </IonRow>
  </IonGrid>);
}
