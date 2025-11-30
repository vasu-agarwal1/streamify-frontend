import { createSlice } from "@reduxjs/toolkit";

interface UiState {
    sidebarOpen: boolean;
}

const initialState: UiState = {
    sidebarOpen: true // Default: Open on desktop
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        closeSidebar: (state) => {
            state.sidebarOpen = false;
        },
        openSidebar: (state) => {
            state.sidebarOpen = true;
        }
    }
});

export const { toggleSidebar, closeSidebar, openSidebar } = uiSlice.actions;
export default uiSlice.reducer;