import { create } from 'zustand';
import { calculateTotalMemory } from '../utils/math';
import modelsData from '../data/models.json';

export interface Model {
  id: string;
  name: string;
  creator: string;
  context_window: number;
  intelligence_index: number;
  parameters_billion: number;
  layers: number;
  hidden_dimension: number;
}

interface HardwareState {
  vram: number; // in GB
  ram: number; // in GB
  bandwidth: number; // in GB/s
  storage: number; // in GB
  storageSpeed: number; // in MB/s
  contextLength: number; // in tokens
  selectedModel: Model | null;
  models: Model[];
  
  setHardwareValue: (key: keyof HardwareState, value: number) => void;
  selectModel: (model: Model | null) => void;
}

export const useHardwareStore = create<HardwareState>((set) => ({
  vram: 24,
  ram: 64,
  bandwidth: 100,
  storage: 512,
  storageSpeed: 3000,
  selectedModel: null,
  models: modelsData as Model[],

  setHardwareValue: (key, value) => set((state) => {
    const updates: Partial<HardwareState> = { [key]: value };
    
    if (state.selectedModel) {
      const requiredMem = calculateTotalMemory(
        state.selectedModel.parameters_billion,
        state.selectedModel.layers,
        state.selectedModel.hidden_dimension,
        8192 // Fixed standard context
      );
      
      if (key === 'vram' && (value as number) < requiredMem) {
        updates.vram = requiredMem;
      }
    }

    return updates;
  }),

  selectModel: (model) => set((state) => {
    if (!model) return { selectedModel: null };
    
    const minVram = calculateTotalMemory(
      model.parameters_billion,
      model.layers,
      model.hidden_dimension,
      8192 // Fixed standard context
    );

    return {
      selectedModel: model,
      vram: Math.max(state.vram, minVram),
    };
  })
}));
