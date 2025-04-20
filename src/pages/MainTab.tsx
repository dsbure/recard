import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonPopover, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonSpinner, IonTitle, IonToolbar, useIonAlert, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import './MainTab.css';
import { arrowBack, bug, flash, heart, help, helpCircle, home, lockClosed, person, settings, trash } from 'ionicons/icons';
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
import { IPlayerData } from '../interfaces/IPlayerData';

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
const HelpButton: React.FC = () => {
  const [presentAlert] = useIonAlert();

  return <IonButton
    onClick={() => { }} shape="round">
    <IonIcon slot="icon-only" icon={helpCircle}></IonIcon>
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
  const [playerData, setPlayerData] = useState<IPlayerData>();

  const themeDetector = useThemeDetector();
  const [colorTheme, setColorTheme] = useState("light");

  const [popoverOpen, setPopoverOpen] = useState(false);
  const popper = usePopper({
    children: "Tap here to embark on your journey!",
    isOpen: popoverOpen,
    setIsOpen: setPopoverOpen
  });
  const [expData, setExpData] = useState({ currentLevel: 1, currentEXP: 0, levelEXP: 0, levelName: "" });
  const [name, setName] = useState("");

  const [availableIsles, setAvailableIsles] = useState<number>(0);

  useEffect(() => {
    setColorTheme(themeDetector);
  }, [themeDetector]);

  useIonViewWillEnter(() => {
    StorageService.getItem("playerData").then((e) => {
      setName((e as IPlayerData).name);
    });
    const updateEXPData = async () => {
      const expData = await EXPStorageService.getExperienceData();

      setExpData(expData);
    };
    const unsubscribeEXPStorageService = EXPStorageService.subscribe(updateEXPData);

    updateEXPData();
    return () => {
      unsubscribeEXPStorageService();
    };
  }, []);

  let pageViewLoaded = false;
  useLayoutEffect(() => {
    const updateAvailableIsles = () => setTimeout(() => {
      FlashcardStorageService.getUnlockedIsles().then((e) => {
        setAvailableIsles(e);
      })
    }, 500);
    const unsubscribe = FlashcardStorageService.subscribe(updateAvailableIsles);
    updateAvailableIsles();
    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    FetchFlashcardData.getFlashcardData(false, false) //import.meta.env.VITE_IN_DEVELOPMENT
      // really complicated for no reason whatsoever
      .then(async (data: IFlashcardData) => {
        if (!data.categories) return;
        const segmentViews = data.categories.map((category, index) => (
          <IonSegmentContent key={index} id={`tab${category.index}`} >
            <div className={index > availableIsles ? "view-disabled" : ""}>
              <TopicView {...category} />
            </div>
            {index > availableIsles ? <IonIcon src={lockClosed} className="lock" /> : null}
          </IonSegmentContent>
        ));
        setPageView(<>{segmentViews}</>);
        pageViewLoaded = true;
    }).catch((error) => console.error('Load error:', error));
    
    const updateFlashcardTabs = async () => {
      setTimeout(() => {
        StorageService.getItem("cachedCategoryData").then(async (data: IFlashcardCategory[]) => {
          if (!data) return;
          const segmentButtons = data.map((category, index) => {
            const offset = Math.round(((-Math.cos(index * Math.PI)) * 10) - 10);

            return <IonSegmentButton
              {...(index === availableIsles || (availableIsles >= data.length && index === data.length - 1) ? { ref: popper.refs.setReference } : {})}
              key={`index-${index}`}
              value={category.index.toString()}
              contentId={`tab${category.index}`}
              className={`segment animate__animated animate__fadeInLeft animate__faster ${index > availableIsles ? "locked" : null}`}
              style={{ translate: `0 ${offset}px` }}
            >
              <IonImg src={`./qtr/${index + 1}.svg`}></IonImg>
            </IonSegmentButton>
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
                    <IonSegmentContent key={index} id={`tab${category.index}`} >
                      <div className={index > availableIsles ? "view-disabled" : ""}>
                        <TopicHeader {...category} />
                        <IonCard className="loading-card">
                          <IonCardHeader>
                            <IonSpinner name="dots"></IonSpinner>
                          </IonCardHeader>
                        </IonCard>
                      </div>
                    </IonSegmentContent>
                  );
                })
              }
            </>);
          }
        });
      }, 1);
    };
    const unsubscribe = FetchFlashcardData.subscribe(updateFlashcardTabs);
    return () => {
      unsubscribe();
    };
  }, [availableIsles]);

  useEffect(() => {
    if (selectedSegment !== "home") {
      setPopoverOpen(false);
    }
  }, [selectedSegment]);

  useEffect(() => {
    StorageService.getItem("playerData").then(e =>
      setPlayerData(e)
    );
  }, []);

  return (
    <IonPage>
      <video src="./homepage.mp4" id="homepage-bg" autoPlay muted loop></video>
      <IonHeader id="main-header">
        <IonToolbar>
          <IonButtons slot="end">
            <DebugButton />
            <HelpButton />
            <IonChip
              onClick={() => { }}
              id="avatar-toolbar"
            >
              <IonImg src={`./levels/${expData.currentLevel}.gif`} />
              <IonLabel>{name}</IonLabel>
              <IonAvatar>
                <img alt="User" src=
                  {`./chars/a${playerData?.character}-profile.png`} />
              </IonAvatar>
            </IonChip>
          </IonButtons>
          <IonTitle>
            <IonImg
              id="recall-logo"
              src={`./recall-wordmark-${colorTheme === "dark" ? "light" : "dark"}.svg`}
              alt="Recall"
            />
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="avatar-toolbar" triggerAction="click">
        <IonContent class="settings-content">
          <IonList>
            <IonItem>
              <IonLabel>Malay q ba</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Also anong butngi q??</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
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
