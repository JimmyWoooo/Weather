import { helper } from '@ember/component/helper';

function getUnits(params){
  let unit = params;
  if(unit == 'celcius' || unit == null){
    return '°C';
  }
  else
  return '°F';
}

export default helper(getUnits);