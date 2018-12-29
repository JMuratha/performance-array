namespace PerformanceArray {
  export class Utils {
    /**
     * if the value is null or undefined, null is returned, else the value is returned
     */
    static normalizeUndefined(value: any): any {
      return value != null ? value : null;
    }
  }
}