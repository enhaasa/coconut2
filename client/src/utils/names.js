export function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

export const toInitialsFirstNames = (name) => {
    const fullName = name.split(' ');
    let initials = '';
    
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

export const getFirstName = (name) => {
    if (name === null) return (''); 

    return name.split(' ')[0];
}

export const getLastNames = (name) => {
    return name.split(' ').slice(1);
}

export const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
