import {ContextValueDescription} from '../contextvalues.types';


export const updateContextValues = (currentContextValues: any, cube: string , cvToUpdate: ContextValueDescription) => {

  console.log(currentContextValues);
  if (cvToUpdate.type === 'INTEGER') {
    currentContextValues[cube][cvToUpdate.name] = parseInt(cvToUpdate.currentValue);
  } else if (cvToUpdate.type === 'DOUBLE') {
    currentContextValues[cube][cvToUpdate.name] = parseFloat(cvToUpdate.currentValue);
  } else if (cvToUpdate.type === 'BOOL') {
    if (cvToUpdate.currentValue === 'true') {
      currentContextValues[cube][cvToUpdate.name] = true;
    } else {
      currentContextValues[cube][cvToUpdate.name] = false;
    }
  } else if(cvToUpdate.type.startsWith("ENUM(")) {
    let possibleValues = cvToUpdate.type.split("(")[1].slice(0,-1).split(",");
    if (!possibleValues.includes(cvToUpdate.currentValue)) {
      console.error(`impossible value for Context value ${cvToUpdate.currentValue}. Value must be one of ${possibleValues.join(",")}`)
    } else {
      currentContextValues[cube][cvToUpdate.name] = cvToUpdate.currentValue;
    }

  }else {
    console.error('could not process context value of type ', cvToUpdate.type);
  }

  return currentContextValues;
}