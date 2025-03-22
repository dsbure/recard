import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText } from '@ionic/react';
import { Ref, useEffect, useRef, useState } from 'react';
import './Flashcard.css';
import './FMatchingType.css';
import { IFInteractionProps } from '../interfaces/IFInteractionProps';

const shuffleItems = (array: string[]) => {
  return array.map(e => ({ e, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ e }) => e);
};


const MatchingTypeChoice: React.FC<{ ref?: React.LegacyRef<HTMLIonButtonElement>, skeleton: boolean, isCorrect: boolean | null, setSideChoice: (choice: string) => void, content: string, currentSelected: string, onDismiss?: () => void }> = ({ ref, skeleton, isCorrect, setSideChoice, content, currentSelected, onDismiss }) => {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [localCorrect, setLocalCorrect] = useState(isCorrect);
  const [dismissed, setDismissed] = useState(false);
  const handleClick = () => {
    setChecked((prev) => {
      if (!prev) {
        setSideChoice(content);
      } else {
        setSideChoice("");
      }
      return !prev;
    });
  };
  useEffect(() => {
    if (!dismissed) setChecked(currentSelected === content);
  }, [currentSelected]);
  useEffect(() => {
    console.log(dismissed);
    
    if (!dismissed) setLocalCorrect(isCorrect);
  }, [isCorrect]);
  useEffect(() => {
    if (isCorrect !== null) {
      setDismissed(true);
      if (onDismiss) onDismiss();
      setTimeout(() => {
        setDisabled(true);
      }, 2000);
    }
  }, [isCorrect]);
  return (<IonButton className={(localCorrect !== null ? `choice correct ${!localCorrect ? "in" : ""}` : "choice") + (checked ? " checked" : "")} expand="block" onClick={() => handleClick()} ref={ref} disabled={disabled}>
    <div className="wipe"></div>
    {skeleton ? <IonSkeletonText animated={true} style={{
      width: '80px'
    }} /> : <IonLabel>{content}</IonLabel>}
  </IonButton>);
}
// horribly implemented
export function FMatchingType({ flashcard, handleAnswerClick, interaction, skeleton }: IFInteractionProps) {
  const [choicesSideA, setChoicesSideA] = useState(shuffleItems(interaction.matchTypeSideA!));
  const [choicesSideB, setChoicesSideB] = useState(shuffleItems(interaction.matchTypeSideB!));
  useEffect(() => {
    setChoicesSideA(shuffleItems(interaction.matchTypeSideA!));
    setChoicesSideB(shuffleItems(interaction.matchTypeSideB!));

    setSelectedSideA("");
    setSelectedSideB("");

    setCorrectSideA(["", null]);
    setCorrectSideB(["", null]);

    setTotalMatches(0);
    setTotalCorrect(0);
  }, [flashcard]);

  const [selectedSideA, setSelectedSideA] = useState("");
  const [selectedSideB, setSelectedSideB] = useState("");

  const [correctSideA, setCorrectSideA] = useState<[string, boolean | null]>(["", null]);
  const [correctSideB, setCorrectSideB] = useState<[string, boolean | null]>(["", null]);

  const [totalMatches, setTotalMatches] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  useEffect(() => {
    if (selectedSideA === "" || selectedSideB === "") return;
    
    const sideAIndex = interaction.matchTypeSideA!.indexOf(selectedSideA);
    const sideBIndex = interaction.matchTypeSideB!.indexOf(selectedSideB);
    
    setCorrectSideA([selectedSideA, sideAIndex === sideBIndex]);
    setCorrectSideB([selectedSideB, sideAIndex === sideBIndex]);

    setTotalMatches((prev) => prev += 1);
    if (sideAIndex === sideBIndex) setTotalCorrect((prev) => prev += 1);
  }, [selectedSideA, selectedSideB]);

  useEffect(() => {
    if (totalMatches >= interaction.matchTypeSideA!.length) {
      handleAnswerClick(
        totalCorrect === totalMatches, 
        `${totalCorrect === totalMatches ? "" : "in"}correct`, 
        "matchType", "correct");
    }
  }, [totalMatches]);
  const dismiss = () => {
    setSelectedSideA("");
    setSelectedSideB("");

    setCorrectSideA(["", null]);
    setCorrectSideB(["", null]);
  }
  return (<>
    <div className="match-type-side-a match-type-side">
      {choicesSideA.map((q, i) => {
        return <MatchingTypeChoice 
          key={i} 
          skeleton={skeleton} 
          setSideChoice={(choice: string) => setSelectedSideA(choice)}
          onDismiss={dismiss}
          content={q} 
          isCorrect={correctSideA[0] === q ? correctSideA[1] : null} 
          currentSelected={selectedSideA}/>
      })}
    </div>
    <div className="match-type-separator"></div>
    <div className="match-type-side-b match-type-side">
      {choicesSideB.map((q, i) => {
        
        return <MatchingTypeChoice 
          key={i} 
          skeleton={skeleton} 
          setSideChoice={(choice: string) => setSelectedSideB(choice)} 
          content={q} 
          isCorrect={correctSideB[0] === q ? correctSideB[1] : null} 
          currentSelected={selectedSideB}/>
      })}
    </div>
  </>);
}
