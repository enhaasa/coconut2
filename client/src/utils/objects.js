export function hasPropertyValue(arr, prop, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][prop] === val) {
        return true;
      }
    }
    return false;
}
