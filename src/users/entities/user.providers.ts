import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { appConstants } from '../../app.constants';

export const userProviders = [
  {
    provide: appConstants.user_repository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [appConstants.data_source_pg],
  },
];
