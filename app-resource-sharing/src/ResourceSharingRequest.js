import React from 'react';
import Pane from '@folio/stripes-components/lib/Pane';
import Button from '@folio/stripes-components/lib/Button';
import { Panel, ButtonGroup } from 'react-bootstrap';
import Icon from '@folio/stripes-components/lib/Icon';
import ProtocolRequests from './ProtocolRequests';
import { get } from 'lodash';
import IfPermission from '@folio/stripes-components/lib/IfPermission';

class ResourceSharingRequest extends React.Component {

  static manifest = Object.freeze({
    request: {
      type: 'okapi',
      path: 'requests/:{id}',
      clear: false,
    }
  });

  getRequest() {
    const { resources, match: { params: { id } } } = this.props;
    const theRequest = (resources.request || {}).records || [];
    if (!theRequest || theRequest.length === 0 || !id) return null;
    return theRequest.find(u => u.id === id);
  }
  
  getRotaStatus = () => (
    get(this.getRequest(), 'currentServiceRequest.currentState.code', 'IDOL')
  )
  
  startRota = () => {
    const request = this.getRequest();
    const store = this.props.stripes.store;
    const _me = this;
    const okapi = this.props.okapi;
    if (request) {
      fetch(`${okapi.url}/requests/${request.id}/start`, {
        method: 'GET',
        headers: Object.assign({}, { 'X-Okapi-Tenant': okapi.tenant, 'X-Okapi-Token': okapi.token, 'Content-Type': 'application/json' })
      }).then((response) => {
        if (response.status >= 400) {
          this.props.stripes.logger.log('xhr', 'Failed to start rota.');
        } else {
          // Success. Fire a refresh.
          store.dispatch({type: 'REFRESH', meta: Object.assign({}, ResourceSharingRequest.manifest.request, {target: _me})});
        }
      });
    }
  }
  
  // Epic to auto refresh this widget and update from the server.
  static rssRequestEpics = function(action$) {
    return action$
      .ofType('REFRESH_SUCCESS')
      .filter((action) => (action.meta && action.meta.target && typeof action.meta.target.getRotaStatus === 'function'))
      .debounceTime(100)
      .delay(1000) // Wait 1 second before firing.
      .map(action => {
        
        let status = action.meta.target.getRotaStatus();
        if (status && status !== 'SHIPPED' && status !== 'NOT SUPPLIED') {
          // We should ask the widget to refresh again.
          return { ...action, type: 'REFRESH' };
        } else {
          let req = action.meta.target.getRequest();
          return { type: 'ROTA_FINISHED', reqId: req.id};
        }
      })
    ;
  }

  render() {
    const request = this.getRequest();
    const rotaStatus = this.getRotaStatus();
    const panelHeader = <h4>Fulfilment Details</h4>;
    
    return request ? (
      <Pane id="pane-requestDetails" defaultWidth={this.props.paneWidth} paneTitle="Request Details" dismissible onClose={this.props.onClose}>
        <h2>{request.title} { request.subTitle ? <small className="text-muted">{request.subTitle}</small> : null }</h2>
        <dl className="row">
          <dt className='col-xs-3' >Article Title:</dt> <dd className='col-xs-9' >{request.titleOfArticle}</dd>
          <dt className='col-xs-3' >Type:</dt> <dd className='col-xs-9' >{request.itemType}</dd>
        </dl>
        <Panel collapsible={true} defaultExpanded={true} header={panelHeader} >
          <ProtocolRequests requests={ request.rota } current={ request.currentServiceRequest } />
            {
              rotaStatus == 'IDOL'
            ? 
              <IfPermission perm="resource-sharing.admin">
                <ButtonGroup className="pull-right">
                  <Button onClick={this.startRota} >Start Rota</Button>
                </ButtonGroup>
              </IfPermission>
            : 
              null
            }
        </Panel>
      </Pane>
    ):(
     <Pane id="pane-requestDetails" defaultWidth={this.props.paneWidth} paneTitle="Request Details" dismissible onClose={this.props.onClose}>
       <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
     </Pane>
    );
  }
}

export default ResourceSharingRequest;
