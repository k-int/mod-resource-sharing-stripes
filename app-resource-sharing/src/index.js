
import React, { Component, PropTypes } from 'react'; // eslint-disable-line
import { Switch, Route } from 'react-router-dom'; // eslint-disable-line
import ResourceSharing from './ResourceSharing';

class ResourceSharingRouting extends Component {

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
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
    const pathname = this.props.match.path;
    return (
      <Switch>
        <Route
          path={`${pathname}`}
          render={props => <ResourceSharing />}
        />
        <Route component={() => { this.NoMatch(); }} />
      </Switch>
    );
  }
}

export default ResourceSharingRouting;
