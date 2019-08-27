exports.formatDates = list => {
  return list.map(timeStamp => {
    timeStamp.created_at = new Date(timeStamp.created_at);
    return timeStamp;
  });
};

exports.makeRefObj = (arr1, arr2, keyName, keyValue, comparative) => {
  return arr1.reduce((acc, element) => {
    arr2.forEach(innerElement => {
      if (element[comparative] === innerElement[keyName]) {
        acc[innerElement[keyName]] = element[keyValue];
      }
    });
    return acc;
  }, {});
};

// exports.formatComments = (comments, articleRef) => {
//   return [];
// };
exports.formatComments = (insertion, keyToChange, newKeyName) => {
  const empty = [...insertion];
  const apfel = insertion.map(item => {
    const newObj = { ...item };
    if (item[keyToChange]) {
      item[newKeyName] = item[keyToChange];
      return newObj;
    }
  });
  console.log(apfel, "<-- apfel");
};
