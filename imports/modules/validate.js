import {$} from 'meteor/jquery';
import 'jquery-validation';

export default (form, options) => $(form).validate(options);
