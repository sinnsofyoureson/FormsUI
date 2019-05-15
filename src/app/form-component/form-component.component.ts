import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {
  Country,
  UsernameValidator,
  PasswordValidator,
  ParentErrorStateMatcher,
  PhoneValidator
} from '../validators';

@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.scss']
})
export class FormComponentComponent implements OnInit {

  userDetailsForm: FormGroup;
  accountDetailsForm: FormGroup;

  matching_passwords_group: FormGroup;
  country_phone_group: FormGroup;

  parentErrorStateMatcher = new ParentErrorStateMatcher();

  genders = [
    "Male",
    "Female",
    "Other"
  ];

  countries = [
    new Country('UY', 'Uruguay'),
    new Country('RU', 'Russia'),
    new Country('US', 'United States'),
    new Country('AR', 'Argentina')
  ];

  validation_messages = {
    'fullname': [
      { type: 'required', message: 'Full name is required' }
    ],
    'bio': [
      { type: 'maxlength', message: 'Bio cannot be more than 256 characters long' },
    ],
    'gender': [
      { type: 'required', message: 'Please select your gender' },
    ],
    'birthday': [
      { type: 'required', message: 'Please insert your birthday' },
    ],
    'phone': [
      { type: 'required', message: 'Phone is required' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ]
  };

  /*  I forgot to mention that we have defined our error messages also in our 
  src/app/form-component/form.component.ts file. Each input can have more than one validation 
  that’s why we created an array of validation messages for each form input.
      For example for our Account Details form we have the following error messages:  */
  account_validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      { type: 'validUsername', message: 'Your username has already been taken' }
    ],
    'email': [
      { type: 'required', message: 'Email is required'},
      { type: 'pattern', message: 'Enter a valid email'}
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions' }
    ]
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForms();
  }

  createForms() {
    /* matching passwords validation
      Then, in the typescript file where we have defined our form (form.ts), we should import 
    our custom password validator and add the other simple validations: password no shorter 
    than 5 chars, and with letters and numbers.  */
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.maxLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    /* country & phone validation
        Then, in the typescript file where we have defined our form (form.ts), we should import 
    our custom validator. In form.ts we have a FormGroup with the phone input and the country 
    selector so when the value changes in one of these fields the directive checks if both are correct. */
    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', {
      validators: Validators.compose([
        Validators.required,
        PhoneValidator.validCountryPhone(country)
      ])
    });

    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });

    // user details form validations
    // We will define our User Details Form with a FormGroup. To create the FormGroup we will 
    // use an instance of the FormBuilder. Check the following typescript code to see how you 
    // can achieve this. Note that for the full name and bio we preloaded some default data.
    this.userDetailsForm = this.fb.group({
      fullname: [ 'Homero Simpson', Validators.required ],
      bio: ["Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s", Validators.maxLength(256)],
      birthday: ['', Validators.required],
      gender: new FormControl(this.genders[0], Validators.required),
      country_phone: this.country_phone_group
    });

    // user links form validations
    /* Then, in the typescript file where we have defined our form, we should import our custom validator.
        We used minLength(5) and maxLength(25) to ensure the minimum and maximum length of the value. We 
    also used required to avoid this input to be left empty, and ng-pattern="^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$" 
    to force a correct input value containing letters and numbers.  */
    this.accountDetailsForm = this.fb.group({
      username: new FormControl('', Validators.compose([
        UsernameValidator.validUsername,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required
      ])),

      /* To validate the email we have to use a pattern type validator. The
      email validation pattern we are going to use is ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$
          So we have to create our FormGroup like we explained above and create
      a FormControl to define our email form control with its validations.*/
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      matching_passwords: this.matching_passwords_group,
      terms: new FormControl(false, Validators.pattern('true'))
    })
  }

  onSubmitAccountDetails(value){
    console.log(value);
  }

  onSubmitUserDetails(value){
    console.log(value);
  }

}
