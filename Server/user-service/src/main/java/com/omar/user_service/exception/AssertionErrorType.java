package com.omar.user_service.exception;

public enum AssertionErrorType {
    MISSING_MANDATORY_VALUE,
    NOT_AFTER_TIME,
    NOT_BEFORE_TIME,
    NULL_ELEMENT_IN_COLLECTION,
    NUMBER_VALUE_TOO_HIGH,
    NUMBER_VALUE_TOO_LOW,
    STRING_TOO_LONG,
    STRING_TOO_SHORT,
    TOO_MANY_ELEMENTS,
}
