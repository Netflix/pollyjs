import fetch, { Response, Request, Headers } from 'node-fetch';

global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;
