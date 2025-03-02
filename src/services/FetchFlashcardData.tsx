import { db } from '../firebase/firebase';
import { collection, getDocs, Firestore } from "firebase/firestore";
import StorageService from './StorageService';
import { IFlashcardTopic } from '../components/IFlashcardTopic';
import { IFlashcardData } from '../components/IFlashcardData';
import { IFlashcardCategory } from '../components/IFlashcardCategory';

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
    const categoriesCol = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesCol);

    const categoriesMapped = categoriesSnapshot.docs.map((categoryDoc) => {
      const categoryData = categoryDoc.data();
      return {
        categoryName: categoryData.categoryName,
        categoryDesc: categoryData.categoryDesc,
        index:        categoryData.index,
        topics:       [] as unknown as IFlashcardTopic[],
      } as IFlashcardCategory;
    })
    StorageService.setItem("cachedCategoryData", categoriesMapped).then(
      () => this.notifySubscribers()
    );
    
    const categories = await Promise.all(
      categoriesSnapshot.docs.map(async (categoryDoc) => {
        const categoryData = categoryDoc.data();

        const topicsCol = collection(db, "categories", categoryDoc.id, "topics")
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

    categories.sort((a, b) => a.index - b.index);

    console.log("Fetched data from Firestore");
    return { categories };
  },

  async getFlashcardData(forceFetch: boolean = false, useLocal: boolean = false) {
    if (useLocal) {
      console.log("Fetching local flashcard data");
      await new Promise(resolve => setTimeout(resolve, 5000));
      const flashcardData = await fetch("/flashcardData.json").then(e => e.json());
      const timestamp = Date.now();
      await StorageService.setItem("cachedFlashcardData", { flashcardData, timestamp });
      await StorageService.setItem("cachedCategoryData", flashcardData.categories).then(
        () => this.notifySubscribers()
      );
      await new Promise(resolve => setTimeout(resolve, 5000));
      return flashcardData;
    }

    let flashcardData = await StorageService.getItem("cachedFlashcardData");

    const fetchAndCacheData = async () => {
      const flashcardData = await this.fetchDataFromFirebase(db);
      const timestamp = Date.now();
      await StorageService.setItem("cachedFlashcardData", { flashcardData, timestamp });
      return { flashcardData, timestamp };
    };

    if (!flashcardData || forceFetch) {
      flashcardData = await fetchAndCacheData();
    } else {
      const currentTime = Date.now();
      const expirationTime = 1000 * 60 * 60 * 24; // 24 hours
      const dataExpired = currentTime - flashcardData.timestamp > expirationTime;
      if (dataExpired) {
        flashcardData = await fetchAndCacheData();
      }
    }
    return flashcardData.flashcardData;
  }
};

export default FetchFlashcardData;