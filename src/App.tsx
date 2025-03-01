import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import MainTab from './pages/MainTab';
import FlashcardPage from './pages/FlashcardPage';
import Results from './pages/Results';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import StoryPage from './pages/StoryPage';

setupIonicReact({
  mode: 'md',
});

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter basename="/">
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/mainTab">
            <MainTab />
          </Route>
          <Route exact path="/flashcard">
            <FlashcardPage />
          </Route>
          <Route path="/results">
            <Results />
          </Route>
          <Route path="/story/:quarter">
            <StoryPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/mainTab" />
          </Route>
        </IonRouterOutlet>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
