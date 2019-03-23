import * as React from 'react';

interface IProps {
  default: boolean;
  path?: string;
}

const NotFound = (_props: IProps) => <div>Not Found</div>;

export default NotFound;
