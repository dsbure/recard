import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from "@ionic/react";
import "./SigmaModes.css";
import { invertMode, logOut, shieldHalf, timer } from "ionicons/icons";
import ISigmaModes from "../interfaces/ISigmaModes";

export interface ISMBProps {
  sigmaFunction: () => void;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface ISMProps {
  className: string;
  skipFunction: () => void;
  immunityFunction: () => void;
  fiftyFiftyFunction: () => void;
  timeFreezeFunction: () => void;
  activeModes: ISigmaModes;
}

function SigmaModeButton({ sigmaFunction, name, icon, enabled }: ISMBProps) {
  return <div className={"sigma-modes-button " + (enabled ? "enabled" : "")}>
    <IonButton onClick={sigmaFunction}>
      <IonIcon icon={icon} slot="icon-only" />
    </IonButton>
    <span className="sigma-modes-name">{name}</span>
  </div>;
}

export default function SigmaModes({ className, skipFunction, immunityFunction, fiftyFiftyFunction, timeFreezeFunction, activeModes }: ISMProps) {
  return <IonCard className={"sigma-modes " + className}>
    <IonCardHeader className="sigma-modes-header">
      <IonCardTitle>
        <span>
          Sigma Modes
        </span>
      </IonCardTitle>
    </IonCardHeader>
    <IonCardContent className="sigma-modes-content">
      <SigmaModeButton sigmaFunction={skipFunction} name={"Skip"} icon={logOut} enabled={activeModes.skip}/>
      <SigmaModeButton sigmaFunction={immunityFunction} name={"Immmunity"} icon={shieldHalf} enabled={activeModes.immunity}/>
      <SigmaModeButton sigmaFunction={fiftyFiftyFunction} name={"50/50"} icon={invertMode} enabled={activeModes.fiftyFifty}/>
      <SigmaModeButton sigmaFunction={timeFreezeFunction} name={"Freeze"} icon={timer} enabled={activeModes.timeFreeze}/>
    </IonCardContent>
  </IonCard>;
}

