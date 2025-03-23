import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonLabel, IonProgressBar, useIonViewWillEnter, IonChip, useIonViewDidLeave, IonButton, IonImg, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import EXPStorageService from '../services/EXPStorageService';
import FetchFlashcardData from '../services/FetchFlashcardData';
import { diamond, text } from 'ionicons/icons';
import { GemCard } from './GemCard';
import FlashcardStorageService from '../services/FlashcardStorageService';
import StorageService from '../services/StorageService';
import { IFlashcardCategory } from '../interfaces/IFlashcardCategory';

interface IHomeView {
  setTab: (index: string) => void
}

export function HomeView({setTab}: IHomeView) {
  const [expData, setExpData] = useState({ currentLevel: 1, currentEXP: 0, levelEXP: 0 });
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [expToNextLevel, setExpToNextLevel] = useState(100);
  const [categories, setCategories] = useState(<></>);

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
    const updateGemCards = async () => {
      StorageService.getItem("cachedCategoryData").then(async (data: IFlashcardCategory[]) => {
        if (!data) return;
        const gemCards = await Promise.all(data?.map(async (e, i) => {
          let disabled = await FlashcardStorageService.getCategoryData(e.categoryName).then(catData => !catData.isComplete);
          
          return <GemCard icon={e.gemIcon} gemName={e.gemName} quarter={e.gemQtr} disabled={disabled} setTab={() => setTab(e.index.toString())} key={i}/>
        }));
          
        setCategories(<>{gemCards.map(e => e)}</>);
      })
    };
    const unsubscribeEXPStorageService = EXPStorageService.subscribe(updateEXPData);
    const unsubscribeFetchFlashcardDataPD = FetchFlashcardData.subscribe(updateTotalProgressData);
    const unsubscribeFetchFlashcardDataGC = FetchFlashcardData.subscribe(updateGemCards);
    const unsubscribeFSSData = FlashcardStorageService.subscribe(updateTotalProgressData);

    updateEXPData();
    updateTotalProgressData();
    return () => { 
      unsubscribeEXPStorageService();
      unsubscribeFetchFlashcardDataPD();
      unsubscribeFetchFlashcardDataGC();
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
      {categories}
    </div>
  </div>;
}
