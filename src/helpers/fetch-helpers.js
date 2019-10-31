import humps from 'humps';

import FailResponseError from './fail-response-error';

function headers() {
  return {
    'Accept': '*/*',
    'content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
}

function headersMultipartFormData() {
  return {
    'Accept': '*/*',
    'X-Requested-With': 'XMLHttpRequest',
  };
}

export default {
  checkSuccess(response) {
    if (response.status >= 400) {
      return response.json().then((json) => {
        throw new FailResponseError(response, json.errors, json);
      });
    }

    return response;
  },

  toJSON(response) {
    if (response.status === 204) {
      return response;
    }

    return response.json();
  },

  postMultipartFormData(url, formData) {
    return fetch(url, {
      method: 'post',
      headers: headersMultipartFormData(),
      credentials: 'same-origin',
      body: formData,
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  post(url, params) {
    return fetch(url, {
      method: 'post',
      headers: headers(),
      credentials: 'same-origin',
      body: JSON.stringify(humps.decamelizeKeys(params)),
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  get(url, params: {}) {
    const urlObject = new URL(url);
    Object.keys(params).forEach(key => urlObject.searchParams.append(key, params[key]));

    return fetch(urlObject, {
      method: 'get',
      headers: headers(),
      mode: 'no-cors',
      credentials: 'same-origin',
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  put(url, params) {
    return fetch(url, {
      method: 'put',
      headers: headers(),
      credentials: 'same-origin',
      body: JSON.stringify(humps.decamelizeKeys(params)),
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  patch(url, params) {
    return fetch(url, {
      method: 'PATCH',
      headers: headers(),
      credentials: 'same-origin',
      body: JSON.stringify(humps.decamelizeKeys(params)),
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  patchMultipartFormdata(url, params) {
    return fetch(url, {
      method: 'PATCH',
      headers: headersMultipartFormData(),
      credentials: 'same-origin',
      body: params,
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },

  delete(url) {
    return fetch(url, {
      method: 'delete',
      headers: headers(),
      credentials: 'same-origin',
    })
      .then(this.checkSuccess)
      .then(this.toJSON)
      .then(humps.camelizeKeys);
  },
};
