import $ from 'jquery';

function combineSameMonths(input) {
  const multipleMonths = /(((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s[0-9]{2})\s([0-9]{2}:[0-9]{2}|off)[:,;]\s)(((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s[0-9]{2})\s([0-9]{2}:[0-9]{2}|off))/g;
  let combinedMonths = input + '';
  combinedMonths = combinedMonths.replace(multipleMonths, (_1, _2, _3, _4, _5, _6, _7, _8, _9) => {
    let result = '';
    if (_4 === _8 && _5 === _9) {
      result = `${_3}: ${_7}: ${_9}`;
    } else {
      result = _1;
    }
    return result;
  });
  combinedMonths = combinedMonths.replace(/((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s[0-9]{2}),([0-9]{2}:[0-9]{2})/g, (_1, _2, _3, _4) => `${_2}: ${_4}`);
  combinedMonths = combinedMonths.replace(/((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s[0-9]{2}),?\s/g, _1 => `${_1}: `);
  combinedMonths = combinedMonths.replace(/\s:\s/g, ': ');
  combinedMonths = combinedMonths.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s([0-9]{2}):\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s([0-9]{2})/g, (_1, _2, _3, _4, _5) => {
    let result = '';
    if (_2 === _4) {
      result = `${_2} ${_3},${_5}`;
    } else {
      result = `${_2} ${_3},${_4} ${_5}`;
    }
    return result;
  });
  return combinedMonths;
}

function removeAdditionalZeroesFromMonths(input) {
  let output = input + '';
  const detectDayBeforeMonth = /;\s([0-9]{2}):[0-9]{2}\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g;
  if (output.match(detectDayBeforeMonth)) {
    output = output.replace(detectDayBeforeMonth, (_1, _2, _3) => `; ${_2} ${_3}`);
  } else {
    output = output.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s[0-2][0-9]:00/g, (_1) => {
      let result = '';
      const temp = moment(_1, 'MMM DD:00');
      if (temp.isValid()) {
        result = temp.format('MMM DD');
      } else {
        result = _1;
      }
      return result;
    });
  }
  return output;
}

function correctSyntaxBetweenMonthAndDay(input) {
  let output = input + '';
  const missingDoublePoint = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s[0-3][0-1])[,\s]([0-2][0-9]:[0-5][0-9])/g;
  output = output.toString().replace(missingDoublePoint, (_1, _2, _3, _4) => `${_2}: ${_4}`);
  return output;
}

function removeYearFromMonth(input) {
  let output = input + '';
  output = output.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(\s[2-9][0-9][0-9][0-9])/g, (_1) => {
    const temp = moment(_1, 'MMM YYYY');
    return temp.format('MMM');
  });
  return output;
}

// Transforms Mo-Fr 08:0-16:00; We 18:00-22:00; into Mo-Fr 08:00-16:00, We 18:00-22:00;
function handleAdditiveTime(input) {
  let output = input + '';
  const findTimeAndDays = new RegExp('(Mo|Tu|We|Th|Fr|Sa|Su)-(Mo|Tu|We|Th|Fr|Sa|Su)\\s' +
    '([01][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9])-([01][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9]);\\s' +
    '((Mo|Tu|We|Th|Fr|Sa|Su)\\s([01][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9])-([01][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9]);?\\s?)+', 'g');
  output = output.toString().replace(findTimeAndDays, (_1) => {
    const timeWithDayRange = /(Mo|Tu|We|Th|Fr|Sa|Su)-(Mo|Tu|We|Th|Fr|Sa|Su)\s(([01][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9])-([01][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9]))/g;
    const timeWithSingleDay = /(Mo|Tu|We|Th|Fr|Sa|Su)\s(([01][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9])-([01][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9]))/g;
    const week = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const trial = _1;
    const dayAndTime = trial.match(timeWithSingleDay);
    const dayRangAndTime = trial.match(timeWithDayRange);
    const startDay = `${dayRangAndTime.toString()[0]}${dayRangAndTime.toString()[1]}`;// dayRangAndTime.toString()[0] + dayRangAndTime.toString()[1];
    const endDay = `${dayRangAndTime.toString()[3]}${dayRangAndTime.toString()[4]}`;// dayRangAndTime.toString()[3] + dayRangAndTime.toString()[4];
    const startDayIndex = week.indexOf(startDay);
    const endDayIndex = week.indexOf(endDay);
    let result = dayRangAndTime.toString();
    const daysAndTimeOutsideRange = [];
    for (let a = 1; a < dayAndTime.length; a = a+1) {
      const singleDayIndex = week.indexOf(dayAndTime[a].toString()[0]
        + dayAndTime[a].toString()[1]);
      if (startDayIndex < singleDayIndex && endDayIndex > singleDayIndex) {
        result = `${result}, ${dayAndTime[a]}`;
      } else {
        daysAndTimeOutsideRange.push(dayAndTime[a].toString());
      }
    }
    if (daysAndTimeOutsideRange) {
      for (let b = 0; b < daysAndTimeOutsideRange.length; b = b+1) {
        result = `${result}; ${daysAndTimeOutsideRange[b]}`;
      }
    }
    result = `${result}; `;
    return result;
  });
  output = output.toString().replace(/;\s$/g, '');
  return output;
}

function replaceComma(input) {
  let output = input + '';
  const regexArray = [/Mo,Tu/g, /Tu,We/g, /We,Th/g, /Th,Fr/g, /Fr,Sa/g, /Sa,Su/g];
  const replacementArray = ['Mo-Tu', 'Tu-We', 'We-Th', 'Th-Fr', 'Fr-Sa', 'Sa-Su'];
  for (let a = 0; a < regexArray.length; a = a+1) {
    output = output.replace(regexArray[a], replacementArray[a]);
  }
  return output;
}

