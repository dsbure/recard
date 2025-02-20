import StorageService from "./StorageService";

export interface IFlashcardStorageCategory {
	category: string;
	currentId: number;
	starProgress: number;
	starTotal: number;
}

export interface IFlashcardStorage {
	flashcardData: IFlashcardStorageCategory[];
};

const flashcardStorageService = {
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

	async clearData() {
		StorageService.removeItem("flashcardData");
	}
};

export default flashcardStorageService;
