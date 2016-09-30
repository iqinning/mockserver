'use strict';
import request from "request";
import Base from './base.js';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html
        // console.log(this.http.url)
        const prefix = '/api/';
        const data = await this.model('mockserver').where("api_url='" + this.http.url.replace('/api/', '') + "'").find();
        if (!think.isEmpty(data)) {
            var item = data;
            var _this = this;
            let headers;
            if (item.is_proxy === 0) {
                if (item.api_header) {
                    headers = item.api_header.split(':');
                    this.http.header(prefix + headers[0], headers[1].replace(/\r\n/ig, '').replace(/\n/ig, ''));
                }
                this.json(item.api_content)
            } else {
                if (item.proxy_prefix) {
                    _this.getProxy(item.proxy_prefix, prefix, item.api_url)
                    // console.log(fn)
                    // this.json({message: '此接口没有提定代理地址请检查并修改2'});
                } else {
                    this.fail({message: '此接口没有提定代理地址请检查并修改'})
                }
            }
        } else {
            const project_id = this.http.headers.mock_project_id;
            const api_url = this.http.url.replace()
            if (project_id) {
                const projectItem = await this.model('project').where("project_id=" + project_id).find();
                // console.log(projectItem)
                if (!think.isEmpty(projectItem) && projectItem.proxy_url) {
                    this.getProxy(projectItem.proxy_url, prefix, this.http.url.replace('/api/', ''));
                }
            } else {
                this.fail({message: '此接口未定义'})
            }
        }
        // return this.display();
    }

    getProxy(httpPrefix, prefix, api_url) {
        const _this = this,
            method = this.method().toLowerCase();
        const post = this.post();
        switch (method.toLowerCase()) {
            case 'post':
                ;
                break;
            case 'get':
                ;
                break;
            case '':
                ;
                break;
            default:
                break;
        }
        let fn = think.promisify(request[method]);
        const curHttp = this.http;
        console.log(this.http.headers)
        let url = httpPrefix + prefix + api_url;
        curHttp.url = url;
        let send = {
            url: url,
            form: post,
            // headers:this.http.headers
        };
        if (method === 'get') {
            send.headers = {
                'authorization': this.http.headers.authorization
            }
        }
        // console.log(curHttp)
        fn(send).then(function (content) {
            for (var item in content.headers) {
                // console.log(item)
                _this.header(item, content.headers[item])
            }
            console.log(content.body)
            _this.json(content.body);
        }).catch(function (err) {
            console.log(err)
        });
    }
}