import React, { Component } from 'react';
import SchemaForm from './schema-form/SchemaForm';

class ResourceSharingRequestForm extends Component {
  
  render () {
    
    return (
      <SchemaForm {...this.props} />
    );
  }
}

export default ResourceSharingRequestForm;