// Transforms Jan-Feb: Mo 10:00-18:00; Tu 09:00-17:00;
// into Jan-Feb: Mo 10:00-18:00; Jan-Feb: Tu 09:00-17:00;
function addMonthsToEveryDays(input) {
  let output = input + '';
  if (output.toString().match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/g)) {
    const separateMonths = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).*?)(\s\s|$)/g;
    const detectsDays = /;\s(Mo|Tu|We|Th|Fr|Sa|Su|PH)/g;
    const detectsMonths = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).*?:/g;
    output = output.replace(/;\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g, (_1, _2) => `; ${_2}`).trim();
    output = output.replace(separateMonths, (_1) => {
      const months = _1.match(detectsMonths);
      return _1.replace(detectsDays, (_a, _2) => `; ${months} ${_2}`);
    });
    output = output.replace(/\s+/g, ' ');
    output = output.replace(/:\sPH/g, ' PH');
  }
  return output;
}

function handleNumeralDates(input) {
  let output = input + '';
  // only catches months like this 31.12 if dd > 24 catches all dates like this 24.12.
  const datesWithoutYear = /([0-3][0-9]\.[0-3][0-9]\.)(-|\s|,|:)/g;
  const datesWithoutSecondDot = /([2][5-9]\.[01][0-9]|[3][01]\.[01][0-9])(-|\s|,|:)/g;
  output = output.replace(datesWithoutYear, (_1, _2, _3) => {
    const temp = moment(_2, ['D.M.', 'DD.M.', 'D.MM.', 'DD.MM.']);
    return `${temp.format('DD.MM.')}20:19${_3}`;
  });
  output = output.replace(datesWithoutSecondDot, (_1, _2) => `${_2}.`);
  output = output.replace(/([0-2]?[0-9]\.|3[01]\.)(0?[0-9]\.|1[0-2]\.)(([0-9]{2}:)?[0-9]{2})?/g, (_1, _2, _3) => {
    const temp = moment(_2 + _3, ['D.M.', 'DD.M.', 'D.MM.', 'DD.MM.']);
    return temp.format('MMM DD:');
  });
  return output;
}

function replaceSymbols(input) {
  let output = input + '';
  output = output.replace(/[–]/g, '-');
  output = output.replace(/\s*?\|\s*?|&/g, ', ');
  output = output.replace(/\./g, ':');
  output = output.replace(/:\B/g, '');
  return output;
}

function addDoublePoint(input) {
  return input.toString().replace(/([2][0-4]|[0-1]?[0-9])([0-5][0-9])/g, (_1, _2, _3) => `${_2}:${_3}`);
}

function addMissingZeros(input) {
  let output = input + '';
  const noMinutes = /(\s|-)([0-1]?[0-9]|2[0-4])(\s|-|$|,|\+)/g;
  const noSecondHourSyntax = /(,|\s|-)([0-9]:)/g;
  output = ` ${output}`;
  for (let a = 0; a < 2; a = a +1) {
    output = output.toString().replace(noMinutes, (_1, _2, _3, _4) => `${_2} ${_3}:00${_4}`);
  }
  output = output.toString().replace(noSecondHourSyntax, (_1, _2, _3) => `${_2}0${_3}`);
  return output.trim();
}

function cutOverlappingTime(input) {
  let output = input + '';
  const timesWithoutEnd = /([0-2][0-9]:[0-5][0-9]\+)/g;
  const hoursPlusMinutes = /[0-5][0-9]/g;
  const newTimesTest = /(([0-2][0-9]:[0-5][0-9])[-,;])/g;
  if (output.match(/,/g)) {
    const timesList = output.match(newTimesTest);
    const listTimesWithoutEnd = output.match(timesWithoutEnd);
    // produces an array that turns for example 18:00-23:00 into [18,00,23,00]
    const hoursAndMinutes = timesList.join(' ').match(hoursPlusMinutes);
    if (timesList.length % 2 === 0) {
      let startTimes = [];
      let endTimes = [];
      for (let a = 0; a < hoursAndMinutes.length; a = a+1) {
        if (startTimes.length === endTimes.length) {
          startTimes.push(parseInt(hoursAndMinutes[a] + hoursAndMinutes[a + 1], 10));
          a += 1;
        } else {
          endTimes.push(parseInt(hoursAndMinutes[a] + hoursAndMinutes[a + 1], 10));
          a += 1;
        }
      }
      let timesNoEnd = [];
      if (listTimesWithoutEnd) {
        const noEndHoursAndMinutes = listTimesWithoutEnd.join(' ').match(hoursPlusMinutes);
        for (let b = 0; b < noEndHoursAndMinutes.length; b = b+1) {
          timesNoEnd.push(parseInt(noEndHoursAndMinutes[b] + noEndHoursAndMinutes[b + 1], 10));
          b += 1;
        }
      }
      for (let c = 0; c < startTimes.length; c = c+1) {
        let cNextDay = 0;
        let dNextDay = 0;
        for (let d = c + 1; d < startTimes.length; d = d+1) {
          cNextDay = 0;
          dNextDay = 0;
          if (startTimes[d] > endTimes[d]) {
            dNextDay = 2400;
          }
          if (startTimes[c] > endTimes[c]) {
            cNextDay = 2400;
          }
          if (startTimes[c] >= startTimes[d] &&
            endTimes[c] + cNextDay <= endTimes[d] + dNextDay) {
            delete startTimes[c];
            delete endTimes[c];
          } else if (startTimes[c] < startTimes[d] &&
            endTimes[c] + cNextDay > endTimes[d] + dNextDay) {
            delete startTimes[d];
            delete endTimes[d];
          }
        }
        if (timesNoEnd) {
          for (let e = 0; e < timesNoEnd.length; e = e+1) {
            cNextDay = 0;
            if (startTimes[c] > endTimes[c]) {
              cNextDay = 2400;
            }
            if (startTimes[c] <= timesNoEnd[e] && endTimes[c] + cNextDay > timesNoEnd[e]) {
              delete timesNoEnd[e];
            }
          }
        }
      }
      timesNoEnd = timesNoEnd.filter(el => el != null);
      startTimes = startTimes.filter(el => el != null);
      endTimes = endTimes.filter(el => el != null);
      let result = '';
      for (let f = 0; f < startTimes.length; f = f+1) {
        if (f > 0) {
          result = `${result},`;
        }
        result = `${result}${addDoublePoint(startTimes[f].toString())}-${addDoublePoint(endTimes[f].toString())}`;
      }
      if (timesNoEnd) {
        for (let g = 0; g < timesNoEnd.length; g = g+1) {
          result = `${result},${addDoublePoint(timesNoEnd[g].toString())}+`;
        }
      }
      result = `${result};`;
      output = result;
      output = addMissingZeros(output);
    }
  }
  return output;
}

