import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonLabel, IonNote, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import './Onboarding.css';
import { arrowForward, body, checkmarkCircle, flag, glasses, personCircle, pin, star, timer } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import './MainTab.css';
import StorageService from '../services/StorageService';
import { ICharacters, IPlayerData } from '../interfaces/IPlayerData';
import { useThemeDetector } from '../hooks/useThemeDetector';



const enum AnimateState {
	FIRST_IN = "animate__backInUp",
	TO_IN = "animate__backInRight",
	VISIBLE = "",
	TO_OUT = "animate__backOutLeft",
};

const OBCard: React.FC<{ cardContent: JSX.Element }> = ({ cardContent }) => {
	const animDuration = 1000;
	const [currentCardContent, setCurrentCardContent] = useState(cardContent);
	const [currentState, setCurrentState] = useState<AnimateState>(AnimateState.FIRST_IN);
	useEffect(() => {
		if (currentState === AnimateState.FIRST_IN) {
			setTimeout(() => {
				setCurrentState(
					AnimateState.VISIBLE
				);
			}, animDuration);
		} else if (currentState === AnimateState.VISIBLE || currentState === AnimateState.TO_IN) {
			setCurrentState(
				AnimateState.TO_OUT
			);
			setTimeout(() => {
				setCurrentCardContent(cardContent);

				setCurrentState(
					AnimateState.TO_IN
				);
			}, animDuration);
		}
	}, [cardContent]);
	return (
		<IonCard className={"results-card animate__animated " + currentState}>
			{currentCardContent}
		</IonCard>
	);
}
// ice cream sandwich
interface ICSButton {
	name: string;
	imageSrc: string;
	desc: string;
	onClick: () => void
}

function CharacterSelectButton({ name, imageSrc, desc, onClick }: ICSButton) {
	return (
		<IonButton className="obutton" onClick={onClick}>
			<div className="ch-inner">
				<IonImg src={imageSrc} />
				<IonCardHeader>
					<IonCardTitle>{name}</IonCardTitle>
					<IonCardSubtitle>{desc}</IonCardSubtitle>
				</IonCardHeader>
			</div>
		</IonButton>
	);
}
const Onboarding: React.FC = () => {
	const theme = useThemeDetector();
	const welcome = <>
		<IonIcon icon="./favicon.svg" className="recall-oicon animate__animated animate__backInRight animate__slow" />
		<IonCardHeader>
			<IonCardTitle>
				Welcome to
				<br />
				<IonImg src={`./recall-wordmark-${theme}.svg`} alt="recall" className="animate__animated animate__backInDown" id="recall-onboarding" />
			</IonCardTitle>
			<IonCardSubtitle className="animate__animated animate__backInDown">[witty_tagline]</IonCardSubtitle>
		</IonCardHeader>
		<IonCardContent className="ocard">
			<IonButton className="obutton animate__animated animate__backInUp animate__slower" size="large" onClick={() => setCurrentPage(1)}>
				<IonIcon icon={arrowForward} slot="start" />
				Continue
			</IonButton>
		</IonCardContent>
	</>
	const input = useRef<HTMLIonInputElement>(null);
	const [name, setName] = useState("");
	const inputName = <>
		<IonCardHeader className="centered-header">
			<IonCardContent className="centered-icon">
				<IonIcon icon={personCircle} size="large" />
			</IonCardContent>
			<IonCardTitle>
				What's your name?
			</IonCardTitle>
			<IonCardSubtitle>The island awaits… but first, who are you?</IonCardSubtitle>
		</IonCardHeader>
		<IonCardContent className="ocard">
			<IonInput label="Name" labelPlacement="floating" fill="outline" placeholder="Enter your name" ref={input} clearInput={true} onIonInput={() => {
				setName(input.current?.value?.toString() ?? "");
			}}></IonInput>
			<IonButton className="obutton" id="osubmit" expand="block" onClick={() => {
				if (input.current?.value?.toString() == "" || input.current?.value?.toString() == undefined) {
					input.current?.setFocus();
					return;
				}
				setCurrentPage(2)
			}}>
				<IonIcon icon={arrowForward} slot="start" />
				Continue
			</IonButton>
		</IonCardContent>
	</>

	const [character, setCharacter] = useState<ICharacters>();

	const characterSelect = <>
		<IonCardHeader className="centered-header">
			<IonCardContent className="centered-icon">
				<IonIcon icon={body} size="large" />
			</IonCardContent>
			<IonCardTitle>
				Choose your character
			</IonCardTitle>
			<IonCardSubtitle>Meet your island counterpart and embark on a mission to save the Island World!</IonCardSubtitle>
		</IonCardHeader>
		<IonCardContent className="ocard">
			<div id="character-select">
				<CharacterSelectButton name="Rizz" imageSrc="./chars/a1-c.png" desc="Chill and confident. Always has a plan—probably." onClick={() => {
					setCharacter(ICharacters.Zed);
					StorageService.setItem("onboarded", true).then(() => {
						router.push("/story/Q1");
					});
				}}/>
				<CharacterSelectButton name="Lirili" imageSrc="./chars/a2-c.png" desc="Lively and curious. Talks fast, thinks faster." onClick={() => {
					setCharacter(ICharacters.Anne);
					StorageService.setItem("onboarded", true).then(() => {
						router.push("/story/Q1");
					});
				}}/>
				<CharacterSelectButton name="Trippi" imageSrc="./chars/a3-c.png" desc="Calm and quirky. Goes with the flow." onClick={() => {
					setCharacter(ICharacters.OWound);
					StorageService.setItem("onboarded", true).then(() => {
						router.push("/story/Q1");
					});
				}}/>
			</div>
		</IonCardContent>
	</>

	const [currentPage, setCurrentPage] = useState(0);
	const [pageContent, setPageContent] = useState(welcome);

	const order = [welcome, inputName, characterSelect];
	const router = useIonRouter();

	useEffect(() => {
		StorageService.setItem("onboarded", false);
	}, []);

	useEffect(() => {
		setPageContent(order[currentPage]);
	}, [currentPage]);
	useEffect(() => {
		StorageService.setItem("playerData", {
			name: name,
			character: character
		} as IPlayerData);
	}, [name, character]);

	return (
		<IonPage>
			<IonContent fullscreen>
				<div className="centered-container" id="onboarding-page" style={{ backgroundImage: `url(./onboarding.png)` }}>
					<OBCard cardContent={pageContent} />
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Onboarding;
