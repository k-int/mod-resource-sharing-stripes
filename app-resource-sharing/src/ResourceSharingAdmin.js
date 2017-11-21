import React, { Component, PropTypes } from 'react';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import makePathFunction from '@folio/stripes-components/util/makePathFunction';
import SearchFilters from './lib/SearchFilters';
import FilterPaneSearch from '@folio/stripes-components/lib/FilterPaneSearch';
import Button from '@folio/stripes-components/lib/Button';
import queryString from 'query-string';
import { debounce } from 'lodash';
import CreateForm from './ResourceSharingRequestForm';
import Layer from '@folio/stripes-components/lib/Layer';
import removeQueryParam from '@folio/users/removeQueryParam';
import stringReplace from 'react-string-replace';

class ResourceSharingAdmin extends Component {
  
  static visibleFields = ['title', 'subTitle', 'titleOfArticle', 'itemType'];
  
  static manifest = Object.freeze({
    requests: {
      type: 'okapi',
      path: (queryParams, pathComponents, resourceData) => {
        let pars = {
          match: [],
          term: queryParams.query
        }; 
        for (let field of ResourceSharingAdmin.visibleFields) {
          pars.match.push(`${field}`);
        }
        
        if (queryParams && "filters" in queryParams && queryParams.filters) {
          let filters = queryParams.filters.split(',');
          
          // Each filter in the form 'propertyName.value'
          let joinedFilters = {};
          for (let filter of filters) {
            let tuple = filter.split('.');
            let disjunc = joinedFilters[tuple[0]];
            
            // =i= is our case insensitive equals. Only matters if we are dealing with text.
            if (!disjunc) {
              disjunc = `${tuple[0]}=i=${tuple[1]}`;
            } else {
              disjunc += `|| ${tuple[0]}=i=${tuple[1]}`;
            }
            
            joinedFilters[tuple[0]] = disjunc;
          }
          
          // We now need to combine the filter types conjuctively.
          pars.filters = [];
          for (const filterProp of Object.keys(joinedFilters)) {
            pars.filters.push(joinedFilters[filterProp]);
          }
        }
        let qPars = queryString.stringify( pars );
        
        console.log(qPars);
        
        let reqStr = `requests?${ qPars }`;
        return reqStr;
      },
      POST: {
        path: 'requests'
      },
      PUT: {
        path: 'requests/${id}', // eslint-disable-line no-template-curly-in-string
      },
      DELETE: {
        path: 'requests/${id}', // eslint-disable-line no-template-curly-in-string
      },
      clientGeneratePk: false
    }
  });
  
  static propTypes = {
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      user: PropTypes.shape.isRequired
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string
    }).isRequired
  };
  
  constructor(props) {
    super(props);  
    
    // Rebinding of methods, to ensure correct scope.
    this.selectRow = this.selectRow.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchClear = this.searchClear.bind(this);
    this.searchDo = debounce(this.searchDo, 450).bind(this);
    this.sort = this.sort.bind(this);
    this.transitionToParams = transitionToParams.bind(this);
    
    this.initState (props);  
  }
  
  initState (props) {
    const query = props.location.search ? queryString.parse(props.location.search) : {};
    this.state = {
      selectedItem: {},
      searchTerm: query.query || '',
      filters: {},
      searchHighlighterFormatter: {} 
    };
    
    for (let field of ResourceSharingAdmin.visibleFields) {
      this.state.searchHighlighterFormatter[`${field}`] = ((data) => {
        
        if (!this.state.searchTerm || this.state.searchTerm == '') return <span>{data[`${field}`]}</span>;
        
        let escSearchText = this.state.searchTerm.replace(/([.*+?^${}()|[\]\\])/g, '\\$1');
        let text = data[`${field}`];
        
        text = stringReplace(text, new RegExp(`(${escSearchText})`, 'gi'), (match, i) => (
          <strong key={i} style={{'border-bottom': '1px dotted', 'font-size': '1.15rem'}}>{match}</strong>
        ));
        
        return <span>{text}</span>;
      }).bind(this)
    }

    const { stripes, location: { pathname } } = this.props;
    const currentUser = stripes.user ? stripes.user.user : undefined;
    const currentPerms = stripes.user ? stripes.user.perms : undefined;
    
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
    this.props.stripes.logger.log('action', 'clicked "Create request"');
    this.transitionToParams({ layer: 'create' });
  }

  onClickCloseCreate = (e) => {
    if (e) e.preventDefault();
    this.props.stripes.logger.log('action', 'clicked "Close Create request"');
    removeQueryParam('layer', this.props.location, this.props.history);
  }
  
  saveRecord = ({formData}) => {
    console.log(formData);
    this.props.mutator.requests.POST(formData).then(()=>{
      this.onClickCloseCreate();
    });
  };
  
  static filterConfig = [
    {
      label: 'Item Type',
      name: 'itemType',
      values: [
        { label: 'Serial',  name: 'serial' },
        { label: 'Book',    name: 'book' }
      ],
    }
  ];

  render () {
    
    const items = this.props.data.requests || [];
    const query = location.search ? queryString.parse(location.search) : {};
    const searchHeader = <FilterPaneSearch id="rs-admin-search"
      onChange={this.searchChange} onClear={this.searchClear} value={this.state.searchTerm} />;
    
    return (
      <Paneset>
        {/* Filters */}
        <SearchFilters 
          header={searchHeader} defaultWidth="16%" id="rs-admin-pane-filter" filterConfig={ResourceSharingAdmin.filterConfig} location={this.props.location} history={this.props.history} />
        
        {/* Results Pane */}
        <Pane
          defaultWidth="84%"
          paneTitle={
            <div style={{ textAlign: 'center' }}>
              <strong>Administer Resource Sharing Requests</strong>
              <div>
                <em>{items.length} Result{items.length == 1 ? '' : 's'} Found</em>
              </div>
            </div>
          }
          lastMenu={<Button id="clickable-rs-admin-create" title="Administer resource sharing request" onClick={this.onClickCreate} buttonStyle="primary paneHeaderNewButton">Admin</Button>}
        ><MultiColumnList
            contentData={items}
            rowMetadata={['id']}
            visibleColumns={ResourceSharingAdmin.visibleFields}
            fullWidth
            selectedRow={this.state.selectedItem}
            formatter={this.state.searchHighlighterFormatter}
            onHeaderClick={this.sort}
            onRowClick={this.selectRow}
          />
        </Pane>
        <Layer isOpen={query.layer ? query.layer === 'create' : false} label="Create Resource Sharing Request">
          <CreateForm
            id="rs-admin-form-create"
            okapi={this.okapi}
            onCancel={this.onClickCloseCreate}
            onSubmit={this.saveRecord}
            defaultWidth="65%"
          />
        </Layer>
      </Paneset>
    );
  }
}

export default ResourceSharingAdmin;