import React, { Component, PropTypes } from 'react'; // eslint-disable-line
import Button from '@folio/stripes-components/lib/Button'; // eslint-disable-line
import Pane from '@folio/stripes-components/lib/Pane'; // eslint-disable-line
import filterPaneCss from '@folio/stripes-components/lib/FilterPaneSearch/FilterPaneSearch.css'; // eslint-disable-line
import FilterGroups, { initialFilterState, onChangeFilter as filterChange } from '@folio/stripes-components/lib/FilterGroups';
import FilterControlGroup from '@folio/stripes-components/lib/FilterControlGroup';
import Icon from '@folio/stripes-components/lib/Icon'; // eslint-disable-line
import transitionToParams from '@folio/stripes-components/util/transitionToParams'; // eslint-disable-line

class ResourceSharingRequestFilters extends Component {

  
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  
  static filterConfig = [
    {
      label: 'Status',
      name: 'active',
      cql: 'active',
      values: [
        { name: 'Active', cql: 'true' },
        { name: 'Inactive', cql: 'false' },
      ],
    }
  ];
  
  constructor(props) {
    super(props);
    
    this.state = {
      filters: {}
    };
    
    if (!this.props.header) {
      this.header = <div>
        <Button className={filterPaneCss.headerSearchClearButton} ><Icon icon="clearX" iconClassName={filterPaneCss.clearIcon}/></Button>
      </div>;
    } else {
      this.header = props.header;
    }
    
    this.filterChange = filterChange.bind(this);
    this.transitionToParams = transitionToParams.bind(this);
  }
  
  updateFilters (filters) {
    this.transitionToParams({ filters: Object.keys(filters).filter(key => filters[key]).join(',') });
  }

  render () {
    const props = this.props;
    return (
      <Pane {...props} header={this.header} >
        <FilterGroups config={ResourceSharingRequestFilters.filterConfig} filters={this.state.filters} onChangeFilter={this.filterChange} />
      </Pane>
    );
  }
}

export default ResourceSharingRequestFilters;
