import { useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { StorySnake } from '../components/StorySnake';
import { IFlashcardCategory } from "./IFlashcardCategory";
import flashcardStorageService, { IFlashcardStorageCategory } from '../services/flashcardStorageService';
import { useEffect, useRef, useState } from 'react';
import { TopicHeader } from './TopicHeader';


export function TopicView(category: IFlashcardCategory) {
  const [categoryData, setCategoryData] = useState<IFlashcardStorageCategory>();

  useEffect(() => {
    const updateData = async () => {
      setTimeout(() => flashcardStorageService.getCategoryData(category.categoryName).then((e) => setCategoryData(e)), 0);
    };
    const unsubscribe = flashcardStorageService.subscribe(updateData);
    updateData();
    return () => { unsubscribe() };
  }, []);

  return <>
    <TopicHeader {...category} />
    <StorySnake category={category} categoryData={categoryData} />
  </>;
}
