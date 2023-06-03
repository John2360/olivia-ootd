export const randomNormalDistribution = (mean, stdDeviation) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Generate random uniform value (0,1)
    while (v === 0) v = Math.random(); // Generate random uniform value (0,1)
    const value = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return value * stdDeviation + mean;
  }
  
  export const randomInverseNormalDistribution = (value, mean, stdDeviation) => {
    const z = (value - mean) / stdDeviation;
    const erfinv = x => {
      const a1 =  0.254829592;
      const a2 = -0.284496736;
      const a3 =  1.421413741;
      const a4 = -1.453152027;
      const a5 =  1.061405429;
      const p  =  0.3275911;
  
      const sign = (x < 0) ? -1 : 1;
      x = Math.abs(x);
  
      const t = 1.0 / (1.0 + p * x);
      const y = ((((a5 * t + a4) * t) + a3) * t + a2) * t + a1;
  
      return sign * (1 - y * Math.exp(-x * x));
    };
  
    return erfinv(z) * stdDeviation + mean;
  }
  
  export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  }
  
  export const scale = (value, desiredRange) => {
    const [desiredMin, desiredMax] = desiredRange;
  
    // Map the value to the desired range
    const scaledValue = value * (desiredMax - desiredMin) + desiredMin;
  
    return scaledValue;
  }