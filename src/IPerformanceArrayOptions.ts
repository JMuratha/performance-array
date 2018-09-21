namespace PerformanceArray {
  export interface IPerformanceArrayIndexOptions {
    propertyNames: Array<string>
  }

  export interface IPerformanceArrayOptions {
    indices?: Array<IPerformanceArrayIndexOptions>;
  }
}