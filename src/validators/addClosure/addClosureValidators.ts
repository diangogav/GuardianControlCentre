import { FormControl } from "@angular/forms";


export class AddClosureValidators{
    
  static checkDateActualStartClosure(date: FormControl,) {

    var day;
    var month;
    var year;
    var actualDay;
    var actualMonth;
    var actualYear;

    const value: string = date.value;

    var startClosureDate = value.split('-');
    day = startClosureDate[2];
    month = startClosureDate[1];
    year = startClosureDate[0];

    var actualDate = new Date();
 
    actualYear = actualDate.getFullYear();
    actualMonth = actualDate.getMonth() + 1;
    actualDay = actualDate.getDate();

  if (year < actualYear){
    return{
      'dateActualStartClosure': true
    }
  }
  else{
      if (year == actualYear && month < actualMonth){
        return{
          'dateActualStartClosure': true
        }
      }
      else{
          if (year == actualYear && month == actualMonth && day < actualDay){
            return{
              'dateActualStartClosure': true
            }
          }
      }
  }
  return null;
  }


  static checkHourActualStartClosure(time: FormControl){

    
    var hour;
    var minutes;
    var actualHour;
    var actualMinutes;

    const value: string = time.value;

    var startClosureHour = value.split(':');
    hour = startClosureHour[0];
    minutes = startClosureHour[1];

    var actualDate = new Date();
 
    actualHour = actualDate.getHours();
    actualMinutes = actualDate.getMinutes();

    console.log("hour",hour);
    console.log("minutes",minutes);
    console.log("actualHour",actualHour);
    console.log("actualMinutes",actualMinutes);

  if (hour < actualHour){
    return{
      'time': true
    }
  }
  else{
      if (hour == actualHour && minutes < actualMinutes){
        return{
          'time': true
        }
      }
  }
  return null;
    
  }

}
