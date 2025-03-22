import StorageService from "./StorageService";

export interface IFlashcardStorageCategory {
	category: string;
	currentId: number;
	starProgress: number;
	starTotal: number;
	isComplete: boolean;
}

export interface IFlashcardStorage {
	flashcardData: IFlashcardStorageCategory[];
};

const FlashcardStorageService = {
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

	async setCategoryData({ ...flashcardData }: IFlashcardStorageCategory) {
		let currentData: IFlashcardStorage["flashcardData"] = await StorageService.getItem("flashcardData") || [];
		if (currentData.length === 0) {
			StorageService.setItem("flashcardData", [flashcardData]);
		} else {
			let catRef = currentData.find(e => e.category === flashcardData.category);
			if (catRef) {
				Object.assign(catRef, flashcardData);
			} else {
				currentData.push(flashcardData);
			}
			StorageService.setItem("flashcardData", currentData);
		}
		this.notifySubscribers();
	},

	async getCategoryData(name: string) {
		const currentData: IFlashcardStorage["flashcardData"] = await StorageService.getItem("flashcardData") || [];
		let returnedCategory: IFlashcardStorageCategory | any = [];
		for (const e of currentData) {
			if (e.category == name) { 
				returnedCategory = e;
				break;
			}
		}
		
		return returnedCategory;
	},

	async getTotalFinished() {
		const currentData: IFlashcardStorage["flashcardData"] = await StorageService.getItem("flashcardData") || [];
		let total = 0;
		currentData.forEach(e => total += e.currentId + (e.starProgress / e.starTotal));
		return total;
	},

	async clearData() {
		StorageService.removeItem("flashcardData");
		this.notifySubscribers();
	}
};

export default FlashcardStorageService;
