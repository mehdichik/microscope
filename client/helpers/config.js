if (!Accounts.ui){
    Accounts.ui = {};
}

if (!Accounts.ui._options) {
    Accounts.ui._options = {
        extraSignupFields: [],
        requestPermissions: {},
        requestOfflineToken: {},
        forceApprovalPrompt: {},
        forceEmailLowercase: false,
        forceUsernameLowercase: false,
        forcePasswordLowercase: false,
        
        
    };
}

Accounts.ui.navigate = function (route, hash) {
    // if router is iron-router
    if (window.Router && _.isFunction(Router.go)) {
        Router.go(route, hash);
    }
}

Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'name',
        fieldLabel: 'Full Name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your first name");
            return false;
          } else {
            return true;
          }
        }
    },  
    {
        fieldName: 'email',
        fieldLabel: 'Email',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your email");
            return false;
          } else {
            return true;
          }
        }
    },{
        fieldName: 'gender',
        showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
        fieldLabel: 'Gender',
        inputType: 'radio',
        radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
        data: [{                    // Array of radio options, all properties are required
            id: 1,                  // id suffix of the radio element
            label: 'Male',          // label for the radio element
            value: 'm'              // value of the radio element, this will be saved.
          }, {
            id: 2,
            label: 'Female',
            value: 'f',
            checked: 'checked'
        }],
        visible: true
    }, {
        fieldName: 'country',
        fieldLabel: 'Country',
        inputType: 'select',
        showFieldLabel: true,
        empty: 'Please select your country of residence',
        data: [{
            id: 1,
            label: 'Germany',
            value: 'de'
          }, {
            id: 2,
            label: 'Tunisia',
            value: 'tn',
        }],
        visible: true
    }, {
        fieldName: 'terms',
        fieldLabel: 'I accept the terms and conditions',
        inputType: 'checkbox',
        visible: true,
        saveToProfile: false,
        validate: function(value, errorFunction) {
            if (value) {
                return true;
            } else {
                errorFunction('You must accept the terms and conditions.');
                return false;
            }
        }
    }],
});
Accounts.ui.config = function(options) {
    // validate options keys
    var VALID_KEYS = ['onCreate', 'passwordSignupFields', 'extraSignupFields', 'forceEmailLowercase', 'forceUsernameLowercase','forcePasswordLowercase',
    'requestPermissions', 'requestOfflineToken', 'forceApprovalPrompt'];

    _.each(_.keys(options), function(key) {
        if (!_.contains(VALID_KEYS, key)){
            throw new Error("Accounts.ui.config: Invalid key: " + key);
        }
    });

    if (options.onCreate && typeof options.onCreate === 'function') {
        Accounts.ui._options.onCreate = options.onCreate;
    } else if (! options.onCreate ) {
        //ignore and skip
    } else {
        throw new Error("Accounts.ui.config: Value for 'onCreate' must be a" +
                " function");
    }

    options.extraSignupFields = options.extraSignupFields || [];

    // deal with `passwordSignupFields`
    if (options.passwordSignupFields) {
        if (_.contains([
            "USERNAME_AND_EMAIL_CONFIRM",
            "USERNAME_AND_EMAIL",
            "USERNAME_AND_OPTIONAL_EMAIL",
            "USERNAME_ONLY",
            "EMAIL_ONLY"
        ], options.passwordSignupFields)) {
            if (Accounts.ui._options.passwordSignupFields){
                throw new Error("Accounts.ui.config: Can't set `passwordSignupFields` more than once");
            } else {
                Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;
            }
        } else {
            throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);
        }
    }

    Accounts.ui._options.forceEmailLowercase = options.forceEmailLowercase;
    Accounts.ui._options.forceUsernameLowercase = options.forceUsernameLowercase;
    Accounts.ui._options.forcePasswordLowercase = options.forcePasswordLowercase;

    // deal with `requestPermissions`
    if (options.requestPermissions) {
        _.each(options.requestPermissions, function(scope, service) {
            if (Accounts.ui._options.requestPermissions[service]) {
                throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);
            } else if (!(scope instanceof Array)) {
                throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");
            } else {
                Accounts.ui._options.requestPermissions[service] = scope;
            }
        });
    }
    if (typeof options.extraSignupFields !== 'object' || !options.extraSignupFields instanceof Array) {
        throw new Error("Accounts.ui.config: `extraSignupFields` must be an array.");
    } else {
        if (options.extraSignupFields) {
            _.each(options.extraSignupFields, function(field, index) {
                if (!field.fieldName || !field.fieldLabel){
                    throw new Error("Accounts.ui.config: `extraSignupFields` objects must have `fieldName` and `fieldLabel` attributes.");
                }
                if (typeof field.visible === 'undefined'){
                    field.visible = true;
                }
                Accounts.ui._options.extraSignupFields[index] = field;
            });
        }
    }

    // deal with `requestOfflineToken`
    if (options.requestOfflineToken) {
        _.each(options.requestOfflineToken, function (value, service) {
            if (service !== 'google'){
                throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");
            }
            if (Accounts.ui._options.requestOfflineToken[service]) {
                throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);
            } else {
                Accounts.ui._options.requestOfflineToken[service] = value;
            }
        });
    }

    // deal with `forceApprovalPrompt`
    if (options.forceApprovalPrompt) {
        _.each(options.forceApprovalPrompt, function (value, service) {
            if (service !== 'google'){
                throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");
            }
            if (Accounts.ui._options.forceApprovalPrompt[service]) {
                throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);
            } else {
                Accounts.ui._options.forceApprovalPrompt[service] = value;
            }
        });
    }
};

Accounts.ui._passwordSignupFields = function() {
    return Accounts.ui._options.passwordSignupFields || "USERNAME_ONLY";
};
