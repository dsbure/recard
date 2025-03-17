import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonLabel, IonProgressBar, useIonViewWillEnter, IonChip, useIonViewDidLeave, IonButton, IonImg, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import EXPStorageService from '../services/EXPStorageService';
import FetchFlashcardData from '../services/FetchFlashcardData';
import { diamond } from 'ionicons/icons';
import { GemCard } from './GemCard';

export function HomeView() {
  const [expData, setExpData] = useState({ currentLevel: 1, currentEXP: 0, levelEXP: 0 });
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0.15); // TODO: add true progress
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

  return <div className="ion-padding">
    <IonImg className="main-avatar ion-padding" src="./placeholder-avatar.svg" />
    <IonCard id="main-avatar-container">
      <IonCardHeader>
        <IonCardSubtitle>Welcome,</IonCardSubtitle>
        <IonCardTitle id="avatar-name">ZED!</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <h2>Level {expData.currentLevel}</h2>
        <IonProgressBar value={progress} />
        <IonChip>Total: {expData.currentEXP} XP</IonChip>
        <IonChip>Next Level: {expToNextLevel} XP</IonChip>
      </IonCardContent>
    </IonCard>
    <IonCard id="total-progress-container">
      <IonLabel id="total-progress-label" style={{ right: `calc(${(1 - totalProgress) * 100}% + 8px)` }}>{Math.round(totalProgress * 100)}%</IonLabel>
      <IonProgressBar value={totalProgress} buffer={totalProgress} id="total-progress" />
    </IonCard>
    <div className="gem-container">
      <GemCard icon={diamond} gemName="Garnet" quarter="1st Quarter" fill="#a32a62" disabled={false}/>
      <GemCard icon={diamond} gemName="Citrine" quarter="2nd Quarter" fill="#e7e794" disabled={true}/>
      <GemCard icon={diamond} gemName="Chrysoprase" quarter="3rd Quarter" fill="#96b29d" disabled={true}/>
      <GemCard icon={diamond} gemName="Lapis Lazuli" quarter="4th Quarter" fill="#0299ec" disabled={true}/>
    </div>
  </div>;
}
