import agent from '@fe/utils/lib/ajax-agent';

agent.devPost = function (url, options = {}) {
    options.isRawUrl = true;
    url = '/_/matriks/api' + url;
    return agent('post', url, options);
};

export default agent;
