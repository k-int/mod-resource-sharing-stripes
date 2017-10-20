import React, { Component } from "react";
import RJSForm from "react-jsonschema-form";

import schema from "./ResourceSharingRequest.json"


class SchemaForm extends Component {
  
  render () {
    
    return (
      <RJSForm schema={schema} />
    )
  }
}

export default SchemaForm;