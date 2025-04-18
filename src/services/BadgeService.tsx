import { IonRippleEffect } from "@ionic/react";
import EXPStorageService from "./EXPStorageService";
interface IBadgeData {
	name: string,
	imgSrc: string
}

const BadgeService = {
	subscribers: [] as Function[],

	constructor() {
		this.subscribers = [];
	},

	subscribe(callback: Function) {
		if (!this.subscribers.includes(callback)) this.subscribers.push(callback);
		return () => {
			this.subscribers = this.subscribers.filter((e) => e !== callback);
		};
	},

	notifySubscribers() {
		this.subscribers.forEach((callback) => callback());
	},

	async getAllBadges(): Promise<{ elements: JSX.Element; length: number; }> {
		const expData = await EXPStorageService.getExperienceData();
		const currentBadges: IBadgeData[] = []
		for (let i = 1; i <= Math.min(expData.currentLevel, 15); i++) {
			currentBadges.push({
				name: EXPStorageService.getLevelName(i).replace(` ${i}`, ""),
				imgSrc: `./levels/${Math.min(i, 15)}.gif`
			});
		}
		const badgeElements = <>
			{currentBadges.map((e, i) => {
				return (
					<div key={i} className="badge ion-activatable ripple-parent">
						<IonRippleEffect></IonRippleEffect>
						<img src={e.imgSrc} />
						{e.name}
					</div>)
			})}
		</>
		return { elements: badgeElements, length: currentBadges.length };
	}
};

export default BadgeService;
