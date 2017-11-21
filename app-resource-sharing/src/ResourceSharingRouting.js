import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import ResourceSharingRequests from './ResourceSharingRequests';
import ResourceSharingAdmin from './ResourceSharingAdmin';

class ResourceSharingRouting extends React.Component {

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
//    updateApp();
  }
  
  updateApp() {
    this.connectedApp = this.props.stripes.hasPerm('resource-sharing.admin') ?
        this.props.stripes.connect(ResourceSharingAdmin) : this.props.stripes.connect(ResourceSharingRequests);
  }

  NoMatch() {
    return (
      <div>
        <h2>Uh-oh!</h2>
        <p>How did you get to <tt>{this.props.location.pathname}</tt>?</p>
      </div>
    );
  }

  render() {

    this.updateApp();
    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={() => <this.connectedApp stripes={this.props.stripes} {...this.props} />}
        />
        <Route component={() => { this.NoMatch(); }} />
      </Switch>
    );
  }
}

export default ResourceSharingRouting;
