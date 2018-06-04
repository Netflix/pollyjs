import ajax from './ajax';
import Persister from '../persister';
import buildUrl from '../../utils/build-url';
import stringify from 'json-stable-stringify';

export default class RestPersister extends Persister {
  ajax(url, ...args) {
    const { host, apiNamespace } = this.config;

    return ajax(buildUrl(host, apiNamespace, url), ...args);
  }

  findRecordingEntry(pollyRequest) {
    const { id, order, recordingId } = pollyRequest;

    return this.ajax(
      `/${encodeURIComponent(recordingId)}/${id}?order=${order}`,
      {
        Accept: 'application/json; charset=utf-8'
      }
    ).catch(e => {
      if (e && e.status === 404) {
        return null;
      }

      throw e;
    });
  }

  findRecording(recordingId) {
    return this.ajax(`/${encodeURIComponent(recordingId)}`, {
      Accept: 'application/json; charset=utf-8'
    }).catch(e => {
      if (e && e.status === 404) {
        return null;
      }

      throw e;
    });
  }

  async saveRecording(recordingId, data) {
    await this.ajax(`/${encodeURIComponent(recordingId)}`, {
      method: 'POST',
      body: stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json; charset=utf-8'
      }
    });
  }

  async deleteRecording(recordingId) {
    await this.ajax(`/${encodeURIComponent(recordingId)}`, {
      method: 'DELETE'
    });
  }
}
