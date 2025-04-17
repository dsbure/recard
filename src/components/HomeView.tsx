import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonLabel, IonProgressBar, useIonViewWillEnter, IonChip, useIonViewDidLeave, IonButton, IonImg, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import EXPStorageService from '../services/EXPStorageService';
import FetchFlashcardData from '../services/FetchFlashcardData';
import { diamond, text } from 'ionicons/icons';
import { GemCard } from './GemCard';
import FlashcardStorageService from '../services/FlashcardStorageService';
import StorageService from '../services/StorageService';
import { IFlashcardCategory } from '../interfaces/IFlashcardCategory';
import { IPlayerData } from '../interfaces/IPlayerData';
import BadgeService from '../services/BadgeService';

interface IHomeView {
  setTab: (index: string) => void
}

export function HomeView({setTab}: IHomeView) {
  const [expData, setExpData] = useState({ currentLevel: 1, currentEXP: 0, levelEXP: 0, levelName: "" });
  const [playerData, setPlayerData] = useState<IPlayerData>();
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [expToNextLevel, setExpToNextLevel] = useState(100);
  const [categories, setCategories] = useState(<></>);
  const [badges, setBadges] = useState<{ elements: JSX.Element; length: number; }>();
  
  const [name, setName] = useState("");

  useIonViewWillEnter(() => {
    StorageService.getItem("playerData").then((e) => {
      setName((e as IPlayerData).name);
    });
    const updateEXPData = async () => {
      const [expData, progress, expToNextLevel] = await Promise.all([
        EXPStorageService.getExperienceData(),
        EXPStorageService.getLevelProgress(),
        EXPStorageService.getEXPToNextLevel(),
      ]);

      setExpData(expData);
      setProgress(progress);
      setExpToNextLevel(expToNextLevel);
      BadgeService.getAllBadges().then(e => 
        setBadges(e)
      );
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
    updateGemCards();
    return () => { 
      unsubscribeEXPStorageService();
      unsubscribeFetchFlashcardDataPD();
      unsubscribeFetchFlashcardDataGC();
      unsubscribeFSSData();
    };
  }, []);

  useEffect(() => {
    StorageService.getItem("playerData").then(e =>
      setPlayerData(e)
    );
  }, []);

  return <div className="ion-padding animate__animated animate__fadeInUp animate__faster">
    <IonImg className="main-avatar ion-padding" src={`./chars/a${playerData?.character}.png`} />
    <IonCard id="main-avatar-container">
      <IonCardHeader>
        <IonCardSubtitle>Welcome,</IonCardSubtitle>
        <IonCardTitle id="avatar-name">{name}!</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="avatar-content">
        <div id="avatar-img" >
          <IonImg src={`./levels/${Math.min(expData.currentLevel, 15)}.gif`} />
        </div>
        <h1 className="level-name">{EXPStorageService.getLevelName(expData.currentLevel)}</h1>
        <IonProgressBar value={progress} />
        <IonChip>Total: {expData.currentEXP} Aura</IonChip>
        <IonChip>Next Level: {expToNextLevel} Aura</IonChip>
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
    <IonCard className="badges">
      <IonCardHeader>
        <IonCardTitle>Badges</IonCardTitle>
        <IonCardSubtitle>{badges?.length ?? 0} of 15</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {badges?.elements}
      </IonCardContent>
    </IonCard>
  </div>;
}
