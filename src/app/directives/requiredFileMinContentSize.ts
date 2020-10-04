import {FormControl} from '@angular/forms';
export function requiredFileMinSize(minSizeBytes: number) {
  return function(control: FormControl) {
    const file = control.value;
    let existValue = false;
    if (file) {
      const typeRealSize = file.files[0].size;
      if (typeRealSize >= minSizeBytes) {
        existValue = true;
      }
      if (existValue === true) {
        return null;
      } else {
        return {
          requiredFileMinSize: true
        };
      }
    }
    return null;
  };
}
