import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText } from '@ionic/react';
import { useEffect, useState } from 'react';
import { IFlashcardTopic } from './IFlashcardTopic';
import './Flashcard.css';
import { IFInteractionProps } from './IFInteractionProps';

export function FMultipleChoice({ flashcard, handleAnswerClick, interaction, skeleton }: IFInteractionProps) {
  const [shuffledChoices, setShuffledChoices] = useState(interaction.multipleChoices!.map(e => ({ e, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ e }) => e));
  useEffect(() => {
    setShuffledChoices(interaction.multipleChoices!.map(e => ({ e, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ e }) => e));
  }, [flashcard]);
  const [flashcardCorrect, setFlashcardCorrect] = useState("");
  const handleAnswer = (q: string) => {
  	setFlashcardCorrect(Array.isArray(flashcard.interaction.correct) ? "" : flashcard.interaction.correct);
	handleAnswerClick(q === (Array.isArray(flashcard.interaction.correct) ? "" : flashcard.interaction.correct), q, "multipleChoice");
  }
  return (<>
    {shuffledChoices.map((q, i) => {
      return <IonButton className={(flashcardCorrect|| "") === q ? "choice correct" : "choice"} key={i} expand="block" onClick={() => handleAnswer(q)} disabled={(flashcardCorrect|| "") !== "" && (flashcardCorrect|| "") !== q}>
        {skeleton ? <IonSkeletonText animated={true} style={{ width: '80px' }} /> : <IonLabel>{q}</IonLabel>}
      </IonButton>
    })}
  </>);
}
