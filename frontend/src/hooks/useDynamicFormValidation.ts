import * as yup from "yup";

// This function creates the dynamic Yup schema, thanks to vijayranghar (https://github.com/jquense/yup/issues/559)
export const useCustomFieldsDynamicSchema = (schema, config) => {
  const { name, validationType, validations = [] } = config;
  if (!yup[validationType]) {
    return schema;
  }
  let validator = yup[validationType]();
  validations.forEach((validation) => {
    const { params, type } = validation;
    if (!validator[type]) {
      return;
    }
    validator = validator[type](...params);
  });
  schema[name] = validator;
  return schema;
};

export const useCustomFieldsExtendValidation = (
  recordType: string,
  customFields: any
) => {
  if (!recordType.length) return {};

  return customFields[recordType].map((customField) => {
    switch (customField.type) {
      case "text":
        return {
          ...customField,
          validationType: "string",
          validations: [
            {
              type: customField.required ? "required" : "nullable",
              params: ["Required"],
            },
            {
              type: "trim",
              params: [],
            },
            {
              type: customField.required ? "min" : null,
              params: [2, "Minimalal length is 2 characters."],
            },
          ],
        };
      default:
        return customField;
    }
  });
};
