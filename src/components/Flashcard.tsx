import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton } from '@ionic/react';

export interface IFlashcardProps {
  text: string
  index: number
  choices: string[]
  handleAnswerClick: Function
}

export function Flashcard({index, text, choices, handleAnswerClick}: IFlashcardProps) {
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
        {choices.map((q, i) => <IonButton key={i} expand="block" onClick={() => handleAnswerClick(q)}>{q}</IonButton>)}
      </IonCol>
    </IonRow>
  </IonGrid>);
}
