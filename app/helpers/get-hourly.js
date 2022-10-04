import { helper } from '@ember/component/helper';

function getHourly(){
  if(unit == 'celcius' || unit == null){
    return '°C';
  }
  else
  return unit;
}

export default helper(getHourly);