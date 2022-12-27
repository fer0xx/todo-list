const api = {
    baseUrl: 'http://localhost:3000/',
    doRequest: async function(method, id, data) {
        return await fetch(
            this.baseUrl + (id ?? ''),
            {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                }
            }
        ).then((response) => {
            if (method !== 'DELETE') {
                return response.json();
            } else {
                return null;
            }
        });
    },
    get: function(id) {
        return this.doRequest('GET', id);
    },
    create: function(data) {
        return this.doRequest('POST', null, data);
    },
    update: function(id, data) {
        return this.doRequest('PUT', id, data);
    },
    delete: function(id) {
        return this.doRequest('DELETE', id);
    }
};


