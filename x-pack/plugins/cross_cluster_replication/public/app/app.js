/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import chrome from 'ui/chrome';
import { fatalError } from 'ui/notify';
import { i18n } from '@kbn/i18n';
import { injectI18n, FormattedMessage } from '@kbn/i18n/react';

import {
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiPageContent,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';

import { BASE_PATH } from '../../common/constants';
import { SectionUnauthorized, SectionError } from './components';
import routing from './services/routing';
import { isAvailable, isActive, getReason } from './services/license';
import { loadPermissions } from './services/api';

import {
  CrossClusterReplicationHome,
  AutoFollowPatternAdd,
  AutoFollowPatternEdit,
  FollowerIndexAdd,
  FollowerIndexEdit,
} from './sections';

export const App = injectI18n(
  class extends Component {
    static contextTypes = {
      router: PropTypes.shape({
        history: PropTypes.shape({
          push: PropTypes.func.isRequired,
          createHref: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }

    constructor(...args) {
      super(...args);
      this.registerRouter();

      this.state = {
        isFetchingPermissions: false,
        fetchPermissionError: undefined,
        hasPermission: false,
        missingClusterPrivileges: [],
      };
    }

    componentWillMount() {
      routing.userHasLeftApp = false;
    }

    componentDidMount() {
      this.checkPermissions();
    }

    componentWillUnmount() {
      routing.userHasLeftApp = true;
    }

    async checkPermissions() {
      this.setState({
        isFetchingPermissions: true,
      });

      try {
        const { hasPermission, missingClusterPrivileges } = await loadPermissions();

        this.setState({
          isFetchingPermissions: false,
          hasPermission,
          missingClusterPrivileges,
        });
      } catch (error) {
        // Expect an error in the shape provided by Angular's $http service.
        if (error && error.data) {
          return this.setState({
            isFetchingPermissions: false,
            fetchPermissionError: error,
          });
        }

        // This error isn't an HTTP error, so let the fatal error screen tell the user something
        // unexpected happened.
        fatalError(error, i18n.translate('xpack.crossClusterReplication.app.checkPermissionsFatalErrorTitle', {
          defaultMessage: 'Cross Cluster Replication app',
        }));
      }
    }

    registerRouter() {
      const { router } = this.context;
      routing.reactRouter = router;
    }

    render() {
      const {
        isFetchingPermissions,
        fetchPermissionError,
        hasPermission,
        missingClusterPrivileges,
      } = this.state;

      if (!isAvailable() || !isActive()) {
        return (
          <SectionUnauthorized
            title={(
              <FormattedMessage
                id="xpack.crossClusterReplication.app.licenseErrorTitle"
                defaultMessage="License error"
              />
            )}
          >
            {getReason()}
            {' '}
            <a href={chrome.addBasePath('/app/kibana#/management/elasticsearch/license_management/home')}>
              <FormattedMessage
                id="xpack.crossClusterReplication.app.licenseErrorLinkText"
                defaultMessage="Manage your license."
              />
            </a>
          </SectionUnauthorized>
        );
      }

      if (isFetchingPermissions) {
        return (
          <EuiPageContent horizontalPosition="center">
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiLoadingSpinner size="xl"/>
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiTitle>
                  <h2>
                    <FormattedMessage
                      id="xpack.crossClusterReplication.app.permissionCheckTitle"
                      defaultMessage="Checking permissions..."
                    />
                  </h2>
                </EuiTitle>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageContent>
        );
      }

      if (fetchPermissionError) {
        return (
          <Fragment>
            <SectionError
              title={(
                <FormattedMessage
                  id="xpack.crossClusterReplication.app.permissionCheckErrorTitle"
                  defaultMessage="Error checking permissions"
                />
              )}
              error={fetchPermissionError}
            />

            <EuiSpacer size="m" />
          </Fragment>
        );
      }

      if (!hasPermission) {
        return (
          <EuiPageContent horizontalPosition="center">
            <EuiEmptyPrompt
              iconType="securityApp"
              iconColor={null}
              title={
                <h2>
                  <FormattedMessage
                    id="xpack.crossClusterReplication.app.deniedPermissionTitle"
                    defaultMessage="You're missing cluster privileges"
                  />
                </h2>}
              body={
                <p>
                  <FormattedMessage
                    id="xpack.crossClusterReplication.app.deniedPermissionDescription"
                    defaultMessage="To use Cross Cluster Replication, you must have {clusterPrivileges,
                      plural, one {this cluster privilege} other {these cluster privileges}}: {clusterPrivileges}."
                    values={{ clusterPrivileges: missingClusterPrivileges.join(', ') }}
                  />
                </p>}
            />
          </EuiPageContent>
        );
      }

      return (
        <div>
          <Switch>
            <Redirect exact from={`${BASE_PATH}`} to={`${BASE_PATH}/follower_indices`} />
            <Route exact path={`${BASE_PATH}/auto_follow_patterns/add`} component={AutoFollowPatternAdd} />
            <Route exact path={`${BASE_PATH}/auto_follow_patterns/edit/:id`} component={AutoFollowPatternEdit} />
            <Route exact path={`${BASE_PATH}/follower_indices/add`} component={FollowerIndexAdd} />
            <Route exact path={`${BASE_PATH}/follower_indices/edit/:id`} component={FollowerIndexEdit} />
            <Route exact path={`${BASE_PATH}/:section`} component={CrossClusterReplicationHome} />
          </Switch>
        </div>
      );
    }
  }
);
