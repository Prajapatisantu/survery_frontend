import { createSlice } from "@reduxjs/toolkit";

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    surveys: [],
    currentSurvey: null,
  },
  reducers: {
    setSurveys: (state, action) => {
      state.surveys = action.payload;
    },
    setCurrentSurvey: (state, action) => {
      state.currentSurvey = action.payload;
    },
  },
});

export const { setSurveys, setCurrentSurvey } = surveySlice.actions;
export default surveySlice.reducer;
