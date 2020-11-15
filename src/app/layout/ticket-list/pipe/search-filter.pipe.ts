import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  public transform(value, keys: any, term: string) {
    return value.filter((item) => {
      let exist_flag: Boolean = false;
      keys.forEach(key => {
        if (!exist_flag) {
          exist_flag = false;
          if (item.hasOwnProperty(key)) {
            if (term) {
              const str = item[key];
              exist_flag = str.toLowerCase().includes(term.toLowerCase());
            } else {
              exist_flag = true;
            }
          } else {
            exist_flag = false;
          }
        }
      });
      return exist_flag;
    });
  }

}
