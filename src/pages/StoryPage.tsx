import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonPage, IonTitle, IonToolbar, useIonAlert, useIonRouter } from '@ionic/react';
import './StoryPage.css';
import { useParams } from 'react-router';
import { arrowBack, arrowForward, arrowForwardCircle } from 'ionicons/icons';
import { useEffect, useState } from 'react';

interface StoryPageParams {
  quarter: string;
}

const storyNames: Record<string, string> = {
  Q0: "Where Force Meets Fate: Dilawika"
};

const StoryPage: React.FC = () => {
  const { quarter } = useParams<StoryPageParams>();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [nextVisible, setNextVisible] = useState(true);
  const [showAlert] = useIonAlert();
  const [setIndexFuncOverride, setSetIndexFuncOverride] = useState(14);
  const [override, setOverride] = useState(false);
  const [clickToContinue, setClickToContinue] = useState(false);
  const router = useIonRouter();
  // i hate this
  useEffect(() => {
    // special children
    if (quarter === "Q0") {
      if (currentIndex === 23) {
        router.push("/mainTab", "back");
        setNextVisible(true);
        setOverride(false);
      } else if (currentIndex === 10) {
        setNextVisible(false);
        setTimeout(() => {
          showAlert({
            header: 'Choose a chest to open!',
            subHeader: 'Choose wisely',
            backdropDismiss: false,
            buttons: [
              {
                text: 'Choose the left chest',
                handler: () => {
                  setCurrentIndex(11);
                },
              },
              {
                text: 'Choose the middle chest',
                handler: () => {
                  setCurrentIndex(12);
                },
              },
              {
                text: 'Choose the right chest',
                handler: () => {
                  setCurrentIndex(13);
                },
              },
            ],
          })
        }, 2000)
      } else if (currentIndex >= 11 && currentIndex <= 13) {
        setSetIndexFuncOverride(14);
        setNextVisible(true);
        setOverride(true);
      } else {
        setNextVisible(true);
        setOverride(false);
      }
    } else if (quarter === "Q1") {
      if (currentIndex === 20) {
        router.push("/mainTab", "back");
      } 
    } else if (quarter === "E1") {
      if (currentIndex === 5) {
        router.push("/mainTab", "back");
      } 
    } else if (quarter === "Q2") {
      if (currentIndex === 13) {
        router.push("/mainTab", "back");
      } 
    } else if (quarter === "E2") {
      if (currentIndex === 5) {
        router.push("/mainTab", "back");
      } 
    } else if (quarter === "Q3") {
      if (currentIndex === 22) {
        router.push("/mainTab", "back");
        setNextVisible(true);
        setOverride(false);
        setClickToContinue(false);
      } else if ([9, 11, 13].includes(currentIndex)) {
        setNextVisible(false);
        setClickToContinue(true);
      } else {
        setClickToContinue(false);
        setNextVisible(true);
        setOverride(false);
      }
    } else if (quarter === "E3") {
      if (currentIndex === 2) {
        router.push("/mainTab", "back");
      } 
    } else if (quarter === "Q4") {
      if (currentIndex === 8) {
        router.push("/mainTab", "back");
      } 
    } else if (quarter === "E4") {
      if (currentIndex === 18) {
        router.push("/mainTab", "back");
      } 
    } else {
      setNextVisible(true);
      setOverride(false);
    }

  }, [quarter, currentIndex])
  return (
    <IonPage>
      <IonHeader id="story-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/mainTab" routerDirection="back" shape="round">
              <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle id="story-title">{storyNames[quarter] ?? `Story: ${quarter}`}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="story-content-container">
        <div className="story-content">
          <video autoPlay id="s-video" key={`v-${currentIndex}`}
          onClick={() => {
            if (!clickToContinue) return;
            if (override) {
              setCurrentIndex(setIndexFuncOverride);
              return;
            }
            setCurrentIndex((prev) => prev + 1);
          }}>
            <source src={`./storyVid/${quarter}/${currentIndex}.mp4`} type="video/mp4" />
          </video>
          <IonButton expand="full" size="large" className={"next-button" + (nextVisible ? "" : " hide")} onClick={() => {
            if (override) {
              setCurrentIndex(setIndexFuncOverride);
              return;
            }
            setCurrentIndex((prev) => prev + 1);
          }}>
            <IonIcon slot="icon-only" icon={arrowForwardCircle}></IonIcon>
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StoryPage;
