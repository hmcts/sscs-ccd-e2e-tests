import moment from 'moment';

export class Logger {
  public static log(o: object) {
    console.log(`${moment().toISOString()} - ${o}`);
  }
}