function correctMonthDays(input) {
  let output = input + '';
  const monthdayWrongSyntax = /([0-1][0-9]|[2][0-4]):00\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g;
  output = output.replace(monthdayWrongSyntax, (_1, _2, _3) => `${_2} ${_3}`);
  return output;
}

function switchDayAndMonthPosition(input) {
  let output = input + '';
  const dayMonthPositionWrong = /([1-2][0-9]|[3][0-1]|[0]?[1-9])\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g;
  output = output.replace(dayMonthPositionWrong, (_1, _2, _3) => `${_3} ${_2}`);
  return output;
}

function removeWrongDoublepoints(input) {
  let output = input + '';
  const doublePointsInMonths = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec):\s([0][1-9]|[1-2][0-9]|[3][0-1]|[1-9])(:00)?/g;
  output = output.replace(doublePointsInMonths, (_1, _2, _3) => `${_2} ${_3}`);
  return output;
}

function addMissingZeroesDays(input) {
  let output = input + '';
  const missingZeroDays = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s([1-9])([-:;])/g;
  output = output.replace(missingZeroDays, (_1, _2, _3, _4) => `${_2} 0${_3}${_4}`);
  return output;
}

function monthRagneEndCorrection(input) {
  let output = input + '';
  const detectWrongEnd = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s([0-2][0-9]|[3][0-1]);/g;
  output = output.replace(detectWrongEnd, (_1, _2, _3) => `${_2} ${_3}:`);
  output = output.replace(/:;/g, ':');
  return output;
}

function monthsAddSpace(input) {
  let output = input + '';
  output = output.replace(/;(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g, (_1, _2) => `; ${_2}`);
  return output;
}

function multipleSpecificDatesFunction(input) {
  let output = input + '';
  const months = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g;
  const days = /([0][1-9]|[1-2][0-9]|[3][01])/g;
  const listMonths = output.match(months);
  const listDays = output.match(days);
  output = '';
  output = `${output}${listMonths[0].toString()} ${listDays[0].toString()}`;
  for (let a = 1; a < listMonths.length; a = a+1) {
    if (listMonths[a - 1].toString() === listMonths[a].toString()) {
      output = `${output},${listDays[a].toString()}`;
    } else {
      output = `${output},${listMonths[a].toString()} ${listDays[a]}`;
    }
  }
  output = `${output}:`;
  return output;
}

function separateMonthsAndDays(input) {
  let output = input + '';
  const separatedByComma = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s[0-3][0-9]),(Mo|Tu|We|Th|Fr|Sa|Su|PH)/g;
  output = output.replace(separatedByComma, (_1, _2, _3, _4) => `${_2}: ${_4}`);
  return output;
}

// turns May 01-May 30 into May 01-30
function pullMonthsTogether(input) {
  let output = input + '';
  const monthCombination = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s([0-3][0-9])([-,])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s([0-3][0-9])/g;
  output = output.replace(monthCombination, (_1, _2, _3, _4, _5, _6) => {
    if (_2 === _5) {
      return `${_2} ${_3}${_4}${_6}`;
    }
    return _1;
  });
  return output;
}

function orderDaysAndTime(input) {
  let output = input + '';
  const dayRangeFinder = /(Mo|Tu|We|Th|Fr|Sa|Su|PH)([-|,])?(Mo|Tu|We|Th|Fr|Sa|Su|PH)?(,Mo|,Tu|,We|,Th|,Fr|,Sa|,Su|,PH)*/g;
  const timeRangeFinder = /[0-2].*?;/g;
  if (output.endsWith(output.match(/(Mo$|Tu$|We$|Th$|Fr$|Sa$|Su$|PH$)/g))) {
    const dayRange = output.match(dayRangeFinder);
    const timeRange = output.match(timeRangeFinder);
    let resultString = '';
    if (dayRange.length === timeRange.length) {
      for (let a = 0; a < dayRange.length; a = a+1) {
        resultString = `${resultString}${dayRange[a]} ${timeRange[a]}`;
      }
      output = `${resultString.slice(0, resultString.length - 2)}`;
    }
  }
  return output;
}

function detectNewDay(input) {
  let output = input + '';
  const newDay = /(([0-1]?[0-9]|[2][0-4]):[0-5][0-9]|off)\s*(Mo|T[hu]|We|Fr|Sa|Su|PH)/g;
  output = (output.toString().replace(newDay, (_1, _2, _3, _4) => `${_2}; ${_4}`));
  return output.replace(/off\s/g, 'off;');
}

function cleanUp(input) {
  let output = input + '';
  // removes ; from the end of the string
  if (output.endsWith(';')) {
    output = `${output.slice(0, output.length - 1)}`;
  }
  // removes comma between Days and time like this Mo, 10:00 to Mo 10:00
  output = output.replace(/(Mo|T[hu]|We|Fr|Sa|Su|PH),(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])/g, (_1, _2, _3) => `${_2} ${_3}`);
  // changes times like 17:00-00:00 to 17:00-24:00 as is convention
  output = output.replace(/-00:00/g, '-24:00');
  output = output.replace(/24:00-/g, '00:00-');
  output = output.replace(/Mo-Su 00:00-24:00/g, '24/7');
  output = output.replace(/\s;\s?/g, '; ');
  output = output.replace(/([0-9])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec)/g, (_1, _2, _3) => `${_2}; ${_3}`);
  output = output.replace(/([0-5][0-9])\s(Mo|Tu|We|Th|Fr|Sa|Su|PH)/g, (_1, _2, _3) => `${_2}; ${_3}`);
  output = detectNewDay(output);
  return output;
}

