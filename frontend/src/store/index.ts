import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import rawMaterialReducer from './rawMaterialSlice';
import productionReducer from './productionSlice';

export const store = configureStore({ //configures the applications central store
    
    reducer: {
        products: productReducer, //adds the product slice to the store
        rawMaterials: rawMaterialReducer,
        production: productionReducer
    },
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;