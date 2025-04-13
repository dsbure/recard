import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonPage, IonPopover, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonSpinner, IonTitle, IonToolbar, useIonAlert, useIonRouter } from '@ionic/react';
import './MainTab.css';
import { arrowBack, bug, flash, heart, home, person, trash } from 'ionicons/icons';
import { TopicView } from '../components/TopicView';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IFlashcardData } from '../interfaces/IFlashcardData'; import { IFlashcardCategory } from "../interfaces/IFlashcardCategory";
import FlashcardStorageService from '../services/FlashcardStorageService';
import { HomeView } from '../components/HomeView';
import EXPStorageService from '../services/EXPStorageService';
import FetchFlashcardData from '../services/FetchFlashcardData';
import StorageService from '../services/StorageService';
import { TopicHeader } from '../components/TopicHeader';
import { useThemeDetector } from '../hooks/useThemeDetector';
import { usePopper } from '../hooks/Popper';

const DebugButton: React.FC = () => {
  const [presentAlert] = useIonAlert();

  return <IonButton
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
              FlashcardStorageService.clearData();
              EXPStorageService.clearData();
              StorageService.deleteAll();
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
    <IonIcon slot="icon-only" icon={bug}></IonIcon>
  </IonButton>
}


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
  
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popper = usePopper({
    children: "Tap here to start your journey!",
    isOpen: popoverOpen,
    setIsOpen: setPopoverOpen
  });

  useEffect(() => {
    setColorTheme(themeDetector);
  }, [themeDetector]);

  let pageViewLoaded = false;
  useEffect(() => {
  
    FetchFlashcardData.getFlashcardData(false, import.meta.env.VITE_IN_DEVELOPMENT) //import.meta.env.VITE_IN_DEVELOPMENT
      // really complicated for no reason whatsoever
      .then((data: IFlashcardData) => {
        if (!data.categories) return;
        const segmentViews = data.categories.map((category, index) => (
          <IonSegmentContent key={index} id={`tab${category.index}`}>
            <TopicView {...category} />
          </IonSegmentContent>
        ));
        setPageView(<>{segmentViews}</>);
        pageViewLoaded = true;
      })
      .catch((error) => console.error('Load error:', error));
      
    const updateFlashcardTabs = async () => {
      setTimeout(() => {
        StorageService.getItem("cachedCategoryData").then(async (data: IFlashcardCategory[]) => {
          if (!data) return;
          const segmentButtons = data.map((category, index) => {

            return <>
              <IonSegmentButton {...(index === 0 ? {ref: popper.refs.setReference} : {})} key={`index-${index}`} value={category.index.toString()} contentId={`tab${category.index}`} className="animate__animated animate__fadeInLeft animate__faster" >
                <IonLabel key={index}>{category.categoryName}</IonLabel>
              </IonSegmentButton>
            </>
          });

          setHeaderButtons(<>{segmentButtons}</>);
          setTimeout(async () => {
            setPopoverOpen(true);
          }, 1000);
          if (!pageViewLoaded) {
            setPageView(<>
              {
                data.map((category, index) => {
                  return (
                    <IonSegmentContent key={index} id={`tab${category.index}`}>
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
        });
      }, 0);
    };
    const unsubscribe = FetchFlashcardData.subscribe(updateFlashcardTabs);
    return () => { unsubscribe() };
  }, []);
  useEffect(() => {
    if (selectedSegment === "1") {
      setPopoverOpen(false);
    }
  }, [selectedSegment]);

  return (
    <IonPage>
      <IonHeader id="main-header">
        <IonToolbar>
          <IonButtons slot="end">
            <DebugButton />
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

      {popper.popover}
      <div className="tab-switcher-container">
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
      </div>
      <IonSegmentView id="main-content">
        <IonSegmentContent id="home">
          <HomeView setTab={(index: string) => setSelectedSegment(`${index}`)} />
        </IonSegmentContent>
        {pageView}
      </IonSegmentView>
    </IonPage>
  );
};

export default MainTab;
