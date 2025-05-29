import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonPopover, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonSpinner, IonTitle, IonToggle, IonToolbar, ToggleCustomEvent, useIonAlert, useIonModal, useIonRouter, useIonViewWillEnter } from '@ionic/react';
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
import Markdown from 'react-markdown';

const DebugButton: React.FC = () => {
  const [presentAlert] = useIonAlert();

  return <IonButton
    onClick={() => {
      presentAlert({
        header: 'Advanced Options',
        message: 'Here you can clear all your data (IRREVERSIBLE) or clear cached data to fix errors.',
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
    }} expand='block' size='default'>
    Advanced Options
  </IonButton>
}
const HelpButton: React.FC = () => {
  const [presentModal, dismissModal] = useIonModal(helpMarkdown, {
    dismiss: (data: string) => dismissModal(data),
  });

  return <IonButton
    onClick={() => { 
      presentModal({
        id: "help-modal"
      });
    }} shape="round">
    <IonIcon slot="icon-only" icon={helpCircle}></IonIcon>
  </IonButton>
}

// lol
const helpMd = `# RECALL | Official Game Manual

## THE LEGEND OF TROPICA

Long ago, the island world of Tropica thrived in peace, protected by the Four Sacred Stones—powerful relics that upheld nature and knowledge.

But when the shadowy creature Bombombini Gozini rose from the Seas of Turquoise, it began draining the world of its color and erasing memories.

Now, as the chosen grandchild of the Island Chief, you are entrusted with the ancient Nautilus. Your mission: recover the Four Stones, forge the Nether Star, and bring knowledge and life back to Tropica.

_**Will you recall what was forgotten?**_
___

## GAME OVERVIEW

Recall is a quiz-based educational game created for Grade 7 students to strengthen their understanding of Integrated Science through story-driven challenges and interactive learning.
___

## OBJECTIVE

- Play as the grandchild of the Island Chief (choose boy or girl)
- Complete each island's science-based review challenges
- Gather the Four Sacred Stones by finishing all review challenges each islad
- Forge the Nether Star using the stones and the Nautilus
- Defeat Bombombini Gozini and restore knowledge to Tropica
___

## ISLANDS & STONES

Each island holds a specific scientific focus:

- DILAWIKA – Force
- LUNTIYA – Earthquakes and Ecosystems
- BUGNAYA – Motion
- ALABINA – Heat and Energy

**_Note_**_: To unlock the next, you must complete all the challenges on one island._
___

## LEVELS & PROGRESSION

**LEVELS**

1. The game has 15 levels, starting from **Level 1: Nooblet** to **Level 15: Brainnotrot Ascended**. These levels are not tied to island difficulty; instead, they represent the player’s overall progress, similar to an experience bar.
2. Players earn levels by accumulating **Aura Points**, which reflect effort and consistency.
    1. Aura Points are earned based on:

**_Speed_** – How quickly you complete the quiz

**_Accuracy_** – How many answers do you get right

**PROGRESSION**

1. Each island contains **review challenges** (indicated by a star icon). To achieve mastery, a player must complete each review challenge **three times**. Once all challenges on an island are mastered, the player may proceed to the next island.
2. Complete all four islands to forge the **Nether Star** and defeat the mythical villain, **Bombombini Gozini**.

**_Note:_** _There is_ **_no fighting_** _in the game. Progress is made through_ **_story scenes_** _and_ **_quiz buttons_**_._
___

## QUIZ SYSTEM

Each lesson includes:

1. 10 questions
2. 3 Hearts (lives)

- 1 wrong answer = 1 lost heart
- 3 wrong = failed attempt (below 75%)
___

## SIGMA MODES

Get 4 correct answers in a row to activate Sigma Mode. Choose one power-up:

1\. Skip Question – Instantly move to the next question

2\. Time Freeze – Pause the timer temporarily

3\. 50/50 – Remove half of the incorrect choices (Only for multiple choice)

4\. Immunity – Ignore one incorrect answer without penalty

**_Note:_**

1. _If you obtained_ **_Sigma Mode_** _but didn’t activate it, your chosen power-up will still be available._
2. _If you activated_ **_Immunity_** _and answered the question correctly, it will remain active._
___

## CONTROLS & INTERFACE

**Tap** to answer questions and navigate dialogue

**Scroll** to access lesson buttons listed vertically

The game automatically saves after every level

Designed with a clean and accessible interface for students.
___

## KEY FEATURES

1. Quiz-based format built on the Grade 7 Science curriculum
2. Engaging story-driven learning
3. Lesson repetition to strengthen retention
4. Interactive power-ups for strategic support
5. Progress-tracking levels that motivate and reward effort
___

## TIPS FOR PLAYERS

1. Pay attention to story moments!
2. Use Sigma Mode power-ups wisely
3. Each island’s content is tied to its science topic
4. The more you remember, the further you’ll go

**_ARE YOU READY TO RECALL?_**

Collect the stones. Forge the star. Save Tropica.
Let learning light the way.`;

function helpMarkdown({ dismiss }: { dismiss: (data?: string) => void }) {
  const ref = useRef<HTMLIonInputElement>(null);
  return (
    <IonContent id="help-modal-inner" class="ion-padding">
      
      <Markdown>{helpMd}</Markdown>
      <IonButton onClick={() => dismiss()} id="help-close">Close</IonButton>
    </IonContent>
  );
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

  const mutedRef = useRef<HTMLIonToggleElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setColorTheme(themeDetector);
  }, [themeDetector]);

  useIonViewWillEnter(() => {
    StorageService.getItem("muted").then((e) => {
      setMuted(e);
    });
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

  const handleMuteToggle = (e: ToggleCustomEvent<{ checked: boolean }>) => {
    StorageService.setItem("muted", !e.detail.checked);
    setMuted(!e.detail.checked);
  }

  return (
    <IonPage>
      <video src="./homepage.mp4" id="homepage-bg" autoPlay muted loop></video>
      <IonHeader id="main-header">
        <IonToolbar>
          <IonButtons slot="end">
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
              <IonToggle 
                enableOnOffLabels={true}
                ref={mutedRef}
                onIonChange={(e) => {
                  handleMuteToggle(e);
                }}
                checked={!muted}
              >
                Sound {muted ? "Off" : "On"}
              </IonToggle>
            </IonItem>
            <IonItem>
              <DebugButton />
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
