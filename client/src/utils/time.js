
export const getCurrentTime = () => {
    const today = new Date();
    return today.getTime();
}

export function getCurrentDate(offset) {

    const date = new Date();
    offset && date.setDate(offset(date.getDate()));

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function epochToDate(epochTime) {
    const date = new Date(epochTime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export function epochToTime(epochTime) {
    const date = new Date(epochTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

export function dateToEpoch(dateString) {
    const [day, month, year] = dateString.split('.');
    const date = new Date(year, month - 1, day);
    return date.getTime();
}

export function timeToEpoch(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(num => parseInt(num));
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
    return date.getTime();
}

export function epochToSqlDateTime(epoch) {
    const dateObj = new Date(parseInt(epoch));
    const year = dateObj.getUTCFullYear();
    const month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getUTCDate()).slice(-2);
    const hours = ('0' + dateObj.getUTCHours()).slice(-2);
    const minutes = ('0' + dateObj.getUTCMinutes()).slice(-2);
    const seconds = ('0' + dateObj.getUTCSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function sqlDateTimeToEpoch(sqlDateTime) {
    const dateObj = new Date(sqlDateTime);
    return dateObj.getTime();
}

export function compareDates(date1, date2) {
    const d1 = new Date(date1.split(' ').join('T')); // Convert date string to a Date object
    const d2 = new Date(date2.split(' ').join('T')); // Convert date string to a Date object
    const diff = Math.abs(d1 - d2) / 1000; // Calculate the difference in seconds
  
    if (diff < 60) { // Difference is less than 1 minute
      return `${Math.floor(diff)}s`;
    } else if (diff < 3600) { // Difference is less than 1 hour
      return `${Math.floor(diff / 60)}m`;
    } else { // Difference is 1 hour or more
      return `${Math.floor(diff / 3600)}h`;
    }
}

export const formatTime = (epoch) => {
    if (!epoch) return '0s';
    if (epoch >= 3600000) {
      const hours = Math.floor(epoch / 3600000);
      return hours + 'h';
    }
    if (epoch >= 60000) {
      const minutes = Math.floor(epoch / 60000);
      return minutes + 'm';
    }
    return Math.floor(epoch / 1000) + 's';
  };

export function convertDatetimeFormat(datetimeString) {
    const date = new Date(datetimeString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}