import { Model } from "objection";

// Check whether relationExpression is valid (does not contain invalid relation names)
export const checkRelationExpression = (M: any & Model, relationExpression?: string) => {
  if (relationExpression && relationExpression.length > 0) {
    let expression = relationExpression;

    if (expression.startsWith("[")) {
      if (!expression.endsWith("]")) {
        return false;
      }
    }
    if (expression.endsWith("]")) {
      if (!expression.startsWith("[")) {
        return false;
      }
      expression = expression.slice(1, -1);
    }

    const relations = new Set(Object.keys(M.relationMappings));

    for (const relation of expression.split(",")) {
      if (!relations.has(relation.trim())) {
        return false;
      }
    }
  }

  return true;
};
