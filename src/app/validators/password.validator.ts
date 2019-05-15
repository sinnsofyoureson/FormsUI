/*  Let’s continue with the password form control validation. As mentioned before, we have the 
following requirements for the password input form:
    1) Required
    2) Min length (5)
    3) Must contain letters (both uppercase and lowercase) and numbers
    4) User must re-type password to ensure correctness
    We added the following code in a new password.validator.ts file to create our PasswordValidator 
which validates that the password was re-typed correctly. It’s like a password match validator.  */

import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class ParentErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective| NgForm | null): boolean {
        const isSubmitted = !!(form && form.submitted);
        const controlTouched = !!(control && (control.dirty || control.touched));
        const controlInvalid = !!(control && control.invalid);
        const parentInvalid = !!(control && control.parent && control.parent.invalid && (control.parent.dirty || control.parent.touched));

        return isSubmitted || (controlTouched && (controlInvalid || parentInvalid));
    }
}

export class PasswordValidator {
    // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
    static areEqual(formGroup: FormGroup) {
        let value;
        let valid = true;
        for (let key in formGroup.controls) {
            if (formGroup.controls.hasOwnProperty(key)) {
                let control: FormControl = <FormControl>formGroup.controls[key];

                if (value === undefined) {
                    value = control.value
                } else {
                    if (value !== control.value) {
                        valid = false;
                        break;
                    }
                }
            }
        }

        if (valid) {
            return null;
        }

        return {
            areEqual: true
        };
    }
}