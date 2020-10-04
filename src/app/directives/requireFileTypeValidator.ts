import {FormControl} from '@angular/forms';
export function requiredFileType(type: string[]) {
  return function(control: FormControl) {
    const file = control.value;
    let existValue = false;
    if (file) {

      const typeRealFile = file.files[0].type;

      for (let i = 0; i < type.length; i++) {
        const typeFile = type[i].toUpperCase();
        switch (typeFile) {
          case 'PDF':
            if (typeRealFile === 'application/pdf') {
              existValue = true;
            }
            break;
        }
      }
      if (existValue === true) {
        return null;
      } else {
        return {
          requiredFileType: true
        };
      }
    }
    return null;
  };
}
