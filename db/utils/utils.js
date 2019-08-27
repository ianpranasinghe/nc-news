exports.formatDates = list => {
  newlist = [...list];
  return newlist.map(timeStamp => {
    timeStamp.created_at = new Date(timeStamp.created_at);
    return timeStamp;
  });
};

exports.makeRefObj = (arr, keyName, keyValue) => {
  return arr.reduce((acc, element) => {
    const newKeyName = element[keyName];
    const newKeyValue = element[keyValue];
    acc[newKeyName] = newKeyValue;
    return acc;
  }, {});
};

exports.formatComments = (insertion, keyToChange, newKeyName, lookup) => {
  if (lookup) {
    const changeKeyName = insertion.map(item => {
      const newObj = { ...item };
      newObj[newKeyName] = newObj[keyToChange];
      delete newObj[keyToChange];
      newObj[newKeyName] = lookup[newObj[newKeyName]];
      return newObj;
    });
    return changeKeyName;
  } else {
    const changeKeyName = insertion.map(item => {
      const newObj = { ...item };
      newObj[newKeyName] = newObj[keyToChange];
      delete newObj[keyToChange];
      return newObj;
    }); //THIS IS MOIST WHY CAN'T I THINK OF A DRY WAY I'VE TRIED A FEW DIFFERENT WAYS WHY AM I SO STUPID
    return changeKeyName;
  }
};
