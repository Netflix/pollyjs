import uniqWith from 'lodash-es/uniqWith';

export function addEntries(har, entries = []) {
  har.log.entries = uniqWith([...entries, ...har.log.entries], (a, b) => {
    a._pollyjs_meta.id !== b._pollyjs_meta.id &&
      a._pollyjs_meta.order !== b._pollyjs_meta.order;
  });

  this.sortEntries();
}

export function sortEntries(har) {
  har.log.entries = har.log.entries.sort(
    (a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime)
  );
}

export function harRequest(request) {

}
