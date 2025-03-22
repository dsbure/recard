import { db } from '../firebase/firebase';
import { collection, getDocs, Firestore } from "firebase/firestore";
import StorageService from './StorageService';
import { IFlashcardTopic } from '../interfaces/IFlashcardTopic';
import { IFlashcardData } from '../interfaces/IFlashcardData';
import { IFlashcardCategory } from '../interfaces/IFlashcardCategory';

const FetchFlashcardData = {
  subscribers: [] as Function[],
  currentCategoryData: {} as IFlashcardCategory[],

  constructor() {
    this.subscribers = [];
  },

  subscribe(callback: Function) { // to updates to cached category data, too lazy to change it
		if (!this.subscribers.includes(callback)) this.subscribers.push(callback);
		return () => {
			this.subscribers = this.subscribers.filter((e) => e !== callback);
		};
	},

	notifySubscribers() {
		this.subscribers.forEach((callback) => callback());
	},

  async fetchDataFromFirebase(db: Firestore) {
    let categoriesCol;
    try {
      categoriesCol = collection(db, "categories");
    } catch (e) {
      console.log(`error fetching categories from firebase: ${e}`);
      return;
    }
    const categoriesSnapshot = await getDocs(categoriesCol);

    const categoriesMapped = categoriesSnapshot.docs.map((categoryDoc) => {
      const categoryData = categoryDoc.data();
      return {
        categoryName: categoryData.categoryName,
        categoryDesc: categoryData.categoryDesc,
        index:        categoryData.index,
        topics:       [] as unknown as IFlashcardTopic[],
      } as IFlashcardCategory;
    }).sort((a, b) => a.index - b.index);
    StorageService.setItem("cachedCategoryData", categoriesMapped).then(
      () => this.notifySubscribers()
    );
    let throwaway = false;
    const categories = await Promise.all(
      categoriesSnapshot.docs.map(async (categoryDoc) => {
        const categoryData = categoryDoc.data();

        let topicsCol;
        try {
          topicsCol = collection(db, "categories", categoryDoc.id, "topics");
        } catch (e) {
          throwaway = true;
          console.log(`error fetching topics from firebase: ${e}`);
          return;
        }
        const topicsSnapshot = await getDocs(topicsCol);

        const topics = await Promise.all(
          topicsSnapshot.docs.map(async (topicDoc) => {
            const topicData = topicDoc.data();
            const topic: IFlashcardTopic = {
              id:           topicData.id,
                            ...topicData,
              flashcards:   [] as unknown as IFlashcardTopic["flashcards"],
              topicName:    topicData.topicName || "",
              categoryName: categoryData.categoryName || "",
              repeatTotal:  topicData.repeatTotal || 3,
            };

            const flashcardsCol = collection(db, "categories", categoryDoc.id, "topics", topicDoc.id, "flashcards");
            const flashcardsSnapshot = await getDocs(flashcardsCol);

            topic.flashcards = flashcardsSnapshot.docs.map((flashcardDoc) => {
              const flashcardData = flashcardDoc.data();
              return {
                question:     flashcardData.question,
                type:         flashcardData.type,
                interaction:  flashcardData.interaction,
              };
            }) as IFlashcardTopic["flashcards"];

            return topic;
          })
        );
        topics.sort((a, b) => a.id - b.id);

        return {
          categoryName: categoryData.categoryName,
          categoryDesc: categoryData.categoryDesc,
          index:        categoryData.index,
          topics,
        } as IFlashcardCategory;
      })
    );
    if (throwaway) return;

    categories.sort((a, b) => a!.index - b!.index);

    console.log("Fetched data from Firestore");
    return { categories };
  },

  async getFlashcardData(forceFetch: boolean = false, useLocal: boolean = false): Promise<IFlashcardData> {
    const getLocalFlashcardData = async () => {
      console.log("Fetching local flashcard data");
      await new Promise(resolve => setTimeout(resolve, 1000));
      const flashcardData = await fetch("/flashcardData.json").then(e => e.json());
      const timestamp = Date.now();
      await StorageService.setItem("cachedFlashcardData", { flashcardData, timestamp });
      await StorageService.setItem("cachedCategoryData", flashcardData.categories).then(
        () => this.notifySubscribers()
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
      return flashcardData;
    }

    if (useLocal) {
      return await getLocalFlashcardData();
    }

    let flashcardData: { flashcardData: IFlashcardData, timestamp: number } = await StorageService.getItem("cachedFlashcardData");
    let categoryData = await StorageService.getItem("cachedCategoryData");
    const fetchAndCacheData = async () => {
      const fetchedFlashcardData = await this.fetchDataFromFirebase(db);
      const timestamp = Date.now();
      if (!fetchedFlashcardData) {
        if (!flashcardData) {
          console.log("fetching from localstorage");
          const localFlashcardData = await getLocalFlashcardData();
          return { flashcardData: localFlashcardData, timestamp };
        } else {
          return { flashcardData, timestamp };
        }
      };
      await StorageService.setItem("cachedFlashcardData", { flashcardData: fetchedFlashcardData, timestamp });
      return { flashcardData: fetchedFlashcardData, timestamp };
    };

    if ((!flashcardData || !categoryData) || forceFetch) {
      flashcardData = await fetchAndCacheData();
    } else {
      const currentTime = Date.now();
      const expirationTime = 1000 * 60 * 60 * 24; // 24 hours
      const dataExpired = currentTime - flashcardData.timestamp > expirationTime;
      if (dataExpired) {
        flashcardData = await fetchAndCacheData();
      }
      this.notifySubscribers();
    }
    
    return flashcardData.flashcardData;
  },
  
  async getTotalTopics() {
    let flashcardData: { flashcardData: IFlashcardData, timestamp: number } = await StorageService.getItem("cachedFlashcardData");
    let topics = 0;
    flashcardData.flashcardData.categories.forEach(c => topics += c.topics.length);
    return topics;
  },

  // debug
  async getCategoryTotal(category: string) {
    let flashcardData: { flashcardData: IFlashcardData, timestamp: number } = await StorageService.getItem("cachedFlashcardData");
    const categoryData = flashcardData.flashcardData.categories.find(c => c.categoryName === category);
    return categoryData?.topics.length || 0;
  },

  async clearCachedData() {
    await StorageService.removeItem("cachedFlashcardData");
    await StorageService.removeItem("cachedCategoryData");
  }
};

export default FetchFlashcardData;