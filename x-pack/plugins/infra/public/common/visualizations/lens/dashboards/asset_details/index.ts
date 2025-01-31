/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { hostMetricFlyoutCharts, hostMetricChartsFullPage } from './host/host_metric_charts';
import { hostKPICharts, KPIChartProps } from './host/host_kpi_charts';
import { nginxAccessCharts, nginxStubstatusCharts } from './host/nginx_charts';

export { type KPIChartProps };
export const assetDetailsDashboards = {
  host: { hostMetricFlyoutCharts, hostMetricChartsFullPage, hostKPICharts },
  nginx: { nginxStubstatusCharts, nginxAccessCharts },
};
