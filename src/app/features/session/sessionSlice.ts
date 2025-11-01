import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Recipe} from "../recipes/types";

export type RecipeSession={
    currentStepIndex:number;
    isRunning:boolean;
    stepRemainingSec:number;
    overallRemainingSec:number;
    lastTickTs?:number;
}

export interface SessionState{
    activeRecipeId:string|null;
    byRecipeId:Record<string, RecipeSession>;
}
const initialState:SessionState={
    activeRecipeId:null,
    byRecipeId:{},
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{ recipe: Recipe }>) => {
      const { recipe } = action.payload;
      if (state.activeRecipeId && state.activeRecipeId !== recipe.id) return; 
      const totalSec = recipe.steps.reduce((sum, s) => sum + s.durationMinutes * 60, 0);
      state.activeRecipeId = recipe.id;
      state.byRecipeId[recipe.id] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec: recipe.steps[0].durationMinutes * 60,
        overallRemainingSec: totalSec,
        lastTickTs: Date.now(),
      };
    },
    pauseSession: (state) => {
      const activeId = state.activeRecipeId;
      if (!activeId) return;
      const sess = state.byRecipeId[activeId];
      sess.isRunning = false;
      sess.lastTickTs = undefined;
    },
    resumeSession: (state) => {
      const activeId = state.activeRecipeId;
      if (!activeId) return;
      const sess = state.byRecipeId[activeId];
      sess.isRunning = true;
      sess.lastTickTs = Date.now();
    },
    tick: (state, action: PayloadAction<{ recipe: Recipe }>) => {
      const { recipe } = action.payload;
      const id = state.activeRecipeId;
      if (!id) return;
      const sess = state.byRecipeId[id];
      if (!sess.isRunning || sess.stepRemainingSec <= 0) return;

      const now = Date.now();
      const deltaSec = Math.floor((now - (sess.lastTickTs || now)) / 1000);
      if (deltaSec <= 0) return;
      sess.lastTickTs = now;

      sess.stepRemainingSec -= deltaSec;
      sess.overallRemainingSec -= deltaSec;

      // Step complete
      if (sess.stepRemainingSec <= 0) {
        const nextIndex = sess.currentStepIndex + 1;
        if (nextIndex < recipe.steps.length) {
          sess.currentStepIndex = nextIndex;
          sess.stepRemainingSec = recipe.steps[nextIndex].durationMinutes * 60;
        } else {
          // End session
          state.activeRecipeId = null;
          delete state.byRecipeId[id];
        }
      }
    },
    stopStep: (state, action: PayloadAction<{ recipe: Recipe }>) => {
      const { recipe } = action.payload;
      const id = state.activeRecipeId;
      if (!id) return;
      const sess = state.byRecipeId[id];
      const nextIndex = sess.currentStepIndex + 1;
      if (nextIndex < recipe.steps.length) {
        sess.currentStepIndex = nextIndex;
        sess.stepRemainingSec = recipe.steps[nextIndex].durationMinutes * 60;
        sess.lastTickTs = Date.now();
      } else {
        // Last step ends session
        state.activeRecipeId = null;
        delete state.byRecipeId[id];
      }
    },
  },
});

export const { startSession, pauseSession, resumeSession, tick, stopStep } = sessionSlice.actions;
export default sessionSlice.reducer;