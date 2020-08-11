import { MtaPathKeys } from '../_constants';
import { passthrough } from '../_mtaPassthrough';

export default passthrough(MtaPathKeys.getAdvisoryDetail, 60 * 1000);
