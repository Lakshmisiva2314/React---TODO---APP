import { createSlice } from "@reduxjs/toolkit";
import { persistSharedAppointments } from '../services/shared-appointments.js';

let initialState = {
    sharedAppointments: [],
    sharedAppointmentsCount: 0
}

const ShareSlicer = createSlice({
    name: 'share-slicer',
    initialState,
    reducers: {
         SetSharedAppointments:(state, action)=> {
            state.sharedAppointments = action.payload;
            state.sharedAppointmentsCount = action.payload.length;
            persistSharedAppointments(action.payload);
         },
         AddToShare:(state, action)=> {
            state.sharedAppointments = [...state.sharedAppointments, action.payload];
            state.sharedAppointmentsCount = state.sharedAppointments.length;
            persistSharedAppointments(state.sharedAppointments);
         }
    }
})
export const {SetSharedAppointments, AddToShare} = ShareSlicer.actions;
export default ShareSlicer.reducer;