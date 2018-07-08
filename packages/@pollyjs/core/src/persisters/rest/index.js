import Persister from '@pollyjs/persister';
import buildUrl from '../../utils/build-url';
import ajax from './ajax';

export default class RestPersister extends Persister {
  ajax(url, ...args) {
    const { host, apiNamespace } = this.config;

    return ajax(buildUrl(host, apiNamespace, url), ...args);
  }

  async findRecording(recordingId) {
    const response = await this.ajax(`/${encodeURIComponent(recordingId)}`, {
      Accept: 'application/json; charset=utf-8'
    });

    return this._normalize(response);
  }

  async saveRecording(recordingId, data) {
    await this.ajax(`/${encodeURIComponent(recordingId)}`, {
      method: 'POST',
      body: this.stringify(data),
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

  _normalize({ xhr, body }) {
    /**
     * 204 - No Content. Polly uses this status code in place of 404
     * when interacting with our Rest server to prevent throwing
     * request errors in consumer's stdout (console.log)
     */
    if (xhr.status === 204) {
      /* return null when a record was not found */
      return null;
    }

    return body;
  }
}
