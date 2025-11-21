import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define what the state looks like

interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    watchHistory: string[];
}

interface AuthState {
    status: boolean;
    userData: null | User; 
}


// 2. Set the initial state (User is not logged in)
const initialState: AuthState = {
    status: false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Actions: Functions to change the state
        login: (state, action: PayloadAction<User>) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
});

// Export the actions so components can use them
export const { login, logout } = authSlice.actions;

// Export the reducer to be used in the Store
export default authSlice.reducer;