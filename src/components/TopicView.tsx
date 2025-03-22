import { useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { StorySnake } from '../components/StorySnake';
import { IFlashcardCategory } from "../interfaces/IFlashcardCategory";
import FlashcardStorageService, { IFlashcardStorageCategory } from '../services/FlashcardStorageService';
import { useEffect, useRef, useState } from 'react';
import { TopicHeader } from './TopicHeader';
import './TopicHeader.css';


export function TopicView(category: IFlashcardCategory) {
  const [categoryData, setCategoryData] = useState<IFlashcardStorageCategory>();

  useEffect(() => {
    const updateData = async () => {
      setTimeout(() => FlashcardStorageService.getCategoryData(category.categoryName).then((e) => setCategoryData(e)), 0);
    };
    const unsubscribe = FlashcardStorageService.subscribe(updateData);
    updateData();
    return () => { unsubscribe() };
  }, []);

  return <>
    <TopicHeader {...category} />
    <StorySnake category={category} categoryData={categoryData} />
  </>;
}