// Formats like this Mo 12:00-17:00, Tu 12:00-17:00 turn int Mo,Tu 12:00-17:00
function combineDaysWithSameTimes(input) {
  let output = input + '';
  // A regex that detects days and the corresponding times
  const daysAndTime = new RegExp('\\s\\b(Mo|T[hu]|We|Fr|S[au]|PH)\\b\\s?' +
    '((([0-1]?[0-9]|[2][0-4]):[0-5][0-9])\\s?([-]|[+])\\s?(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])?' +
    '(,(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])-(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])|,(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])\\+)?);?', 'g');
  // in the case of when the input looks like this Sa 09:00-15:00;
  // Su 09:00-14:00; 01:00 the 01:00 is part of the date for the next month range
  const endWithMonthDate = /(;\s([0-1][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9]))\s$/g;
  let monthDate = '';
  if (output.match(endWithMonthDate)) {
    monthDate = output.match(endWithMonthDate).toString();
    monthDate = monthDate.replace(endWithMonthDate, (_1, _2, _3) => _3);
    output = output.replace(endWithMonthDate, ' ');
  }
  const intermediate = ` ${output}`;
  const matchingDays = intermediate.match(daysAndTime);
  const splittDaysAndTime = [];
  if (matchingDays) {
    for (let a = 0; a < matchingDays.length; a = a+1) {
      splittDaysAndTime.push(daysAndTime.exec(intermediate));
    }
    let combinedTimes = [];
    let checkTime = '';
    let result = '';
    for (let a = 0; a < splittDaysAndTime.length; a = a + 1) {
      if (combinedTimes.length === 0) {
        const [, combinedTime, _checkTime] = splittDaysAndTime[a];
        combinedTimes.push(combinedTime);
        checkTime = _checkTime;
      } else if (checkTime === splittDaysAndTime[a][2]) {
        combinedTimes.push(splittDaysAndTime[a][1]);
      } else {
        result = `${result}${combinedTimes} ${checkTime}; `;
        combinedTimes = [];
        a -= 1;
      }
    }
    result = `${result}${combinedTimes} ${checkTime}; `;
    output = intermediate.toString().replace(daysAndTime, '');
    // input = input + ' ' + result;
    output = `${result} ${output}`;
    output = detectNewDay(output);
  } else {
    output = `${output};`;
  }
  output = `${output.trim()} ${monthDate}`;
  output = output.replace(/\s?,\s?/g, ',');
  return output.trim();
}

// Groups days that share the same times, without taking those in other month ranges into account
function handelMonthDays(input) {
  let output = input + '';
  const dayMonthSeparation = /([0-1][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9]),(([0-1][0-9]:[0-5][0-9]|[2][0-4]:[0-5][0-9])\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))/g;
  output = output.replace(dayMonthSeparation, (_1, _2, _3) => `${_2}; ${_3}`);
  output = output.replace(/off;/g, 'off');
  if (output.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec)\s/g)) {
    output = `${output} `;
    output = output.toString().replace(/(Mo|Tu|We|Th|Fr|Sa|Su|PH).+?([0-9]|f)\s/g, _1 => `${combineDaysWithSameTimes(_1)} `);
    output = `${output.replace(/\\s;/g, '; ')}`;
  } else {
    output = combineDaysWithSameTimes(output);
  }
  output = output.replace(/off\s/g, 'off;');
  output = output.replace(/;([^\s])/g, (_1, _2) => `; ${_2}`);
  return output;
}

// sorts days by order of Mo to Su with PH coming at the end
function sortDays(input) {
  let output = input + '';
  // This regex detects day and Opening hours bsp: Mo 12:00-14:00,
  // 18:0-20:30; or Mo-Sa 12:00-20:00; or  Mo,Tu,We off;
  const stringForm = new RegExp('\\b(Mo|T[hu]|We|Fr|S[au]|PH)\\b\\s?' +
    '([-,])?\\s?\\b(Mo|T[hu]|We|Fr|S[au])?\\b\\s?([-,])?\\s?\\b(Mo|T[hu]|We|Fr|S[au]|PH)?' +
    '\\b\\s?(off;)?((([0-1]?[0-9]|[2][0-4]):[0-5][0-9])\\s?([-+])\\s?(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])?;?' +
    '(\\s?,\\s*(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])(\\+|\\s?-\\s?(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])))*;?)?(off)?', 'gm');
  const openingHoursSeperatedByDays = output.toString().match(stringForm);
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'PH'];
  const days = [false, false, false, false, false, false, false, false];
  let orderedByWeekdays = [];
  if (openingHoursSeperatedByDays) {
    for (let a = 0; a < openingHoursSeperatedByDays.length; a = a+1) {
      for (let b = 0; b < weekDays.length; b = b+1) {
        if (openingHoursSeperatedByDays[a].toString().startsWith(weekDays[b])) {
          if (days[b] === false) {
            orderedByWeekdays[b] = openingHoursSeperatedByDays[a];
            days[b] = true;
          } else {
            orderedByWeekdays[b] = `${orderedByWeekdays[b]},${openingHoursSeperatedByDays[a].replace(stringForm, (_1, _2, _3, _4, _5, _6, _7, _8) => _8)}`;
            orderedByWeekdays[b] = orderedByWeekdays[b].replace(/;/g, '');
          }
        }
      }
    }
    orderedByWeekdays = orderedByWeekdays.filter(el => el != null);
    output = orderedByWeekdays.join(' ');
  }
  return output;
}

