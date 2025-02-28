import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonLabel, IonSkeletonText, IonInput, IonCardContent } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import './FIdentification.css';
import { IFInteractionProps } from './IFInteractionProps';

export function FIdentification({ handleAnswerClick, interaction, skeleton }: IFInteractionProps) {
  const input = useRef<HTMLIonInputElement>(null);
  const handleAnswer = (q: string) => {
    if (Array.isArray(interaction.correct)) {
      handleAnswerClick(interaction.correct.map(e => e.toLowerCase()).includes(q.toLowerCase()), q);
    } else {
      handleAnswerClick(interaction.correct.toLowerCase() === q, q, "identification");
    }
  }
  return (<IonCard>
    <IonCardContent className="identification-content">
      <IonInput label="Answer" labelPlacement="floating" fill="outline" placeholder="Enter your answer" ref={input}></IonInput>
      <IonButton expand="block" onClick={() => handleAnswer(input.current?.value?.toString().toLowerCase() || "")}>{skeleton ? <IonSkeletonText animated={true} style={{ width: '80px' }} /> : <IonLabel>Submit</IonLabel>}</IonButton>
    </IonCardContent>
  </IonCard>);
}
