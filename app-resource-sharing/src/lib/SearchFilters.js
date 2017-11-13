import React, { Component, PropTypes } from 'react'; // eslint-disable-line
import Pane from '@folio/stripes-components/lib/Pane'; // eslint-disable-line
import transitionToParams from '@folio/stripes-components/util/transitionToParams'; // eslint-disable-line
import {AccordionSet, Accordion, FilterAccordionHeader} from '@folio/users/node_modules/@folio/stripes-components/lib/Accordion'; // eslint-disable-line
import FilterControlGroup from '@folio/stripes-components/lib/FilterControlGroup'; // eslint-disable-line
import Checkbox from '@folio/stripes-components/lib/Checkbox'; // eslint-disable-line

class SearchFilters extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }
  
  onChangeFilter(e) {
    const filters = Object.assign({}, this.state.filters);
    filters[e.target.name] = e.target.checked;
    this.setState({ filters });
    this.transitionToParams({ filters: Object.keys(filters).filter(key => filters[key]).join(',') });
  }
  
  constructor(props) {
    super(props);
    
    this.state = {
      filters: {}
    };
    
    this.transitionToParams = transitionToParams.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
  }
  
  render () {
    
    const { filterConfig, header } = this.props;
    const filters = this.state.filters;
    const filterLists = this.state.filterLists;
    
    return (
      <Pane id="pane-filter" defaultWidth="16%" header={header}>
        <AccordionSet>
          {filterConfig.map((group, index) => {
            
            let ocf = this.onChangeFilter;
            
            return <Accordion label={group.label} id={`${group.name}-${index}`} key={index} contentId={`${group.name}-${index}--content`} separator={false} header={FilterAccordionHeader}>
              <FilterControlGroup label={group.label}>
                {group.values.map((value, index) => (
                    
                  <Checkbox
                    key={index}
                    id={`${group.name}.${value.name}-ItemFilter`}
                    label={value.label ? value.label : value.name}
                    name={`${group.name}.${value.name}`}
                    checked={!!filters[`${group.name}.${value.name}`]}
                    onChange={ocf}
                    marginBottom0
                    hover
                    fullWidth
                  />))}
              </FilterControlGroup>
            </Accordion>
          })}
        </AccordionSet>
      </Pane>
    )
  }
}

export default SearchFilters;