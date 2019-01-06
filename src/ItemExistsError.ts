namespace PerformanceArray{
  export class ItemExistsError<T> extends Error {
    public item: T;
    
    constructor(item: T) {
      super('The item has already been added');
      this.item = item;
    } 
  } 
} 