function getWidthStartPosition(start) {
  start = +start.split(':')[1];

  if (start === 0) {
    return '0';
  }

  let offset = (start / MINUTES_IN_HOUR * 160);

  if (!Number.isInteger(offset)) {
    offset = offset.toFixed(2);
  }
  return `${offset}px`;
}


function getLessonWidth(duration) {
  if ((duration) < 30) {
    return '100px';
  }
  let width = (duration) / MINUTES_IN_HOUR * 160;

  if (!Number.isInteger(width)) {
    width = width.toFixed(2);
  }

  return `${width}px`;
}

function addEmptyProperty(schedule, propertyName = 'schedules') {
  return schedule.map(item => {
    for (let timeline in item[propertyName]) {
      item.isEmpty = true;
      if (item[propertyName][timeline].length) {
        item.isEmpty = false;
        break;
      }
    }

    return item;
  });
}
