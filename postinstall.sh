[ ! -e 'dist/app-resource-sharing' ] || (cd 'dist/app-resource-sharing' && yarn link && cd ../ && yarn link @k-int/resource-sharing)
# cd plugin-schema-forms && yarn link && cd ../ && yarn link @folio/plugin-schema-forms
