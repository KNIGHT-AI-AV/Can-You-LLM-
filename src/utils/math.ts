// math.ts
export const QUANTIZATION_BITS = {
  "FP16": 16,
  "Q8_0": 8,
  "Q5_K_M": 5.1,
  "Q4_K_M": 4.5,
  "Q3_K_S": 3.1
};

export const OVERHEAD_FACTOR = 1.2; // 20% overhead

// M = P * (Q/8) * (1 + O)
// returns in GB
export function calculateModelMemory(parametersBillion: number, bits: number = 4.5): number {
  return parametersBillion * (bits / 8) * OVERHEAD_FACTOR;
}

// KV Cache = 2 * L * H * S * B
// S is total sequence length (context window)
// B is bytes per parameter (bits / 8)
// return in GB. H is hidden dimension, L is layers.
export function calculateKVCache(layers: number, hiddenDimension: number, contextLength: number): number {
  // Usually KV cache is stored in FP16 (2 bytes) even if weights are quantized, but we'll allow config.
  const bytesPerParam = 2; // Fixed to 2 bytes (FP16) as standard for KV Cache unless quantized cache is used
  const totalBytes = 2 * layers * hiddenDimension * contextLength * bytesPerParam;
  return totalBytes / (1024 * 1024 * 1024); // Convert to GB
}

export function calculateTotalMemory(parametersBillion: number, layers: number, hiddenDimension: number, contextLength: number, bits: number = 4.5): number {
  return calculateModelMemory(parametersBillion, bits) + calculateKVCache(layers, hiddenDimension, contextLength);
}

// Logarithmic scaling for faders
// Maps 0-100 linear slider value to exponential hardware values
export function linearToLog(value: number, min: number, max: number): number {
  if (value === 0) return min;
  if (value === 100) return max;
  const minLog = Math.log(min);
  const maxLog = Math.log(max);
  const scale = (maxLog - minLog) / 100;
  return Math.exp(minLog + scale * value);
}

export function logToLinear(value: number, min: number, max: number): number {
  if (value <= min) return 0;
  if (value >= max) return 100;
  const minLog = Math.log(min);
  const maxLog = Math.log(max);
  return ((Math.log(value) - minLog) / (maxLog - minLog)) * 100;
}
