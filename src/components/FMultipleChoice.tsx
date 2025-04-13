import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText } from '@ionic/react';
import { useEffect, useImperativeHandle, useState } from 'react';
import { IFlashcardTopic } from '../interfaces/IFlashcardTopic';
import './Flashcard.css';
import { IFInteractionProps } from '../interfaces/IFInteractionProps';
import React from 'react';

export const FMultipleChoice = React.forwardRef<any, IFInteractionProps>(({ flashcard, handleAnswerClick, interaction, skeleton }, ref) => {
  const shuffleChoices = (choices: string[]) => {
    return choices
      .map(e => ({ e, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ e }) => ({ content: e, hidden: false }));
  };

  const [shuffledChoices, setShuffledChoices] = useState(shuffleChoices(interaction.multipleChoices!));
  
  useEffect(() => {
    setFlashcardCorrect("");
    setShuffledChoices(shuffleChoices(interaction.multipleChoices!));
  }, [flashcard]);

  const [flashcardCorrect, setFlashcardCorrect] = useState("");
  const handleAnswer = (q: string) => {
    setFlashcardCorrect(Array.isArray(flashcard.interaction.correct) ? "" : flashcard.interaction.correct);
    handleAnswerClick(q === (Array.isArray(flashcard.interaction.correct) ? "" : flashcard.interaction.correct), q, "multipleChoice");
  }

  useImperativeHandle(ref, () => ({
    fiftyFifty() {
      const answer = shuffledChoices.find(e => e.content === flashcard.interaction.correct);
      
      const newLength = Math.max(Math.round(shuffledChoices.length / 2), 2);
      const newChoices: { content: string; hidden: boolean; }[] = [];
      const newShuffledChoices = shuffleChoices(interaction.multipleChoices!.filter(e => e !== answer?.content));
      for (let i = 1; i < newLength; i++) {
        newChoices.push(newShuffledChoices[i]);
      }
      newChoices.push(answer!);
      setShuffledChoices(shuffledChoices.map(e => ({ content: e.content, hidden: newChoices.findIndex(q => q.content === e.content) === -1 })));
    }
  }));

  return (<>
    {shuffledChoices.map((q, i) => {
      return <IonButton className={((flashcardCorrect || "") === q.content ? "choice correct" : "choice") + (q.hidden ? " c-hidden" : "")} key={i} expand="block" onClick={() => handleAnswer(q.content)} disabled={(flashcardCorrect || "") !== "" && (flashcardCorrect || "") !== q.content}>
        <div className="wipe"></div>
        {
          skeleton ? (
            <IonSkeletonText animated={true} style={{ width: '80px' }} />
          ) : interaction.images ? (
            <img
              src={interaction.images[interaction.multipleChoices?.findIndex(e => e === q.content) || 0]}
              alt={q.content}
              title={q.content}
            />
          ) : (
            <IonLabel>{q.content}</IonLabel>
          )
        }
      </IonButton>
    })}
  </>);
})
