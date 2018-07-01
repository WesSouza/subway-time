import * as React from 'react';

interface IProps {
  default: boolean;
  path?: string;
}

const NotFound = ({ path }: IProps) => <div>Not Found</div>;

export default NotFound;
