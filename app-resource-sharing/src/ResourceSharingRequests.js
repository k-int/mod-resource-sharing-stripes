import React, { Component, PropTypes } from 'react';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import TextField from '@folio/stripes-components/lib/TextField';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import makePathFunction from '@folio/stripes-components/util/makePathFunction';
import Filters from './lib/ResourceSharingRequestFilters';
import FilterPaneSearch from '@folio/stripes-components/lib/FilterPaneSearch';
import queryString from 'query-string';
import { debounce } from 'lodash';

class ResourceSharingRequests extends Component {
  
  static manifest = Object.freeze({
    requests: {
      type: 'okapi',
      path: 'request',
      clientGeneratePk: false
    }
  });
  
  static propTypes = {
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string
    }).isRequired
  };
  
  constructor(props) {
    super(props);
    this.initState (props);
    
    // Rebinding of methods, to ensure correct scope.
    this.selectRow = this.selectRow.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchClear = this.searchClear.bind(this);
    this.searchDo = debounce(this.searchDo, 450).bind(this);
    this.sort = this.sort.bind(this);
    this.transitionToParams = transitionToParams.bind(this);
  }
  
  initState (props) {
    const query = props.location.search ? queryString.parse(props.location.search) : {};
    this.state = {
      selectedItem: {},
      searchTerm: query.query || '',
      filters: {}
    };
    if (query.sortOrder) this.state['sortOrder'] = query.sortOrder;
    if (query.sortDirection) this.state['sortDirection'] = query.sortDirection;
    if (query.sortOrder && query.sortDirection) this.state['cqlSort'] = query.sortOrder + ' ' + query.sortDirection;
  }

  selectRow (e, meta) {
    this.setState({ selectedItem: meta });
  }
  
  searchChange (e) {
    const query = e.target.value;
    this.setState({ searchTerm: query });
    this.searchDo(query);
  }
  
  searchClear () {
    this.props.stripes.logger.log('action', 'cleared search');
    this.setState({ searchTerm: '' });
    this.transitionToParams({ query: '' });
  }
  
  searchDo (query) {
    this.props.stripes.logger.log('action', `searched for '${query}'`);
    this.transitionToParams({ query });
  }
  
  sort (e, meta) {
    const sortOrder = meta.alias;
    const sortDirection = this.state.sortOrder === sortOrder ? (this.state.sortDirection == 'asc' ? 'desc' : 'asc') : 'asc';
    const cqlSort = sortOrder + ' ' + sortDirection;
    
    this.props.stripes.logger.log('action', `sorted by ${cqlSort}`);
    this.setState({ sortOrder, sortDirection, cqlSort });
    this.transitionToParams({ sortOrder, sortDirection });
  }
  
  onClickCreate = (e) => {
    if (e) e.preventDefault();
    this.log('action', 'clicked "Create request"');
    this.transitionToParams({ layer: 'create' });
  }

  onClickCloseCreate = (e) => {
    if (e) e.preventDefault();
    this.log('action', 'clicked "Close Create request"');
    removeQueryParam('layer', this.props.location, this.props.history);
  }

  render () {
    
    const items = this.props.data.requests || [];
    
    const searchHeader = <FilterPaneSearch id="search"
      onChange={this.searchChange} onClear={this.searchClear} value={this.state.searchTerm} />;
    
    return (
      <Paneset>
        {/* Filters */}
        <Filters 
          header={searchHeader} defaultWidth="16%" location={this.props.location} history={this.props.history} />
        
        {/* Results Pane */}
        <Pane
          defaultWidth="84%"
          paneTitle={
            <div style={{ textAlign: 'center' }}>
              <strong>Resource Sharing Requests</strong>
              <div>
                <em>{items.length} Result{items.length == 1 ? '' : 's'} Found</em>
              </div>
            </div>
          }
        >
          <MultiColumnList
            contentData={items}
            rowMetadata={['id']}
            visibleColumns={['title', 'subTitle', 'titleOfArticle', 'itemType']}
            fullWidth
            selectedRow={this.state.selectedItem}
            onHeaderClick={this.sort}
            onRowClick={this.selectRow}
          />
        </Pane>
      </Paneset>
    );
  }
}

export default ResourceSharingRequests;
