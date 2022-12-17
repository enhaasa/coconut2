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

const getCurrentTime = () => {
    const today = new Date();
    
    return today.getTime();
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

export default {
    sortArray, 
    toInitialsFirstNames, 
    capitalizeFirstLetter,
    getCurrentTime,
    getOldestOrder,
    getTimeSinceOldestOrder,
    formatTime
};