function removeUnNeededSpace(input) {
  let output = input + '';
  output = output.replace(/\*|\r?\n|\r|\s+/g, ' ');
  output = output.replace(/;;/g, ';');
  return output.replace(/\s?-\s?/g, '-').trim();
}

function handelSorting(input) {
  let output = input + '';
  const findDaysAndTime = /(Mo|Tu|We|Th|Fr|Sa|Su|PH).+?([0-9]|f|\+)\s/g;
  output = `${output} `;
  const ifStringDoesntMatch = output.toString().match(findDaysAndTime);
  if (output.toString().match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec/g)) { /* eslint-disable no-empty */
  } else if (!ifStringDoesntMatch) {
    output = sortDays(output);
  } else {
    output = output.replace(findDaysAndTime, (_1) => {
      return sortDays(_1);
    });
  }
  output = output.replace(/([0-9]);?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec)/g, (_1, _2, _3) => `${_2} ${_3}`);
  output = removeUnNeededSpace(output);
  return output;
}

function handelSecondSorting(input) {
  let output = input + '';
  const secondFindDaysAndTime = /(Mo|Tu|We|Th|Fr|Sa|Su|PH).+[0-9+];/g;
  const findDaysAndTime = /(Mo.+?|Tu.+?|We.+?|Th.+?|Fr.+?|Sa.+?|Su.+?|PH.+?)(([0-2][0-9]:[0-5][0-9]\s)?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec|\$))/g;
  output = output.replace(/\(/gi, ' (');
  output = output.replace(/([0-9]);?,?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec)/g, (_1, _2, _3) => `${_2} ${_3}`);
  output = `${output}$`;
  output = output.replace(/([0-2][0-9]:[0-5][0-9]-[0-2][0-9]:[0-5][0-9])\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g, (_1, _2, _3) => `${_2}; ${_3}`);
  if (output.toString().match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec)/g)) {
    output = output.replace(findDaysAndTime, (_1, _2, _3) => `${sortDays(_2)}${_3}`);
  } else if (output.toString().match(secondFindDaysAndTime)) {
    output = sortDays(output);
  }
  output = output.replace(/\$/g, '');
  return output;
}

function addDoublePointOnMonths(input) {
  let output = input + '';
  output = output.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec)\s/g, (_1, _2) => `${_2}: `);
  return output;
}

function cleanUpMonthRange(input) {
  let output = input + '';
  const monthRange = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec):\s([1-3][0-9].|[0]?[1-9].)/g;
  output = output.toString().replace(monthRange, (_1, _2, _3) => `${_2} ${_3}`);
  return output;
}

function sortMonths(input) {
  let output = input + '';
  const months = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g;
  const monthRangFinder = new RegExp('(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)([,\\-])?' +
    '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?(,Jan|,Feb|,Mar|,Apr|,May|,Jun|,Jul|,Aug|,Sep|,Oct|,Nov|,Dec)*', 'g');
  const timeRangFinder = /((Mo|Tu|We|Th|Fr|Sa|Su|PH).*?[0-9];)(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g;
  output = output.replace(/([0-9]-[0-5][0-9])\s?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec)/g, (_1, _2, _3) => `${_2}; ${_3}`);
  if (output.toString().match(months)) {
    if (output.match(/(Jan$|Feb$|Mar$|Apr$|May$|Jun$|Jul$|Aug$|Sep$|Oct$|Nov$|Dec$)/gm)) {
      const monthRanges = output.match(monthRangFinder);
      const timeRanges = output.match(timeRangFinder);
      if (monthRanges.length === timeRanges.length) {
        let newString = '';
        for (let a = 0; a < monthRanges.length; a = a+1) {
          timeRanges[a] = timeRanges[a].replace(months, '');
          monthRanges[a] = `${monthRanges[a]}`;
          newString = `${newString}${monthRanges[a]}${timeRanges[a]}`;
        }
        output = newString.slice(0, newString.length - 1);
      }
    }
    output = addDoublePointOnMonths(output);
    output = cleanUpMonthRange(output);
  }
  output = output.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Oct|Sep|Nov|Dec)\s/g, (_1, _2) => `${_2}: `);
  return output;
}

function checkResult(input) {
  let output = input + '';
  output = output.replace(/off/g, '#');
  output = output.replace(/([^JFMASONDo])[a-z][A-Za-z]+/g, '');
  output = output.replace(/#/g, 'off');
  if (!output.toString().match(/[0-1][0-9]:[0-5][0-9][-+]|[2][0-4]:[0-5][0-9][-+]|off|24\/7/g)) {
    output = 'No valid input';
  }
  output = output.replace(/,{2,}|-{2,}|;{2,}|:{2,}|\.{2,}|\+{2,}/g, '').trim();
  return output;
}

function replaceEnglishMonths(input) {
  let output = input + '';
  const regexArray = [/January/gi, /February/gi, /March/gi, /April/gi, /May/gi, /June/gi, /July/gi, /August/gi, /September/gi, /October/gi, /November/gi, /December/gi];
  const replacementArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let a = 0; a < regexArray.length; a = a+1) {
    output = output.replace(regexArray[a], replacementArray[a]);
  }
  return output;
}

function replaceGermanMonths(input) {
  let output = input + '';
  const regexArray = [/Januar/gi, /Februar/gi, /März/gi, /April/gi, /Mai/gi, /Juni/gi, /Juli/gi, /August/gi, /September/gi, /Oktober/gi, /November/gi, /Dezember/gi];
  const replacementArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let a = 0; a < regexArray.length; a = a+1) {
    output = output.replace(regexArray[a], replacementArray[a]);
  }
  return output;
}

