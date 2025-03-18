import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonSpinner, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import './MainTab.css';
import { arrowBack, flash, heart, home, person, trash } from 'ionicons/icons';
import { TopicView } from '../components/TopicView';
import { useEffect, useState } from 'react';
import { IFlashcardData } from '../components/IFlashcardData'; import { IFlashcardCategory } from "../components/IFlashcardCategory";
import flashcardStorageService from '../services/flashcardStorageService';
import { HomeView } from '../components/HomeView';
import EXPStorageService from '../services/EXPStorageService';
import FetchFlashcardData from '../services/FetchFlashcardData';
import StorageService from '../services/StorageService';
import { TopicHeader } from '../components/TopicHeader';
import { useThemeDetector } from '../hooks/useThemeDetector';

const MainTab: React.FC = () => {
  const [headerButtons, setHeaderButtons] = useState(<>
    <IonSegmentButton className="loading-tab" value="loading" disabled={true}>
      <IonSpinner name="dots"></IonSpinner>
    </IonSegmentButton>
  </>);
  const [pageView, setPageView] = useState(<></>);
  const [selectedSegment, setSelectedSegment] = useState<string>("home");

  const themeDetector = useThemeDetector();
  const [colorTheme, setColorTheme] = useState("light");

  const [presentAlert] = useIonAlert();
  
  let pageViewLoaded = false;
  useEffect(() => {
    FetchFlashcardData.getFlashcardData(false, false) //import.meta.env.VITE_IN_DEVELOPMENT
      // really complicated for no reason whatsoever
      .then((data: IFlashcardData) => {
        if (!data.categories) return;
        const segmentViews = data.categories.map((category, index) => (
          <IonSegmentContent key={index} id={`tab${index}`}>
            <TopicView {...category} />
          </IonSegmentContent>
        ));
        setPageView(<>{segmentViews}</>);
        pageViewLoaded = true;
      })
      .catch((error) => console.error('Load error:', error));
    const updateFlashcardTabs = async () => {
      setTimeout(() => {
        StorageService.getItem("cachedCategoryData").then((data: IFlashcardCategory[]) => {
          if (!data) return;
          const segmentButtons = data.map((category, index) => (
            <IonSegmentButton key={index} value={index.toString()} contentId={`tab${index}`}>
              <IonLabel>{category.categoryName}</IonLabel>
            </IonSegmentButton>
          ));

          setHeaderButtons(<>{segmentButtons}</>);
          if (!pageViewLoaded) {
            setPageView(<>
              {
                data.map((category, index) => {
                  return (
                    <IonSegmentContent key={index} id={`tab${index}`}>
                      <TopicHeader {...category} />
                      <IonCard className="loading-card">
                        <IonCardHeader>
                          <IonSpinner name="dots"></IonSpinner>
                        </IonCardHeader>
                      </IonCard>
                    </IonSegmentContent>
                  );
                })
              }
            </>);
          }
        }
        );
      }, 0);
    };
    const unsubscribe = FetchFlashcardData.subscribe(updateFlashcardTabs);
    return () => { unsubscribe() };
  }, []);

  useEffect(() => {
    setColorTheme(
      themeDetector ? "dark" : "light"
    );
  }, [themeDetector]);

  return (
    <IonPage>
      <IonHeader id="main-header">
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                presentAlert({
                  header: 'Clear Data',
                  message: 'Are you sure you want to clear data? (or clear cached data to fix errors)',
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'close'
                    },
                    {
                      text: 'Clear Data',
                      role: 'close',
                      handler: () => {
                        flashcardStorageService.clearData();
                        EXPStorageService.clearData();
                      },
                    },
                    {
                      text: 'Clear Cached Data',
                      role: 'close',
                      handler: () => {
                        FetchFlashcardData.clearCachedData();
                      },
                    }
                  ]
                })
              }} shape="round">
              <IonIcon slot="icon-only" icon={trash}></IonIcon>
            </IonButton>
            <IonChip
              onClick={() => { }}
              className="avatar-toolbar"  
            >
              <IonAvatar>
                <img alt="User" src="./avatar.svg" />
              </IonAvatar>
            </IonChip>
          </IonButtons>
          <IonTitle>
            <IonImg
              id="recall-logo"
              src={`./recall-wordmark-${colorTheme}.svg`}
              alt="Recall"
            />
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonSegment
        value={selectedSegment}
        scrollable={true}
        onIonChange={(e) => {
          const value = e.detail.value;
          if (value !== undefined) {
            setSelectedSegment(value.toString());
          }
        }}
        className="tab-switcher"
      >
        <IonSegmentButton className="homebutton" value="home" contentId="home">
          <IonIcon icon={home}></IonIcon>
        </IonSegmentButton>
        {headerButtons}
      </IonSegment>
      <IonSegmentView id="main-content">
        <IonSegmentContent id="home">
          <HomeView />
        </IonSegmentContent>
        {pageView}
      </IonSegmentView>
    </IonPage>
  );
};

export default MainTab;
