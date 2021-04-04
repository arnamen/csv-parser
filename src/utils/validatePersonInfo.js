import deepCopy from 'deepcopy';

const FULL_NAME_INDEX = 1;
const PHONE_INDEX = 2;
const EMAIL_INDEX = 3;
const AGE_INDEX = 4;
const EXPERIENCE_INDEX = 5;
const INCOME_INDEX = 6;
const HAS_CHILDREN_INDEX = 7;
const EXPIRATION_INDEX = 9;
const LICENSE_INDEX = 10;
const DUPLICATE_INDEX = 11;

export const validate = (_data) => { 
    let isTableValid = true;
    let data = [];
    try {
        data  = checkDuplicates(_data);
    } catch (error) {
        return {
            failed: true,
            error: error.message
        };
    }

    //adjust undefined children status to false
    data = data.map(userData => {
        if(userData[HAS_CHILDREN_INDEX] === "") userData[HAS_CHILDREN_INDEX] = "false";
        return userData;
    })

    try {
        data.forEach(userData => {
            const validationResult = checkIfDataValid(userData);
            //attach info about valid cells to each user data
            userData.push(validationResult);
            if(typeof checkIfDataValid(userData) === "boolean") isTableValid = isTableValid && validationResult;
        });
    } catch (error) {
        return {
            failed: true,
            error: error.message
        };
    }
    return isTableValid ? data : {
        failed: true,
        error: ""
    };

}

const checkDuplicates = (_data) => {

    let data = deepCopy(_data); //to prevent changing of original value
    //check for duplicates
    for (let i = 0; i < data.length; i++) {
        //fix unnecessary spaces
        data[i] = data[i].map(value => value.toString().trim());

        for (let j = i+1; j < data.length; j++) {

            if (data[i][PHONE_INDEX] === data[j][PHONE_INDEX] ||
                data[i][EMAIL_INDEX].toLowerCase() === data[j][EMAIL_INDEX].toLowerCase()) {
                    if(isNaN(+data[j][DUPLICATE_INDEX]))
                        data[j][DUPLICATE_INDEX] = i+1;
            }
        }
        //not NaN means that it is already marked as duplicate
        if(isNaN(+data[i][DUPLICATE_INDEX])) data[i][DUPLICATE_INDEX] = "-";
    }
    return data;
}
//will return an array with invalid cells
const checkIfDataValid = (personData) => {
    const invalidCellsIndexes = [];

    if(personData[FULL_NAME_INDEX] === "" || !personData[FULL_NAME_INDEX].includes(" ")) {
        invalidCellsIndexes.push(FULL_NAME_INDEX);
        return false; //if full name is invalid we already have to show error message
    }

    if(personData[EMAIL_INDEX] === "") {
        invalidCellsIndexes.push(EMAIL_INDEX);
        return false; //if email is empty we have to show error message
    }

    if(personData[PHONE_INDEX] === "") {
        invalidCellsIndexes.push(PHONE_INDEX);
        return false; //if phone is empty we have to show error message
    }

    //check email
    const regexEmail = /\S+@\S+\.\S+/;
    if(!regexEmail.test(personData[EMAIL_INDEX])) {
        invalidCellsIndexes.push(EMAIL_INDEX); 
    }
        //check phone
        const regexPhone1 = /^\+1\d\d\d\d\d\d\d\d\d\d$/; //+1XXXXXXXXXX
        const regexPhone2 = /^1\d\d\d\d\d\d\d\d\d\d$/; //1XXXXXXXXXX
        const regexPhone3 = /^\d\d\d\d\d\d\d\d\d\d$/; //XXXXXXXXXX
        if(!personData[PHONE_INDEX].match(regexPhone1) &&
           !personData[PHONE_INDEX].match(regexPhone2) &&
           !personData[PHONE_INDEX].match(regexPhone3)) {
        invalidCellsIndexes.push(PHONE_INDEX); 
        }
    //check age
    if(isNaN(+personData[AGE_INDEX]) || 
    +personData[AGE_INDEX] < 21) {
        invalidCellsIndexes.push(AGE_INDEX); 
    }
    //check experience
    if(isNaN(+personData[EXPERIENCE_INDEX]) || 
    +personData[EXPERIENCE_INDEX] < 0 ||
    (!isNaN(+personData[AGE_INDEX]) && +personData[EXPERIENCE_INDEX] > +personData[AGE_INDEX] - 21)
    ) {
        invalidCellsIndexes.push(EXPERIENCE_INDEX); 
    }
    //check income
    if(isNaN(+personData[INCOME_INDEX]) || 
    +personData[INCOME_INDEX] < 0 ||
    +personData[INCOME_INDEX] > 1000000) {
        invalidCellsIndexes.push(INCOME_INDEX); 
    }
    //License states will be checked inside table
    //expiration date
    const regexExpDate1 = /^\d\d\d\d-\d\d-\d\d$/; //YYYY-MM-DD
    const regexExpDate2 = /^\d\d\/\d\d\/\d\d\d\d$/; //MM/DD/YYYY
    if((!regexExpDate1.test(personData[EXPIRATION_INDEX]) && !regexExpDate2.test(personData[EXPIRATION_INDEX])) ||
        new Date() > new Date(personData[EXPIRATION_INDEX])) {
        invalidCellsIndexes.push(EXPIRATION_INDEX); 
    }
    //check has children
    if(personData[HAS_CHILDREN_INDEX].toLowerCase() !== "true" && 
    personData[HAS_CHILDREN_INDEX].toLowerCase() !== "false") {
        console.log(personData[HAS_CHILDREN_INDEX].toLowerCase())
        invalidCellsIndexes.push(HAS_CHILDREN_INDEX);
    }
    //check license
    if(personData[LICENSE_INDEX].length !== 6) invalidCellsIndexes.push(LICENSE_INDEX);
    return invalidCellsIndexes;
}