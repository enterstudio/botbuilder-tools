const exception = require('ludown').helperClasses.Exception;
const errCodes = require('../lib/enums/errorCodes');
const VALIDATION_PASS = true;
const reservedNames = require('../lib/enums/reservedNames');
const helpers = require('./helpers');
module.exports = {
    /**
     * All Validators
     */
    /**
     * Validator
     * 
     * @param {string} item input string
     * @returns {boolean} true if validation succeeds
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    isNotNullOrEmpty: function (item) {
        if(item === null || item === undefined || item.trim() == '') throw(new exception(errCodes.INVALID_VARIATION, 'Variation "' + item + '" cannot be null or empty'));
        return VALIDATION_PASS;
    },
    /**
     * Validator
     * 
     * @param {string} item input string
     * @returns {boolean} true if validation succeeds
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    noReferencesToReservedKeywords: function (item) {
        let parsedEntity = helpers.parseEntity(item);
        if(parsedEntity.entities.length === 0) return VALIDATION_PASS;
        parsedEntity.entities.forEach(entity => {
            if(reservedNames.includes(entity)) throw (new exception(errCodes.ENTITY_WITH_RESERVED_KEYWORD, 'Entity "' + entity + '" in variation "' + item + '" has reference to a reserved keyword'));
        });
        return VALIDATION_PASS;
    },
    /**
     * Validator
     * 
     * @param {string} item input string
     * @returns {boolean} true if validation succeeds
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    noNestedTemplateRefernce: function (item) {
        // get template references in item
        let templatesRegExp = new RegExp(/\[(.*?)\]/g);
        let templatesFound = item.match(templatesRegExp);
        if(!templatesFound || templatesFound.length === 0) return VALIDATION_PASS;
        templatesFound.forEach(template => {
            template = template.replace('[').replace(']');
            if(template.includes('[') || template.includes(']')) throw (new exception(errCodes.NESTED_TEMPLATE_REFERENCE, 'Template "' + template + '" in variation "' + item + '" has nested template references.'));
        })
        return VALIDATION_PASS;
    },
    /**
     * Validator
     * 
     * @param {string} item input string
     * @returns {boolean} true if validation succeeds
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    noNestedEntityReferences: function (item) {
        let parsedEntity = helpers.parseEntity(item);
        if(parsedEntity.entities.length === 0) return VALIDATION_PASS;
        parsedEntity.entities.forEach(entity => {
            if(entity.includes('{') || entity.includes('}')) throw (new exception(errCodes.NESTED_ENTITY_REFERENCE, 'Entity "' + entity + '" in variation "' + item + '" has nested entity references.'));
        })
        return VALIDATION_PASS;
    },
    /**
     * Validator 
     * 
     * @param {string} item input string
     * @returns {boolean} true if validation succeeds
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    callBackFunctionsEnclosedInBraces: function (item) {
        // get call back function references in item
        let cbFNames = '';
        reservedNames.forEach(item => {cbFNames += item + '|';});
        let callBackFunctionRegExp = new RegExp(/( |^).*\((.*?)\)/g);
        let callBackFunctions = item.match(callBackFunctionRegExp);
        if(callBackFunctions && callBackFunctions.length !== 0) throw (new exception(errCodes.INVALID_CALLBACK_FUNTION_DEF, 'Call back functions need to be enclosed in {}. Invalid variation "' + item + '"'));
        return VALIDATION_PASS;
    },
    /**
     * Validator 
     * 
     * @param {string} item input string
     * @returns {boolean} true if validation succeeds
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    callBackFunctionInRecognizedList: function (item) {
        // get call back function references in item
        let parsedItems = helpers.parseEntity(item);
        if(parsedItems.callBacks.length === 0) return VALIDATION_PASS;
        parsedItems.callBacks.forEach(cbF => {
            if(!cbF.functionName || cbF.functionName === '' || !reservedNames.includes(cbF.functionName)) throw (new exception(errCodes.INVALID_CALLBACK_FUNTION_NAME, 'Unrecognized call back function reference in variation "' + item + '"'));
        });
        return VALIDATION_PASS;
    },
    /**
     * Validator 
     * 
     * @param {string} item input string
     * @returns {boolean} true if validation succeeds
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    callBackFunctionInConditionIsInRecognizedList: function (item) {
        // get call back function references in item
        let parsedItems = helpers.parseEntity(item);
        if(parsedItems.callBacks.length === 0) return VALIDATION_PASS;
        parsedItems.callBacks.forEach(cbF => {
            if(!cbF.functionName || cbF.functionName === '' || !reservedNames.includes(cbF.functionName)) throw (new exception(errCodes.INVALID_CALLBACK_FUNTION_NAME, 'Unrecognized call back function reference in variation "' + item + '"'));
        });
        return VALIDATION_PASS;
    },
    /**
     * Validator template
     * 
     * @param {string} item input string
     * @returns {boolean} true if validation succeeds
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    noSpacesInTemplateNames: function (item) {
        if(item.includes(' ')) throw (new exception(errCodes.INVALID_SPACE_IN_TEMPLATE_NAME, 'Template name "' + item + '" has one or more spaces in it. Spaces are not allowed in template names'));
        return VALIDATION_PASS;
    },
    /**
     * Validator template
     * 
     * @param {string} item input string
     * @returns {boolean} true if validation succeeds
     * @throws {exception} Throws on errors. exception object includes errCode and text. 
     */
    insertValidatorName: function (item) {
        return VALIDATION_PASS;
    }

};

