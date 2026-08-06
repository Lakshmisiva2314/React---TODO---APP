import { configureStore } from "@reduxjs/toolkit";
import ShareSlicer from '../slicers/share-slicer';


export const store = configureStore({
    reducer: ShareSlicer
})