import React, { Component } from "react";
import RJSForm from "react-jsonschema-form";
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import schema from "./ResourceSharingRequest.json"
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';


class SchemaForm extends Component {
  
  
  render () {
    return (
      <Paneset>
        <Pane
          defaultWidth="100%"
          firstMenu={<PaneMenu><button id="clickable-close" onClick={this.props.onCancel} title="close" aria-label="Close"><span style={{ fontSize: '30px', color: '#999', lineHeight: '18px' }} >&times;</span></button></PaneMenu>} 
        >
          <RJSForm 
            id={this.props.id}
            schema={schema}
            width={this.props.defaultWidth ? this.props.defaultWidth : '100%'}
            liveValidate={true}
            onSubmit={this.props.onSubmit}/>
        </Pane>
      </Paneset>
    )
  }
}

export default SchemaForm;