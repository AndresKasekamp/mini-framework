export function areAllValuesEqual(array, key) {
  if (array.length === 0) {
    return true; // If array is empty, return true
  }

  const firstValue = array[0][key]; // Get the value of the key from the first object

  // Check if the value of the key in each object is equal to the first value
  return array.every((obj) => obj[key] === firstValue);
}

// Generating unique id-s for todo list items
function* generateDataId() {
  let id = 1;

  while (true) {
    yield id;
    id++;
  }
}

export const generatorId = generateDataId();
