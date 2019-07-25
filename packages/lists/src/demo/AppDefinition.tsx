// tslint:disable:no-any
import { IAppDefinition } from '@uifabric/example-app-base';

export const AppDefinition: IAppDefinition = {
  appTitle: 'Fabric - React',

  testPages: [],
  examplePages: [
    {
      links: [
        {
          component: require<any>('../components/DetailsList/DetailsListPage').DetailsListPage,
          key: 'DetailsList',
          name: 'DetailsList',
          url: '#/examples/detailslist'
        },
        {
          component: require<any>('../components/LegacyDetailsList/DetailsListPage').DetailsListPage,
          key: 'LegacyDetailsList',
          name: 'LegacyDetailsList',
          url: '#/examples/legacydetailslist'
        }
      ]
    }
  ],
  headerLinks: [
    {
      name: 'Getting started',
      url: '#/'
    },
    {
      name: 'Fabric',
      url: 'http://dev.office.com/fabric'
    },
    {
      name: 'Github',
      url: 'http://www.github.com/officedev'
    }
  ]
};
