import { TimeShape } from '../Types';

const timeNow = (): TimeShape => {
  return { locale: new Date(Date.now()).toLocaleString(), epoch: Date.now() };
};

export default timeNow;
