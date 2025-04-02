type ConversionOptions = {
    /** Local error code equivalent */
    code: string;
    /** Regular expression to extract the constraint message */
    constraintsRegexp?: RegExp | null;
}

type ConversionFromClassValidatorMap =  { [key: string]: ConversionOptions };


/**
 * A table conversion from class-validator to common-exception
 */
export const conversionFromClassValidatorMap: ConversionFromClassValidatorMap = {
    // Array
    arrayContains: {
        code: 'ERR_VAL_ARRAY_NOT_CONTAINS',
        constraintsRegexp: /must contain (.*?) values/
    },
    arrayMaxSize: {
        code: 'ERR_VAL_LENGTH_MAX',
        constraintsRegexp: /no more than (\d+) elements/
    },
    arrayMinSize: {
        code: 'ERR_VAL_LENGTH_MIN',
        constraintsRegexp: /at least (\d+) elements/
    },
    arrayNotContains: {
        code: 'ERR_VAL_ARRAY_SHOULD_NOT_CONTAINS',
        constraintsRegexp: /should not contain (.*?) values/
    },
    arrayEmpty: {
        code: 'ERR_VAL_EMPTY',
    },
    arrayUnique: {
        code: 'ERR_VAL_ARRAY_NOT_UNIQUE',
    },

    // common
    isNotEmpty: {
        code: 'ERR_VAL_EMPTY',
    },

    // string
    contains: {
        code: 'ERR_VAL_TEXT_NOT_CONTAINS',
        constraintsRegexp: /must contain a (.*?) string/
    },
    isAlpha: {
        code: 'ERR_VAL_TEXT_NOT_ALPHA',
    },
    isAlphanumeric: {
        code: 'ERR_VAL_TEXT_NOT_ALPHANUMERIC',
    },
    isAscii: {
        code: 'ERR_VAL_TEXT_NOT_ASCII',
    },
    isBIC: {
        code: 'ERR_VAL_TEXT_NOT_BIC',
    },
    isBase32: {
        code: 'ERR_VAL_TEXT_NOT_BASE32',
    },
    isBase64: {
        code: 'ERR_VAL_TEXT_NOT_BASE64',
    },
    isBooleanString: {
        code: 'ERR_VAL_TEXT_NOT_BOOLEAN_STRING',
    },
    isBtcAddress: {
        code: 'ERR_VAL_TEXT_NOT_BTC_ADDRESS',
    },
    isByteLength: {
        code: 'ERR_VAL_TEXT_NOT_BYTE_LENGTH',
    },
    isCreditCard: {
        code: 'ERR_VAL_TEXT_NOT_CREDIT_CARD',
    },
    isCurrency: {
        code: 'ERR_VAL_TEXT_NOT_CURRENCY',
    },
    isDataURI: {
        code: 'ERR_VAL_TEXT_NOT_DATA_URI',
    },
    isDateString: {
        code: 'ERR_VAL_TEXT_NOT_DATE_STRING',
    },
    isDecimal: {
        code: 'ERR_VAL_TEXT_NOT_DECIMAL',
    },
    isEAN: {
        code: 'ERR_VAL_TEXT_NOT_EAN',
    },
    isEmail: {
        code: 'ERR_VAL_TEXT_NOT_EMAIL',
    },
    isEthereumAddress: {
        code: 'ERR_VAL_TEXT_NOT_ETHEREUM_ADDRESS',
    },
    isFQDN: {
        code: 'ERR_VAL_TEXT_NOT_FQDN',
    },
    isFirebasePushId: {
        code: 'ERR_VAL_TEXT_NOT_FIREBASE_PUSH_ID',
    },
    isFullWidth: {
        code: 'ERR_VAL_TEXT_NOT_FULL_WIDTH',
    },
    isHSL: {
        code: 'ERR_VAL_TEXT_NOT_HSL',
    },
    isHalfWidth: {
        code: 'ERR_VAL_TEXT_NOT_HALF_WIDTH',
    },
    isHash: {
        code: 'ERR_VAL_TEXT_NOT_HASH',
    },
    isHexColor: {
        code: 'ERR_VAL_TEXT_NOT_HEX_COLOR',
    },
    isHexadecimal: {
        code: 'ERR_VAL_TEXT_NOT_HEXADECIMAL',
    },
    isIBAN: {
        code: 'ERR_VAL_TEXT_NOT_IBAN',
    },
    isIP: {
        code: 'ERR_VAL_TEXT_NOT_IP',
    },
    isISBN: {
        code: 'ERR_VAL_TEXT_NOT_ISBN',
    },
    isISIN: {
        code: 'ERR_VAL_TEXT_NOT_ISIN',
    },
    isISO31661Alpha2: {
        code: 'ERR_VAL_TEXT_NOT_ISO31661_ALPHA2',
    },
    isISO31661Alpha3: {
        code: 'ERR_VAL_TEXT_NOT_ISO31661_ALPHA3',
    },
    isISO8601: {
        code: 'ERR_VAL_TEXT_NOT_ISO8601',
    },
    isISRC: {
        code: 'ERR_VAL_TEXT_NOT_ISRC',
    },
    isISSN: {
        code: 'ERR_VAL_TEXT_NOT_ISSN',
    },
    isIdentityCard: {
        code: 'ERR_VAL_TEXT_NOT_IDENTITY_CARD',
    },
    isJSON: {
        code: 'ERR_VAL_TEXT_NOT_JSON',
    },
    isJWT: {
        code: 'ERR_VAL_TEXT_NOT_JWT',
    },
    isLocale: {
        code: 'ERR_VAL_TEXT_NOT_LOCALE',
    },
    isLowercase: {
        code: 'ERR_VAL_TEXT_NOT_LOWERCASE',
    },
    isMacAddress: {
        code: 'ERR_VAL_TEXT_NOT_MAC_ADDRESS',
    },
    isMagnetURI: {
        code: 'ERR_VAL_TEXT_NOT_MAGNET_URI',
    },
    isMilitaryTime: {
        code: 'ERR_VAL_TEXT_NOT_MILITARY_TIME',
    },
    isMimeType: {
        code: 'ERR_VAL_TEXT_NOT_MIME_TYPE',
    },
    isMobilePhone: {
        code: 'ERR_VAL_TEXT_NOT_MOBILE_PHONE',
    },
    isMongoId: {
        code: 'ERR_VAL_TEXT_NOT_MONGO_ID',
    },
    isMultibyte: {
        code: 'ERR_VAL_TEXT_NOT_MULTIBYTE',
    },
    isNumberString: {
        code: 'ERR_VAL_TEXT_NOT_NUMBER_STRING',
    },
    isOctal: {
        code: 'ERR_VAL_TEXT_NOT_OCTAL',
    },
    isPassportNumber: {
        code: 'ERR_VAL_TEXT_NOT_PASSPORT_NUMBER',
    },
    isPhoneNumber: {
        code: 'ERR_VAL_TEXT_NOT_PHONE_NUMBER',
    },
    isPort: {
        code: 'ERR_VAL_TEXT_NOT_PORT',
    },
    isPostalCode: {
        code: 'ERR_VAL_TEXT_NOT_POSTAL_CODE',
    },
    isRFC3339: {
        code: 'ERR_VAL_TEXT_NOT_RFC3339',
    },
    isRgbColor: {
        code: 'ERR_VAL_TEXT_NOT_RGB_COLOR',
    },
    isSemVer: {
        code: 'ERR_VAL_TEXT_NOT_SEM_VER',
    },
    isStrongPassword: {
        code: 'ERR_VAL_TEXT_NOT_STRONG_PASSWORD',
    },
    isSurrogatePair: {
        code: 'ERR_VAL_TEXT_NOT_SURROGATE_PAIR',
    },
    isTimeZone: {
        code: 'ERR_VAL_TEXT_NOT_TIME_ZONE',
    },
    isUUID: {
        code: 'ERR_VAL_TEXT_NOT_UUID',
    },
    isUppercase: {
        code: 'ERR_VAL_TEXT_NOT_UPPERCASE',
    },
    isUrl: {
        code: 'ERR_VAL_TEXT_NOT_URL',
    },
    isVariableWidth: {
        code: 'ERR_VAL_TEXT_NOT_VARIABLE_WIDTH',
    },
    length: {
        code: 'ERR_VAL_LENGTH',
        constraintsRegexp: /equal to (\d+) characters/
    },
    matches: {
        code: 'ERR_VAL_TEXT_NOT_MATCHES',
        constraintsRegexp: /must match (.*) regular/
    },
    min: {
        code: 'ERR_VAL_LENGTH_MIN',
        constraintsRegexp: /have at least (\d+) characters/
    },
    maxLength: {
        code: 'ERR_VAL_LENGTH_MAX',
        constraintsRegexp: /shorter than or equal to (\d+)/
    },
    minLength: {
        code: 'ERR_VAL_LENGTH_MIN',
        constraintsRegexp: /longer than or equal to (\d+)/
    },
    notContains: {
        code: 'ERR_VAL_TEXT_SHOULD_NOT_CONTAINS',
        constraintsRegexp: /should not contain a (.*?) string/
    },

    // types
    isString: {
        code: 'ERR_VAL_TYPE_NOT_STRING',
    }
};