// replaces words with their correct symbols, geschlossen gets turned
// int # to make it easier to handle surplus words later
function germanWords(input) {
  let output = input + '';
  output = output.replace(/\bbis\b/gi, '-');
  output = output.replace(/(\bund\b|\s?\/)/gi, ',');
  output = output.replace(/\bgeschlossen\b|ruhetag/gi, '#;');
  return output.replace(/\btäglich\b/gi, 'Mo-Su');
}

// replaces words with their correct symbols, from and closed get
// turned into ab and # to make them easier to handel later
function englishWords(input) {
  let output = input + '';
  output = output.replace(/\bfrom\b/gi, 'ab');
  output = output.replace(/\bto\b|\btill\b/gi, '-');
  output = output.replace(/closed\snow|\band\b/gi, '');
  output = output.replace(/\bclosed\b/gi, '#');
  output = output.replace(/Open\s24\shours/gi, '00:00-24:00');
  output = output.replace(/Bank\sHolidays/gi, 'PH');
  output = output.replace(/Midnight|Open\sEnd/gi, '00:00');
  output = output.replace(/(12\s)?noon/gi, '12:00');
  return output;
}

// removes any word or number longer then 4 digits and two/three letter
// words that were specified also turns # into the correct syntax
function removeUnwantedText(input) {
  let output = input + '';
  output = output.replace(/&nbsp;/g, ' ');
  output = output.replace(/&ndash;/g, '-');
  // input = input.replace(/<[^>]*>/g,'');
  output = output.replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>|{.+?}/g, '').trim();
  output = output.replace(/".+?"|[a-z]+@[a-z]+.[a-z]+/g, '');
  output = output.replace(/[äüöéèàáßçâ=<>"{}$£@¦°§¬¢[\]'_?()!\\]/gi, '');
  output = output.replace(/([a-z]{4,}|[0-9]{3,})/gi, '');
  output = output.replace(/in|\ban|am|pm|on/gi, '');
  output = output.replace(/Uhr|von|now|===|vom|der|die|das|new|img|row|add|sie|uns|\b[A-Z]\b|[()]/gi, '');
  output = output.replace(/#/g, 'off');
  output = output.replace(/\s+/g, ' ');
  return output;
}

function bindDaysTogether(input) {
  let output = input + '';
  const rowOfDays = new RegExp('(Mo|Tu|We|Th|Fr),(Tu|We|Th|Fr|Sa),' +
    '(We|Th|Fr|Sa|Su),?(Th|Fr|Sa|Su)?,?(Fr|Sa|Su)?,?(Sa|Su)?,?(Su)?', 'g');
  output = output.toString().replace(rowOfDays, (_1, _2, _3, _4, _5, _6, _7, _8) => {
    if (_8) {
      return `${_2}-${_8}`;
    } else if (_7) {
      if ((_2 === 'Mo' && _7 === 'Sa') || (_2 === 'Tu' && _7 === 'Su')) {
        return `${_2}-${_7}`;
      }
    } else if (_6) {
      if ((_2 === 'Mo' && _6 === 'Fr') || (_2 === 'Tu' && _6 === 'Sa') || (_2 === 'We' && _6 === 'Su')) {
        return `${_2}-${_6}`;
      }
    } else if (_5) {
      if ((_2 === 'Mo' && _5 === 'Th') || (_2 === 'Tu' && _5 === 'Fr') || (_2 === 'We' && _5 === 'Sa') || (_2 === 'Th' && _5 === 'Su')) {
        return `${_2}-${_5}`;
      }
    } else if (_4) {
      if ((_2 === 'Mo' && _4 === 'We') || (_2 === 'Tu' && _4 === 'Th') || (_2 === 'We' && _4 === 'Fr') || (_2 === 'Th' && _4 === 'Sa') || (_2 === 'Fr' && _4 === 'Su')) {
        return `${_2}-${_4}`;
      }
    }
    return _1;
  });
  return output;
}

function handleUnspecificClosingTime(input) {
  let output = input + '';
  const noCloseTime = /\b(Mo|T[hu]|We|Fr|S[au]|PH|)\b\s?\b(ab)\b\s?(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])/g;
  const closeTime = /\b(Mo|T[hu]|We|Fr|S[au]|PH)\b\s?\b(ab)\b\s?(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])\s?-\s?(([0-1]?[0-9]|[2][0-4]):[0-5][0-9])/g;
  if (!output.match(closeTime)) {
    output = output.toString().replace(noCloseTime, (_1, _2, _3, _4) => `${_2} ${_4}+`);
  }
  return output.toString().replace(/\bab\b/g, '');
}

function shortenDaysGer(input) {
  let output = input + '';
  const regexArray = [/\b(Montage?s?|Mo\.?)\b/gi, /\b(Dienstage?s?|Di\.?)\b/gi, /\b(Mittwoche?s?|Mi\.?)\b/gi,
    /\b(Donnerstage?s?|Do\.?)\b/gi, /\b(Freitage?s?|Fr\.?)\b/gi, /\b(Samstage?s?|Sa\.?)\b/gi, /\b(Sonntage?s?|So\.?)\b/gi,
    /(Sonn\.\sund\sFeiertags|Sonn-\s?(&|und)\s?Feiertage?:?|Sonn..\sFeiertage?s?)/g, /Wochenenden?\b/gi, /\b(Feiertags|Feiertage?)\b/gi];
  const replacementArray = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Su,PH', 'Sa-Su', 'PH'];
  for (let a = 0; a < regexArray.length; a = a+1) {
    output = output.replace(regexArray[a], replacementArray[a]);
  }
  return output;
}

