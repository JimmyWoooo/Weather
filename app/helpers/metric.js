import { helper } from '@ember/component/helper';

function metric(params){
  let unit = params;
  if(unit == 'celcius' || unit == null){
    return 'm/s';
  }
  else
  return 'Mph';
}

export default helper(metric);