import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText, IonCheckbox } from '@ionic/react';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from 'react';
import { IFlashcardTopic } from '../interfaces/IFlashcardTopic';
import './Flashcard.css';
import { IFInteractionProps } from '../interfaces/IFInteractionProps';


const CheckboxChoice: React.FC<{ skeleton: boolean, flashcardCorrect: string[], choiceContent: string, toggleChoice: (e: string, add: boolean) => void }> = ({ skeleton, flashcardCorrect, choiceContent, toggleChoice }) => {
  const [checked, setChecked] = useState(false);
  const toggleState = () => {
    toggleChoice(choiceContent, !checked);
    setChecked(prev => !prev);
  }
  return (
    <IonButton 
      className={(flashcardCorrect.includes(choiceContent) ? "choice correct" : "choice") + (checked ? " checked" : "")} 
      expand="block" 
      onClick={toggleState} 
      disabled={flashcardCorrect.length !== 0 && !flashcardCorrect.includes(choiceContent)}
    >
      <div className="wipe"></div>
      <IonCheckbox className="choice-checkbox" checked={checked} style={{ pointerEvents: 'none' }}></IonCheckbox>
      {skeleton ? <IonSkeletonText animated={true} style={{ width: '80px' }} /> : <IonLabel>{choiceContent}</IonLabel>}
    </IonButton>
  );
}


export function FCheckboxes({ flashcard, handleAnswerClick, interaction, skeleton }: IFInteractionProps) {
  const [shuffledChoices, setShuffledChoices] = useState(interaction.checkboxes!.map(e => ({ e, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ e }) => e));
  useEffect(() => {
    selectedChoices.current = [];
    setFlashcardCorrect([]);
    setShuffledChoices(interaction.checkboxes!.map(e => ({ e, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ e }) => e));
  }, [flashcard]);
  const [flashcardCorrect, setFlashcardCorrect] = useState<string[]>([]);
  let selectedChoices = useRef<string[]>([]);

  const setChoice = (q: string, add: boolean) => {
    if (add) {
      if (!selectedChoices.current.includes(q)) selectedChoices.current.push(q);
    } else {
      selectedChoices.current = selectedChoices.current.filter(e => e !== q);
    }
  }

  const handleAnswer = () => {
    setFlashcardCorrect(Array.isArray(flashcard.interaction.correct) ? flashcard.interaction.correct : [flashcard.interaction.correct]);
    selectedChoices.current.sort();
    let correctAnswers: string[] = [];
    if (Array.isArray(flashcard.interaction.correct)) {
      correctAnswers = flashcard.interaction.correct.sort();
    } else {
      correctAnswers = [flashcard.interaction.correct];
    }
    if (correctAnswers.length !== selectedChoices.current.length) {
      handleAnswerClick(false, selectedChoices.current, "checkboxes");
    } else {
      let correct = true;
      for (let i = 0; i < correctAnswers.length; i++) {
        if (correctAnswers[i] !== selectedChoices.current[i]) correct = false;
      }
      handleAnswerClick(correct, selectedChoices.current, "checkboxes");
    }
  }
  return (<>
    {shuffledChoices.map((q, i) => {
      return <CheckboxChoice key={i} skeleton={skeleton} flashcardCorrect={flashcardCorrect} choiceContent={q} toggleChoice={setChoice}></CheckboxChoice>
    })}
    <hr />
    <IonButton className="submit-checkboxes" size="large" expand="block" onClick={() => handleAnswer()}>Submit</IonButton>
  </>);
}
