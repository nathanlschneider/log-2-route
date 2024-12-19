import { TimeShape } from '../types/types';

const timeNow = (): TimeShape => {
  return { locale: new Date(Date.now()).toLocaleString(), epoch: Date.now() };
};

export default timeNow;
