import { FormControl } from '@angular/forms';

export class UsernameValidator {

    /*  Let’s start with the easiest one. The goal of this custom angular validator is to 
    validate if a username is available or not. This simple implementation doesn’t allows 
    the username to be abc123 or 123abc. We don’t have a dedicated backend and database for 
    this angular app example so we hardcoded two fake existing usernames just to show you 
    how to achieve this validator.
        Note that in a real application you will have to check this validator against your 
    username database.
        With fc.value we obtain the value in the username field, so we can control the 
    usernames we won't allow to enter. */
    static validUsername(fc: FormControl) {
        if(fc.value.toLowerCase() === "abc123" || fc.value.toLowerCase () === "123abc"){
            return {
                validUsername: true
            };
        } else {
            return null;
        }
    }
}