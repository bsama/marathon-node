'use strict';

describe('apps', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    it('should have alias apps --> app', function() {
        expect(marathon.app).to.equal(marathon.apps);
    });

    describe('#getList()', function() {
        it('should get list of apps', function() {
            var response = {
                apps: [
                    {
                        id: '/my-app',
                        cmd: 'node /src/start.js',
                        args: null,
                        user: null,
                        env: {},
                        instances: 1,
                        cpus: 1,
                        mem: 1024
                    }
                ]
            };

            var query = {
                id: 'test-id'
            };

            var scope = nock(MARATHON_HOST)
                .get('/v2/apps')
                .query(query)
                .reply(200, response);

            return marathon.app.getList(query).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#create()', function() {
        it('should create new app', function() {
            var appConfig = {
                id: '/tools/docker/registry',
                instances: 1,
                cpus: 0.5,
                mem: 4096,
                disk: 0
            };

            var scope = nock(MARATHON_HOST)
                .post('/v2/apps', appConfig)
                .reply(200, appConfig);

            return marathon.app.create(appConfig).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(appConfig);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#getOne()', function() {
        it('should get one app by id', function() {
            var response = {
                app: {
                    id: '/my-app',
                    cmd: 'node /src/start.js',
                    args: null,
                    user: null,
                    env: {},
                    instances: 1,
                    cpus: 1,
                    mem: 1024
                }
            };

            var appId = 'my-app';
            var query = {
                embed: ['app.deployments', 'app.lastTaskFailure']
            };

            var scope = nock(MARATHON_HOST)
                .get('/v2/apps/' + appId)
                .query(query)
                .reply(200, response);

            return marathon.app.getOne(appId, query).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#update()', function() {
        it('should update existing app', function() {
            var appConfig = {
                id: '/tools/docker/registry',
                instances: 1,
                cpus: 0.5,
                mem: 4096,
                disk: 0
            };

            var response = {
                deploymentId: '5ed4c0c5-9ff8-4a6f-a0cd-f57f59a34b43',
                version: '2015-09-29T15:59:51.164Z'
            };

            var appId = '/tools/docker/registry';

            var scope = nock(MARATHON_HOST)
                .put('/v2/apps/' + appId, appConfig)
                .query({
                    force: true
                })
                .reply(200, response);

            return marathon.app.update(appId, appConfig, true).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#destroy()', function() {
        it('should destroy app by id', function() {
            var response = {
                deploymentId: '5ed4c0c5-9ff8-4a6f-a0cd-f57f59a34b43',
                version: '2015-09-29T15:59:51.164Z'
            };

            var appId = '/tools/docker/registry';

            var scope = nock(MARATHON_HOST)
                .delete('/v2/apps/' + appId)
                .query({
                    force: true
                })
                .reply(200, response);

            return marathon.app.destroy(appId, true).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#restart()', function() {
        it('should restart app by id', function() {
            var response = {
                deploymentId: '5ed4c0c5-9ff8-4a6f-a0cd-f57f59a34b43',
                version: '2015-09-29T15:59:51.164Z'
            };

            var appId = '/tools/docker/registry';

            var scope = nock(MARATHON_HOST)
                .post('/v2/apps/' + appId + '/restart')
                .query({
                    force: true
                })
                .reply(200, response);

            return marathon.app.restart(appId, true).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#getTasks()', function() {
        it('should get tasks of certain app', function() {
            var response = {
                tasks: [
                    {
                        id: 'my-task.7558c5d5-2f2b-11e6-b32b-56847afe9799',
                        host: '10.10.10.22',
                        ports: [
                            8110
                        ],
                        startedAt: '2016-06-10T16:50:39.905Z',
                        stagedAt: '2016-06-10T16:50:38.024Z',
                        version: '2016-06-10T16:50:37.535Z'
                    }
                ]
            };

            var appId = 'my-app';

            var scope = nock(MARATHON_HOST)
                .get('/v2/apps/' + appId + '/tasks')
                .reply(200, response);

            return marathon.app.getTasks(appId).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#killTasks()', function() {
        it('should kill tasks of certain app', function() {
            var response = {
                tasks: [
                    {
                        id: 'my-task.7558c5d5-2f2b-11e6-b32b-56847afe9799',
                        host: '10.10.10.22',
                        ports: [
                            8110
                        ],
                        startedAt: '2016-06-10T16:50:39.905Z',
                        stagedAt: '2016-06-10T16:50:38.024Z',
                        version: '2016-06-10T16:50:37.535Z'
                    }
                ]
            };

            var appId = 'my-app';

            var scope = nock(MARATHON_HOST)
                .delete('/v2/apps/' + appId + '/tasks')
                .reply(200, response);

            return marathon.app.killTasks(appId).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#killTask()', function() {
        it('should kill task of certain app', function() {
            var response = {
                task: [
                    {
                        id: 'my-task.7558c5d5-2f2b-11e6-b32b-56847afe9799',
                        host: '10.10.10.22',
                        ports: [
                            8110
                        ],
                        startedAt: '2016-06-10T16:50:39.905Z',
                        stagedAt: '2016-06-10T16:50:38.024Z',
                        version: '2016-06-10T16:50:37.535Z'
                    }
                ]
            };

            var appId = 'my-app';
            var taskId = 'my-task.7558c5d5-2f2b-11e6-b32b-56847afe9799';

            var scope = nock(MARATHON_HOST)
                .delete('/v2/apps/' + appId + '/tasks/' + taskId)
                .reply(200, response);

            return marathon.app.killTask(appId, taskId).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#getVersions()', function() {
        it('should get versions of app by id', function() {
            var response = {
                versions: [
                    '2016-06-10T16:50:37.535Z',
                    '2016-06-09T08:25:21.587Z',
                    '2016-06-09T08:16:00.970Z',
                    '2016-06-09T08:05:34.710Z',
                    '2016-06-09T07:55:47.524Z'
                ]
            };

            var appId = 'my-app';

            var scope = nock(MARATHON_HOST)
                .get('/v2/apps/' + appId + '/versions')
                .reply(200, response);

            return marathon.app.getVersions(appId).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#getVersion()', function() {
        it('should get version of app by id', function() {
            var response = {
                id: '/my-app',
                cmd: 'node /src/start.js',
                args: null,
                user: null,
                env: {},
                instances: 1,
                cpus: 1,
                mem: 1024
            };

            var appId = 'my-app';
            var versionId = '2016-06-10T16:50:37.535Z';

            var scope = nock(MARATHON_HOST)
                .get('/v2/apps/' + appId + '/versions/' + versionId)
                .reply(200, response);

            return marathon.app.getVersion(appId, versionId).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });
});
