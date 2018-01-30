/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import _ from 'lodash';

let action;

const updateUser = (userId, { emailAddress, profile }) => {
  const currentProfile = Meteor.users.findOne({ _id: userId });
  const currentEmail = _.get(currentProfile, 'emails.0.address', '');
  if (currentEmail !== emailAddress) {
    const userWithThisEmail = Accounts.findUserByEmail(emailAddress);
    if (!_.isEmpty(userWithThisEmail) && (_.get(userWithThisEmail, '_id', '') !== userId)) {
      action.reject(`[editProfile.updateUser] Cannot change email address to ${emailAddress}, as a different user has already registered it.`);
    } else {
      Accounts.addEmail(userId, emailAddress);
      Accounts.removeEmail(userId, currentEmail);
    }
  }

  try {
    Meteor.users.update(userId, {
      $set: {
        profile,
      },
    });
  } catch (exception) {
    action.reject(`[editProfile.updateUser] ${exception}`);
  }
};

const editProfile = ({ userId, profile }, promise) => {
  try {
    action = promise;
    updateUser(userId, profile);
    action.resolve();
  } catch (exception) {
    action.reject(`[editProfile.handler] ${exception}`);
  }
};

export default options =>
  new Promise((resolve, reject) =>
    editProfile(options, { resolve, reject }));
