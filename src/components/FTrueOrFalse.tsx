import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText, IonIcon } from '@ionic/react';
import { useEffect, useState } from 'react';
import { IFlashcardTopic } from '../interfaces/IFlashcardTopic';
import './FTrueOrFalse.css';
import { IFInteractionProps } from '../interfaces/IFInteractionProps';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';

export function FTrueOrFalse({ flashcard, handleAnswerClick, interaction, skeleton }: IFInteractionProps) {
  const [flashcardCorrect, setFlashcardCorrect] = useState("");
  const handleAnswer = (q: string) => {
    setFlashcardCorrect(Array.isArray(flashcard.interaction.correct) ? "" : flashcard.interaction.correct);
    handleAnswerClick(q === (Array.isArray(flashcard.interaction.correct) ? "" : flashcard.interaction.correct), q, "trueFalse");
  }
  return (<div className="true-or-false">
    <IonButton 
      className={(flashcardCorrect || "") === "true" ? "choice correct" : "choice"} // hell yeah screw you typescript
      expand="block" 
      onClick={() => handleAnswer("true")} 
      disabled={(flashcardCorrect || "") === "false"}>
      <div className="wipe"></div>
      <IonIcon icon={checkmarkCircle} />
      <IonLabel>True</IonLabel>
    </IonButton>
    <IonButton 
      className={(flashcardCorrect || "") === "false" ? "choice correct" : "choice"} // hell yeah screw you typescript
      expand="block" 
      onClick={() => handleAnswer("false")} 
      disabled={(flashcardCorrect || "") === "true"}>
      <div className="wipe"></div>
      <IonIcon icon={closeCircle} />
      <IonLabel>False</IonLabel>
    </IonButton>
  </div>);
}
