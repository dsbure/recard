import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText } from '@ionic/react';
import { useEffect, useState } from 'react';

export interface IFlashcardProps {
  text: string
  index: number
  choices: string[]
  handleAnswerClick: Function
  skeletonChoices: boolean
}

export function Flashcard({index, text, choices, handleAnswerClick, skeletonChoices}: IFlashcardProps) {
  const [shuffledChoices, setShuffledChoices] = useState(choices.map(e => ({ e, sort: Math.random() })) 
  .sort((a, b) => a.sort - b.sort) 
  .map(({ e }) => e));
  useEffect(() => {
    setShuffledChoices(choices.map(e => ({ e, sort: Math.random() })) 
    .sort((a, b) => a.sort - b.sort) 
    .map(({ e }) => e));
  }, [index]);
  return (<IonGrid>
    <IonRow>
      <IonCol>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>{"Question " + index} </IonCardSubtitle>
            <IonCardTitle>{text}</IonCardTitle>
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
