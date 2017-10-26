import React, { Component } from 'react';
import SchemaForm from './schema-form/SchemaForm';

class ResourceSharingRequestForm extends Component {
  
  render () {
    
    return (
      <SchemaForm onCancel={this.props.onCancel} />
    );
  }
}

export default ResourceSharingRequestForm;
