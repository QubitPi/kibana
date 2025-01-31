/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';
import type { AutocompleteCommandDefinition } from '../types';

export const buildPoliciesDefinitions = (
  policies: Array<{ name: string; indices: string[] }>
): AutocompleteCommandDefinition[] =>
  policies.map(({ name: label, indices }) => ({
    label,
    insertText: label,
    kind: 5,
    detail: i18n.translate('monaco.esql.autocomplete.policyDefinition', {
      defaultMessage: `Policy defined on {count, plural, one {index} other {indices}}: {indices}`,
      values: {
        count: indices.length,
        indices: indices.join(', '),
      },
    }),
    sortText: 'D',
  }));

export const buildFieldsDefinitions = (fields: string[]): AutocompleteCommandDefinition[] =>
  fields.map((label) => ({
    label,
    insertText: label,
    kind: 4,
    detail: i18n.translate('monaco.esql.autocomplete.fieldDefinition', {
      defaultMessage: `Field specified by the input table`,
    }),
    sortText: 'D',
  }));

export const buildNoPoliciesAvailableDefinition = (): AutocompleteCommandDefinition[] => [
  {
    label: i18n.translate('monaco.esql.autocomplete.noPoliciesLabel', {
      defaultMessage: 'No available policy',
    }),
    insertText: '',
    kind: 26,
    detail: i18n.translate('monaco.esql.autocomplete.noPoliciesLabelsFound', {
      defaultMessage: 'No policies found',
    }),
    sortText: 'D',
  },
];

export const buildMatchingFieldsDefinition = (
  matchingField: string,
  fields: string[]
): AutocompleteCommandDefinition[] =>
  fields.map((label) => ({
    label,
    insertText: label,
    kind: 4,
    detail: i18n.translate('monaco.esql.autocomplete.matchingFieldDefinition', {
      defaultMessage: `Use to match on {matchingField} on the policy`,
      values: {
        matchingField,
      },
    }),
    sortText: 'D',
  }));

export const buildNewVarDefinition = (label: string): AutocompleteCommandDefinition => {
  return {
    label,
    insertText: label,
    kind: 21,
    detail: i18n.translate('monaco.esql.autocomplete.newVarDoc', {
      defaultMessage: 'Define a new variable',
    }),
    sortText: 'D',
  };
};

export const buildSourcesDefinitions = (sources: string[]): AutocompleteCommandDefinition[] =>
  sources.map((label) => ({
    label,
    insertText: label,
    kind: 21,
    detail: i18n.translate('monaco.esql.autocomplete.sourceDefinition', {
      defaultMessage: `Input table`,
    }),
    sortText: 'A',
  }));

export const buildConstantsDefinitions = (
  userConstants: string[],
  detail?: string
): AutocompleteCommandDefinition[] =>
  userConstants.map((label) => ({
    label,
    insertText: label,
    kind: 14,
    detail:
      detail ??
      i18n.translate('monaco.esql.autocomplete.constantDefinition', {
        defaultMessage: `User defined variable`,
      }),
    sortText: 'A',
  }));
