const sortArray = (array, sortDelivered) => {
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

const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getUTCFullYear();
    let mm = today.getUTCMonth() + 1; // Months start at 0!
    let dd = today.getUTCDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + yyyy;
}

const getCurrentTime = () => {
    const today = new Date();
    let hh = today.getUTCHours();
    let mm = today.getUTCMinutes();
    let ss = today.getUTCSeconds();

    if (hh < 10) hh = '0' + hh;
    if (mm < 10) mm = '0' + mm;
    if (ss < 10) ss = '0' + ss;

    return hh + ':' + mm + ':' + ss;
}

const formatTime = (seconds) => {
    if (seconds >= 60) return Math.floor(seconds / 60) + "m";
    return "< 1m";
}

const getOldestOrder = (orders) => (
    orders.reduce((oldest, current) => (
        current.date + current.time < current.date + oldest.time ? current : oldest
    ), orders[0])
)

const getTimeSinceOldestOrder = (order) => {

    if (order === undefined) return;

    const oldestTime = order.time.replaceAll(":", "");
    const oldestDate = order.date.replaceAll(".", "");

    const currentTime = getCurrentTime().replaceAll(":", "");
    const currentDate = getCurrentDate().replaceAll(".", "");

    const result = (currentDate + currentTime) - (oldestDate + oldestTime);
    
    return result;
}

export default {
    sortArray, 
    toInitialsFirstNames, 
    capitalizeFirstLetter,
    getCurrentDate,
    getCurrentTime,
    getOldestOrder,
    getTimeSinceOldestOrder,
    formatTime
};