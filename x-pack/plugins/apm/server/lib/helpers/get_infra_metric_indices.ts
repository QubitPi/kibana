/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { SavedObjectsClientContract } from '@kbn/core/server';
import { APMRouteHandlerResources } from '../../routes/apm_routes/register_apm_server_routes';

export async function getInfraMetricIndices({
  infraPlugin,
  savedObjectsClient,
}: {
  infraPlugin: Required<APMRouteHandlerResources['plugins']['infra']>;
  savedObjectsClient: SavedObjectsClientContract;
}): Promise<string> {
  if (!infraPlugin) {
    throw new Error('Infra Plugin needs to be setup');
  }
  const infra = await infraPlugin.start();
  const infraMetricIndices = await infra.getMetricIndices(savedObjectsClient);

  return infraMetricIndices;
}
