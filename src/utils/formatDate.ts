import {Duration, format} from 'date-fns';
import moment from 'moment';

import {executionDateFormat} from './strings';

export const timeStampToDate = (timeStamp: string) => {
  if (!timeStamp) {
    return '';
  }

  return moment(timeStamp).format('MM-DD-YYYY hh:mm:ss').toString();
};

export const formatExecutionDate = (date: Date, formatString = executionDateFormat) => {
  return format(date, formatString);
};

export const constructExecutedString = (duration: Duration, countToDisplay: number = 2) => {
  let finishString = '';
  let counter = 0;

  Object.entries(duration).forEach(([key, value]) => {
    /* Here we assume that Duration entity has a stable order of fields as said in their docs
      type Duration = {
        years?: number
        months?: number
        weeks?: number
        days?: number
        hours?: number
        minutes?: number
        seconds?: number
      }
    */
    if (value && counter < countToDisplay) {
      finishString += `${value}${key[0]} `;
      counter += 1;
    }
  });

  if (!finishString.length) {
    return '0s';
  }

  return finishString.trim();
};
