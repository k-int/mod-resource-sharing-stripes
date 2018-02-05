import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import ResourceSharingRequests from './ResourceSharingRequests';
import ResourceSharingRequest from './ResourceSharingRequest';
import 'bootstrap/dist/css/bootstrap.css';
class ResourceSharingRouting extends Component {

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      epics: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    
    // Add the epic.
    // Add epic for component.
    props.stripes.epics.add(ResourceSharingRequest.rssRequestEpics)
  }
  
  updateApp() {
    this.connectedApp = this.props.stripes.connect(ResourceSharingRequests);
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
