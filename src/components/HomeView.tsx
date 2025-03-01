import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonLabel, IonProgressBar, useIonViewWillEnter, IonChip, useIonViewDidLeave } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import EXPStorageService from '../services/EXPStorageService';

export function HomeView() {
  const [expData, setExpData] = useState({ currentLevel: 1, currentEXP: 0, levelEXP: 0 });
  const [progress, setProgress] = useState(0);
  const [expToNextLevel, setExpToNextLevel] = useState(100);

  useEffect(() => {
    const updateData = async () => {
      setTimeout(() => {
        EXPStorageService.getExperienceData().then((e) => {
          setExpData(e);
        })
        EXPStorageService.getLevelProgress().then((e) => {
          setProgress(e);
        })
        EXPStorageService.getEXPToNextLevel().then((e) => {
          setExpToNextLevel(e);
        })
      }, 0);
    };
    const unsubscribe = EXPStorageService.subscribe(updateData);
    updateData();
    return () => { unsubscribe() };
  }, []);
  
  return <>
    <IonCard className="topicHeader">
      <IonCardHeader>
        <IonCardTitle>Home</IonCardTitle>
        <IonCardSubtitle>Welcome, Jam "Zipknot" Jam!</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <h2>Level {expData.currentLevel}</h2>
        <IonProgressBar value={progress} />
        <IonChip>Total: {expData.currentEXP} XP</IonChip>
        <IonChip>Next Level: {expToNextLevel} XP</IonChip>
      </IonCardContent>
    </IonCard>
  </>;
}
