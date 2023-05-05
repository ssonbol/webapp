export class Record {
    record = {};
    constructor() {
      this.record = {};
    }
    public has(key) {
      return key in this.record;
    }
    public set(key,value) {
      this.record[key] = value;
    }
    public get(key) {
      return this.record[key];
    }
    public delete(key) {
      if( this.has(key) ){
        delete this.record[key]
        return true;
      }
      return false;
    }
  }