function shortenDaysEng(input) {
  let output = input + '';
  const regexArray = [/\bWeekdays/gi, /\bdaily\b/gi, /\b(Mondays?|Mon\.?)\b/gi, /\b(Tuesdays?|Tue\.?|Tues)\b/gi,
    /\b(Wednesdays?|Wed\.?)\b/gi, /\b(Thursdays?|Thu\.?|Thurs)\b/gi, /\b(Fridays?|Fri\.?)\b/gi, /\b(Saturdays?|Sat\.?)\b/gi,
    /\b(Sundays?|Sun\.?)\b/gi, /Bank Holidays?|\bPublic Holidays?\b|Public & Bank Holidays/gi];
  const replacementArray = ['Mo-Fr', 'Mo-Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'PH'];
  for (let a = 0; a < regexArray.length; a = a + 1) {
    output = output.replace(regexArray[a], replacementArray[a]);
  }
  return output;
}

function addComma(input) {
  let output = input + '';
  const commaSearch = /\b(Mo|T[hu]|We|Fr|[S][au]|PH)\b\s.?\s?\b(Mo|T[hu]|We|Fr|S[au]|PH)\b/g;
  output = output.toString().replace(commaSearch, (_1, _2, _3) => `${_2},${_3}`);
  output = output.replace(/\s?,\s?/g, ',');
  return output;
}

function detectNextTime(input) {
  let output = input + '';
  const nextTime = /(([0-1][0-9]|[2][0-4]):[0-5][0-9])\s*(([0-1]?[0-9]|[2][0-4]):[0-5][0-9]|ab)/g;
  output = (output.toString().replace(nextTime, (_1, _2, _3, _4) => `${_2}, ${_4}`));
  return output.replace(/\s+/g, ' ');
}

function pullDaysTogether(input) {
  let output = input + '';
  const multipleDays = /(Mo|T[hu]|We|Fr|Sa|Su|PH),\s((Mo|T[hu]|We|Fr|Sa|Su|PH),\s){2,}/g;
  output = output.toString().replace(/(Mo|T[hu]|We|Fr|Sa|Su|PH)\s+(Mo|T[hu]|We|Fr|Sa|Su|PH)/g, (_1, _2, _3) => `${_2},${_3}`);
  return output.toString().replace(multipleDays, (_1, _2) => `${_2}-`);
}

function handelPM(input) {
  let output = input + '';
  const findAMPM = /\b([0-9]{2}[.:][0-9]{2}|[0-9]?[0-9]|[0-9][.:][0-9]{2})\s?[ap][m]/gi;
  output = output.replace(findAMPM, (_1) => {
    const temp = moment(_1, ['hh A', 'hh a', 'h A', 'h a', 'h.mm A', 'h.mm a', 'hh.mm A', 'hh.mm a']);
    return temp.format('HH:mm');
  });
  output = output.replace(/\s+/g, ' ');
  return output;
}

function convert(input) {
  if (input !== undefined) {
    let hoursToConvert = input;
    hoursToConvert = removeUnNeededSpace(hoursToConvert);
    hoursToConvert = handelPM(hoursToConvert);
    hoursToConvert = shortenDaysEng(hoursToConvert);
    hoursToConvert = englishWords(hoursToConvert);
    hoursToConvert = replaceEnglishMonths(hoursToConvert);
    hoursToConvert = replaceEnglishMonths(hoursToConvert);
    hoursToConvert = shortenDaysGer(hoursToConvert);
    hoursToConvert = germanWords(hoursToConvert);
    hoursToConvert = replaceGermanMonths(hoursToConvert);
    hoursToConvert = hoursToConvert.replace(/['!©«»&@]/g, '');
    hoursToConvert = removeYearFromMonth(hoursToConvert);
    hoursToConvert = addDoublePoint(hoursToConvert);
    hoursToConvert = removeUnwantedText(hoursToConvert);
    hoursToConvert = handleNumeralDates(hoursToConvert);
    hoursToConvert = replaceSymbols(hoursToConvert);
    hoursToConvert = addMissingZeros(hoursToConvert);
    hoursToConvert = detectNextTime(hoursToConvert);
    hoursToConvert = detectNewDay(hoursToConvert);
    hoursToConvert = handleUnspecificClosingTime(hoursToConvert);
    hoursToConvert = removeUnNeededSpace(hoursToConvert);
    hoursToConvert = addComma(hoursToConvert);
    hoursToConvert = orderDaysAndTime(hoursToConvert);
    hoursToConvert = handelSorting(hoursToConvert);
    hoursToConvert = pullDaysTogether(hoursToConvert);
    hoursToConvert = handelMonthDays(hoursToConvert);
    hoursToConvert = bindDaysTogether(hoursToConvert);
    hoursToConvert = removeUnNeededSpace(hoursToConvert);
    hoursToConvert = detectNewDay(hoursToConvert);
    hoursToConvert = handelSecondSorting(hoursToConvert);
    hoursToConvert = cleanUp(hoursToConvert);
    hoursToConvert = removeAdditionalZeroesFromMonths(hoursToConvert);
    if (hoursToConvert.toString().match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g)) {
      const multipleSpecificDates = /(Jan:|Feb:|Mar:|Apr:|May:|Jun:|Jul:|Aug:|Sep:|Oct:|Nov:|Dec:)(\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s([0-2][0-9]):)+\s([0-2][0-9])/g;
      hoursToConvert = hoursToConvert.replace(/([0-9]{2}:[0-9]{2}\+)(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g, (_1, _2, _3) => `${_2}; ${_3}`);
      hoursToConvert = sortMonths(hoursToConvert);
      hoursToConvert = correctMonthDays(hoursToConvert);
      hoursToConvert = switchDayAndMonthPosition(hoursToConvert);
      hoursToConvert = removeWrongDoublepoints(hoursToConvert);
      hoursToConvert = addMissingZeroesDays(hoursToConvert);
      hoursToConvert = monthRagneEndCorrection(hoursToConvert);
      hoursToConvert = monthsAddSpace(hoursToConvert);
      hoursToConvert = combineSameMonths(hoursToConvert);
      hoursToConvert = hoursToConvert.replace(multipleSpecificDates, (_1) => {
        multipleSpecificDatesFunction(_1);
      });
      hoursToConvert = hoursToConvert.replace(/:;/g, ':');
      hoursToConvert = separateMonthsAndDays(hoursToConvert);
      hoursToConvert = detectNewDay(hoursToConvert);
      hoursToConvert = pullMonthsTogether(hoursToConvert);
      hoursToConvert = correctSyntaxBetweenMonthAndDay(hoursToConvert);
    }
    hoursToConvert = `${hoursToConvert};`;
    hoursToConvert = hoursToConvert.replace(/[0-2][0-9]:[0-5].+?[0-9+];/g, (_1) => {
      return cutOverlappingTime(_1);
    });
    hoursToConvert = handleAdditiveTime(hoursToConvert);
    hoursToConvert = cleanUp(hoursToConvert);
    hoursToConvert = addMonthsToEveryDays(hoursToConvert);
    hoursToConvert = replaceComma(hoursToConvert);
    hoursToConvert = checkResult(hoursToConvert);
    return hoursToConvert;
  }
  return '';
}
//this reads the needed data out of the dom
function scriptHandeling(input) {
  input = input.toString().replace(/"/g,'\'');
  let result;
  let outputString = ' ';
  outputString = outputString+input;
  const cutOutScript = /<script type="application\/ld\+json">(.|\n)+("openingHoursSpecification":.+?|"openingHours":.+?)<\/script>/g;
  outputString = outputString.replace(cutOutScript, (_1, _2, _3) => {return _3});
  const cutGroupOpeningHours = /"openingHours":\[(.*)\]/g;
  outputString = outputString.replace(cutGroupOpeningHours, (_1, _2) => {return _2.replace(/"/g, '');});
  const cutNotGroupedOpeningHours = /"openingHours":\s"(.+?)",/g;
  outputString = outputString.replace(cutNotGroupedOpeningHours, (_1, _2) => {return _2});
  const cutRemainingNotRelevantPart = /("openingHoursSpecification":\[.+?]).+/g;
  outputString = outputString.replace(cutRemainingNotRelevantPart, (_1, _2) => {return _2});
  const cutJSONParts = /(http:\/\/schema.org\/|{"@type":"OpeningHoursSpecification",|},|"dayOfWeek":|"openingHoursSpecification":\[|\]|})/g;
  outputString = outputString.replace(cutJSONParts, '');
  const removeSeperators = /(','|':')/g;
  outputString = outputString.replace(removeSeperators, ' ');
  outputString = outputString.replace(/""/g, ' ');
  outputString = outputString.replace(/closes/g, '-');
  outputString = outputString.replace(/"|opens/g, '');
  result = outputString;
  result = result.toString().replace(/\s+/g, ' ');
  result = result.toString().replace(/(\.[0-9]{2}\.)\s([0-9]{2}\.)/g, (_1, _2, _3) => {return `${_2} - ${_3}`});
  result = result.toString().replace(/(:[0-9][0-9])\s([0-9][0-9]:)/g, (_1, _2, _3) => {return`${_2} - ${_3}`});
  result = convert(result);
  return result;
}

export function handelShemaOrg(string) {
  string = string + '';
  // this handels opning hours when written in markdown

  const el = document.createElement('html');
  el.innerHTML = string;
  const microOH = $(el).find('[itemprop="openingHours"]');
  let microOHResponse = `${$(microOH).attr('content')}`;
  microOHResponse = convert(microOHResponse);
  if (microOHResponse === 'No valid input') {
    microOHResponse = '';
  }
  const micro = `${$(el).find("[itemprop='openingHoursSpecification']").text()}`;
  let microResponse = convert(micro);
  if (microResponse === 'No valid input') {
    microResponse = '';
  }
  microResponse = (`${microOHResponse} ${microResponse}`).trim();
  // this handels opening hours noted in RDFa
  let rdfaOH = `${$(el).find("[property='openingHours']").attr('content')}`;
  rdfaOH = convert(rdfaOH);
  if (rdfaOH === 'No valid input') {
    rdfaOH = '';
  }
  let rdfa = `${$(el).find("[property='openingHoursSpecification']").text()}`;
  rdfa = convert(rdfa);
  if (rdfa === 'No valid input') {
    rdfa = '';
  }
  const rdfaResponse = (`${rdfaOH} ${rdfa}`).trim();
  // this handels opening hours specified in the script application/ld+json
  const scripts = `${$(el).find("[type='application/ld+json']").html()}`;
  let scriptResponse = scriptHandeling(scripts);
  if (scriptResponse === 'No valid input') {
    scriptResponse = '';
  }
  let result = (`${microResponse} ${rdfaResponse} ${scriptResponse}`).trim();
  if (result === '') {
    result = 'No valid input';
  }
  return result.trim();
  // return `${string} test`;
}

function getSourceAsDom(url) {
  return fetch(`https://cors-anywhere.herokuapp.com/${url}`);
}

/*
 Copyright (c) 2010-2018 Diego Perini (http://www.iport.it)

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
  */
 /* export default async */ function isURL(url){

  const UrlRegex = new RegExp('^(?:(?:(?:https?|ftp):)?\\/\\/)(?:(?:[1-9]\\d?' +
    '|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]' +
    '\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]' +
    '{0,62})?[a-z0-9\u00a1-\uffff]\\.)+(?:[a-z\u00a1-\uffff]{2,}\\.?))', 'gm');
  let output = '';
  if(url !== '') {
    const input = url + '';
    if (input.match(UrlRegex)) {
      /* const promiseResult = */Promise.resolve(getSourceAsDom(input)).then(responseDom => {
        output = handelShemaOrg(responseDom);
        postMessage(output);
      });
      // output = handelShemaOrg(promiseResult);
    } else if (input.match(/[0-9]/g)) {
      output = convert(input);
      postMessage(output);
    }
  } else {
    postMessage('empty url');
  }
}

onmessage = (event) => {
   console.log(event);
  isURL(event.data);
};
