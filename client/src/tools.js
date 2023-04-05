function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}


const sortArrayByCustomer = (array, sortDelivered) => {
    let sortedArray = [];

    array.forEach((arrayItem, index) => {

        if (arrayItem.delivered === sortDelivered) {
            let duplicate = false;
            let duplicateIndex = 0;

            sortedArray.forEach((sortedItem, index) => {
                if(sortedItem.name === arrayItem.name 
                    && sortedItem.price === arrayItem.price
                        && sortedItem.customer === arrayItem.customer) {
                        duplicate = true;
                        duplicateIndex = index;
                    } 
            })

            if (!duplicate) {
                sortedArray.push({...arrayItem, amount: 1, ids: [arrayItem.id], total: arrayItem.price});
            } else {
                sortedArray[duplicateIndex].amount ++;
                sortedArray[duplicateIndex].ids.push(arrayItem.id);
                sortedArray[duplicateIndex].total += arrayItem.price;
            }
        }
    });

    return sortedArray;
}
const sortArray = (array, sortDelivered) => {
    let sortedArray = [];

    array.forEach((arrayItem, index) => {

        if (arrayItem.delivered === sortDelivered) {
            let duplicate = false;
            let duplicateIndex = 0;

            sortedArray.forEach((sortedItem, index) => {
                if(sortedItem.name === arrayItem.name 
                    && sortedItem.price === arrayItem.price) {
                        duplicate = true;
                        duplicateIndex = index;
                    } 
            })

            if (!duplicate) {
                sortedArray.push({...arrayItem, amount: 1, ids: [arrayItem.id], total: arrayItem.price});
            } else {
                sortedArray[duplicateIndex].amount ++;
                sortedArray[duplicateIndex].ids.push(arrayItem.id);
                sortedArray[duplicateIndex].total += arrayItem.price;
            }
        }
    });

    return sortedArray;
}

const sortArchivedArray = (array) => {
    let sortedArray = [];

    array.forEach((arrayItem, index) => {

        let duplicate = false;
        let duplicateIndex = 0;

        sortedArray.forEach((sortedItem, index) => {
            if(sortedItem.id === arrayItem.id 
                && sortedItem.price === arrayItem.price) {
                    duplicate = true;
                    duplicateIndex = index;
                } 
        })

        if (!duplicate) {
            sortedArray.push({...arrayItem, amount: 1, ids: [arrayItem.id], total: arrayItem.price});
        } else {
            sortedArray[duplicateIndex].amount ++;
            sortedArray[duplicateIndex].ids.push(arrayItem.id);
            sortedArray[duplicateIndex].total += arrayItem.price;
        }
        
    });

    return sortedArray;
}


const toInitialsFirstNames = (name) => {
    const fullName = name.split(' ');
    let initials = "";
    
    if (fullName.length > 1) {
        for(let i = 0; i < fullName.length -1; i++) {
            initials += `${fullName[i].charAt(0).toUpperCase()}. `;
        }
        initials += `${fullName[fullName.length -1]}`;
    } else {
        initials = name;
    }

    return initials;
}

const getFirstName = (name) => {
    return name.split(' ')[0];
}

const getLastNames = (name) => {
    return name.split(' ').slice(1);
}

const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCurrentTime = () => {
    const today = new Date();
    return today.getTime();
}
function getDate(offset) {

    const date = new Date();
    date.setDate(offset(date.getDate()));

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    /*
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const seconds = String(today.getSeconds()).padStart(2, "0");
    */
    return `${day}.${month}.${year}`;
}

function epochToDate(epochTime) {
    const date = new Date(epochTime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}
function epochToTime(epochTime) {
    const date = new Date(epochTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
function dateToEpoch(dateString) {
    const [day, month, year] = dateString.split('.');
    const date = new Date(year, month - 1, day);
    return date.getTime();
}
function timeToEpoch(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(num => parseInt(num));
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
    return date.getTime();
}

function epochToSqlDateTime(epoch) {
    const dateObj = new Date(epoch);
    const year = dateObj.getUTCFullYear();
    const month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getUTCDate()).slice(-2);
    const hours = ("0" + dateObj.getUTCHours()).slice(-2);
    const minutes = ("0" + dateObj.getUTCMinutes()).slice(-2);
    const seconds = ("0" + dateObj.getUTCSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function sqlDateTimeToEpoch(sqlDateTime) {
    const dateObj = new Date(sqlDateTime);
    return dateObj.getTime();
}

const formatTime = (epoch) => {
    if (!epoch) return "0s";
    if (epoch >= 60000) return Math.floor(epoch / 60000) + "m";
    return Math.floor(epoch / 1000) + "s";
}

const getOldestOrder = (orders) => (
    orders.reduce((oldest, current) => (
        current.time < oldest.time ? current : oldest
    ), orders[0])
)

const getTimeSinceOldestOrder = (order) => {

    if (order === undefined) return;

    const oldestTime = order.time;
    const currentTime = getCurrentTime();

    const result = currentTime - oldestTime;
    
    return result;
}

function hasPropertyValue(arr, prop, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][prop] === val) {
        return true;
      }
    }
    return false;
  }

export default {
    hasPropertyValue,    
    sortArray,
    sortArrayByCustomer, 
    sortArchivedArray,
    getFirstName,
    getLastNames,
    toInitialsFirstNames, 
    capitalizeFirstLetter,
    getCurrentTime,
    getOldestOrder,
    getTimeSinceOldestOrder,
    formatTime,
    epochToDate,
    epochToTime,
    dateToEpoch,
    timeToEpoch,
    epochToSqlDateTime,
    sqlDateTimeToEpoch,
    getDate,
    debounce
};