import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonLabel, IonProgressBar, useIonViewWillEnter, IonChip, useIonViewDidLeave, IonButton, IonImg, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import EXPStorageService from '../services/EXPStorageService';
import FetchFlashcardData from '../services/FetchFlashcardData';
import { diamond, text } from 'ionicons/icons';
import { GemCard } from './GemCard';
import FlashcardStorageService from '../services/FlashcardStorageService';

export function HomeView() {
  const [expData, setExpData] = useState({ currentLevel: 1, currentEXP: 0, levelEXP: 0 });
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [expToNextLevel, setExpToNextLevel] = useState(100);

  useIonViewWillEnter(() => {
    const updateEXPData = async () => {
      const [expData, progress, expToNextLevel] = await Promise.all([
        EXPStorageService.getExperienceData(),
        EXPStorageService.getLevelProgress(),
        EXPStorageService.getEXPToNextLevel(),
      ]);

      setExpData(expData);
      setProgress(progress);
      setExpToNextLevel(expToNextLevel);
    };
    const updateTotalProgressData = async () => {
      const [totalFinished, totalTopics] = await Promise.all([
        FlashcardStorageService.getTotalFinished(),
        FetchFlashcardData.getTotalTopics(),
      ]);

      setTotalProgress(totalFinished / (totalTopics || 1));
    };
    const unsubscribeEXPStorageService = EXPStorageService.subscribe(updateEXPData);
    const unsubscribeFetchFlashcardData = FetchFlashcardData.subscribe(updateTotalProgressData);
    const unsubscribeFSSData = FlashcardStorageService.subscribe(updateTotalProgressData);
    updateEXPData();
    updateTotalProgressData();
    return () => { 
      unsubscribeEXPStorageService();
      unsubscribeFetchFlashcardData();
      unsubscribeFSSData();
    };
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
      <IonLabel 
        id="total-progress-label" 
        style={{ 
          right: `calc(${(1 - totalProgress) * 100}% - ${totalProgress < 0.15 ? "62" : "4"}px)`,
          color: (totalProgress < 0.15 ? "var(--ion-text-color)" : "var(--ion-background-color)"),
        }}>
          {Math.round(totalProgress * 100)}%
        </IonLabel>
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
