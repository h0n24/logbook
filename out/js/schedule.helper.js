const MINUTES_IN_HOUR = 60;

function mapTeachersSchedule(schedule) {
  const mappedList = {};

  for (let key in schedule) {
    mappedList[key] = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
    };

    if (schedule[key] && schedule[key].length) {
      schedule[key].forEach((item) => {
        mappedList[key][item.weekday].push(item);
      });
    }
  }

  return scheduleHasLessonsHelper(mappedList);
}

function scheduleHasLessonsHelper(schedule) {
    for (let key in schedule) {
      const allLessons = getLessonsInArray(schedule);
      schedule[key].hasLessons = testLessons(allLessons, +key);
    }

  return schedule;
}

function testLessons(lessons, timeline) {

  if (!lessons.length) return false;

  return lessons.some((lesson) => {
    const lessonStartHour = +lesson.l_start.split(':')[0];
    const lessonStartMin = +lesson.l_start.split(':')[1];
    const lessonEndHour = +lesson.l_end.split(':')[0];
    const lessonEndMin = +lesson.l_end.split(':')[1];

    if (timeline === lessonEndHour && lessonEndMin > 0) return true;
    if (timeline === lessonStartHour) return true;
    if (timeline > lessonStartHour && timeline < lessonEndHour) return true;

    return false;
  });
}

function getLessonsInArray(list) {
  let lessons = [];
  for (let timeline in list) {
    for (let day in list[timeline]) {
      if (list[timeline][day].length) {
        list[timeline][day].timeline = timeline;
        lessons = lessons.concat(list[timeline][day]);
      }
    }
  }

  return lessons;
}

function isTimelineHasLessons(key, currentRow, prevRow) {
  const firstTimeline = 7;

  if (+key === firstTimeline) {
    return checkCurrentRow(currentRow);
  } else {
    if (currentRow || prevRow) {

      return checkPreviousRow(prevRow, key) || checkCurrentRow(currentRow);
    } else {
      return true;
    }
  }
}

function checkCurrentRow(timeline) {
  let lessons = [];
  for (let item in timeline) {
    lessons = lessons.concat(timeline[item]);
  }

  return !!lessons.length;
}

function checkPreviousRow(timeline, key) {
  if (timeline.hasLessons.toString() === 'false') return false;

  let allLessons = [];
  for (let item in timeline) {
    if (item === 'hasLessons') continue;
    allLessons = allLessons.concat(timeline[item]);
  }

  return allLessons.some((lesson) => {
    const lessonEndHour = +lesson.l_end.split(':')[0];
    const lessonEndMin = +lesson.l_end.split(':')[1];

    return +key >= +lessonEndHour && +lessonEndMin > 0;
  });
}

function getLessonStartPosition(start) {
  start = +start.split(':')[1];

  if (start === 0) {
    return '0';
  }

  let offset = (start / MINUTES_IN_HOUR * 100);

  if (!Number.isInteger(offset)) {
    offset = offset.toFixed(2);
  }
  return `${offset}px`;
}


function getLessonHeight(duration) {
  if (duration < 30) {
    return '50px';
  }
  let height = duration / MINUTES_IN_HOUR * 100;

  if (!Number.isInteger(height)) {
    height = height.toFixed(2);
  }

  return `${height}px`;
}
