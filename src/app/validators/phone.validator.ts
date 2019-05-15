/*  The goal of this custom angular validator is to validate that a phone number is valid for a certain country.
    We will use Google Libphonenumber JavaScript library for parsing, formatting, and validating international 
phone numbers. To install it you should run:
    npm install --save-prod google-libphonenumber
    We added the following code in a new phone.validator.ts file to create our custom phone validator:
    The phone directive controls that the value from the phone number input is correct for the selected country. */

import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as libphonenumber from 'google-libphonenumber';

export class PhoneValidator {

    // Inspired on: https://github.com/yuyang041060120/ng2-validation/blob/master/src/equal-to/validator.ts
    static validCountryPhone = (countryControl: AbstractControl): ValidatorFn => {
        let subscribe = false;
        return (phoneControl: AbstractControl): {[key: string]: boolean} => {

            if (!subscribe) {
                subscribe = true;
                countryControl.valueChanges.subscribe(() => {
                    phoneControl.updateValueAndValidity();
                });
            }

            if (phoneControl.value !== '') {
                try {

                    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
                    const phoneNumber = '' + phoneControl.value + '';
                    const region = countryControl.value;
                    const pNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, region.iso);
                    const isValidNumber = phoneUtil.isValidNumber(pNumber);

                    if (isValidNumber) {
                        return undefined;
                    }
                } catch (e) {
                    console.log(e);
                    return {
                        validCountryPhone: true
                    };
                }

                return {
                    validCountryPhone: true
                };
            } else {
                return undefined;
            }
        };
    }
}