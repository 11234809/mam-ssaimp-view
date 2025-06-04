export function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    let copy;
    // 如果是数组，创建一个新数组
    if (Array.isArray(obj)) {
        copy = [];
        for (let i = 0; i < obj.length; i++) {
            copy[i] = deepCopy(obj[i]);
        }
    } else {
        // 如果是对象，创建一个新对象
        copy = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepCopy(obj[key]);
            }
        }
    }
    return copy;
}