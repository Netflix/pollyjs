import Adapter from '@pollyjs/adapter';

export default class PuppeteerAdapter extends Adapter<{
  page: any;
  requestResourceTypes?: string[];
}> {}
