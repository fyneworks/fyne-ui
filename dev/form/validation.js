//import { string, object } from 'yup'; // for only what you need
import * as Yup from 'yup'; // for only what you need

// https://github.com/abhisekp/yup-phone
//require('@fyne/yup-phone');
// urgh, not working

const phoneRegExp = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/gi

//TODO: implement google's phone validation
//      must be async 
//      https://github.com/catamphetamine/libphonenumber-js
Yup.addMethod(Yup.string, "phoneish", function({...args}) {
    const { message = "Invalid phone number" } = args;
    return this.test("phone-ish", message, function(value) {
        const { path, createError } = this;
        //TODO: const { country } = args;
        const validNumber = value && value.match(phoneRegExp);
        //TODO: const validCountry = !!country || value.match(phoneRegExp);
        const valid = validNumber;//TODO: && validCountry;
        return valid || createError({ path, message });
    });
});

export const validationSchema = Yup.object({
    
    name: Yup.string("Enter a name")
        .required("Name is required")
    ,
    
    email: Yup.string("Enter your email")
        .email("Enter a valid email")
        .required("Email is required")
    ,
    
    phone: Yup.string("Enter your phone number")
        .phoneish("Phone number is not valid") 
        //.phone("Enter a valid phone number") // real full actual validation
        .required("Phone number is required")
    ,
    
    //message: Yup.string("Enter your message")
    //    .required("A message is required")
    //,
    
    date: Yup.string("Please select date")
        .required("A message is required")
    ,
    
    //password: string("")
    //    .min(8, "Password must contain at least 8 characters")
    //    .required("Enter your password")
    //,
    //
    //confirmPassword: string("Enter your password")
    //    .required("Confirm your password")
    //    .oneOf([ref("password")], "Password does not match")
    //,

})

