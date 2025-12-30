/**
 * Глубокое объединение двух объектов.
 *
 * Если оба значения массивы, то выполняется объединение.
 * Если оба значения объекты, то выполняется объединение.
 * В остальных случаях значение из source перезаписывает target.
 *
 * @param {*} target
 * @param {*} source
 * @returns {*}
 */
export function mergeDeep(target, source) {
  const isObject = item => {
    return item && typeof item === 'object' && !Array.isArray(item);
  };
  // если оба значения массивы, то возвращается
  // новый массив с их объединением
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  }
  // если оба значения объекты,
  // то выполняется глубокое слияние
  if (isObject(target) && isObject(source)) {
    // создание поверхностной копии первого объекта
    const result = {...target};
    // обход ключей второго объекта
    Object.keys(source).forEach(key => {
      const targetValue = target[key];
      const sourceValue = source[key];
      // если ключ есть и в первом объекте,
      // то выполняется объединение их значений
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        result[key] = mergeDeep(targetValue, sourceValue);
      } else {
        // если ключа нет в первом объекте,
        // то берется значение из второго
        result[key] = sourceValue;
      }
    });
    return result;
  }
  // во всех остальных случаях значение
  // из source перезаписывает target
  return source;
}
